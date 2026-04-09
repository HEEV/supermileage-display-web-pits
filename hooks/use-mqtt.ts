import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient, IClientOptions, IClientPublishOptions } from 'mqtt';

interface UseMqttProps {
  uri: string;
  options?: IClientOptions;
  topic: string;
  onAuthFailure?: (reason?: string) => void;
  onMessage?: (topic: string, message: string) => void;
}

// Build a stable-ish client id so parallel tabs/sessions do not collide.
const createClientId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
};

export const useMqtt = ({ uri, options, topic, onAuthFailure, onMessage }: UseMqttProps) => {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<{ topic: string; message: string } | null>(null);

  // Detect auth failures from MQTT reason codes and common broker error text.
  const isAuthError = (err: unknown) => {
    if (!err || typeof err !== 'object') return false;

    const mqttErr = err as {
      message?: string;
      code?: unknown;
    };

    const code = typeof mqttErr.code === 'number' ? mqttErr.code : null;
    // mqtt.js ErrorWithReasonCode: 4 = bad username/password, 5 = not authorized.
    if (code === 4 || code === 5) return true;

    const message = (mqttErr.message ?? '').toLowerCase();

    return (
      message.includes('not authorized') ||
      message.includes('bad username or password') ||
      message.includes('not authorised') ||
      message.includes('unauth') ||
      message.includes('auth')
    );
  };

  // Manage the MQTT connection lifecycle for the current uri/topic/options set.
  useEffect(() => {
    let cancelled = false;
    let authFailureTriggered = false;
    const resolvedUri =
      typeof window !== 'undefined' && window.location.protocol === 'https:'
        ? uri.replace(/^ws:/, 'wss:')
        : uri;

    let mqttClient: MqttClient;
    try {
      const connectOptions: IClientOptions = {
        ...options,
        clientId: options?.clientId ?? createClientId('web-client'),
        reconnectPeriod: 5000,
      };

      mqttClient = mqtt.connect(resolvedUri, {
        ...connectOptions,
      });
    } catch (err) {
      console.error('MQTT initialization failed:', err);
      return;
    }

    mqttClient.on('connect', () => {
        if (cancelled) { mqttClient.end(true); return; }
        setIsConnected(true);
        mqttClient.subscribe(topic);
    });

    mqttClient.on('close', () => {
        setIsConnected(false);
      });
      
      mqttClient.on('offline', () => {
        setIsConnected(false);
      });

    mqttClient.on('error', (err) => {
      console.error('MQTT Connection Error: ', err);

      if (!authFailureTriggered && isAuthError(err)) {
        authFailureTriggered = true;
        onAuthFailure?.(err.message);
        mqttClient.end(true);
      }
    });

    mqttClient.on('message', (t, msg) => {
        if (!cancelled) {
          setLastMessage({ topic: t, message: msg.toString() });
          onMessage?.(t, msg.toString());
        }
      });
    clientRef.current = mqttClient;
    return () => {
        cancelled = true;
        authFailureTriggered = true;
        mqttClient.end(true);
        clientRef.current = null;
    };
  }, [onAuthFailure, onMessage, options, topic, uri]); 

  // Publish helper that only writes when the current client is connected.
  const publish = useCallback(
    (targetTopic: string, message: string, pubOptions?: IClientPublishOptions) => {
      if (clientRef.current?.connected) {
        clientRef.current.publish(targetTopic, message, pubOptions || {}, (err) => {
          if (err) console.error("Publish error:", err);
        });
      } else {
        console.warn("Not connected. client:", clientRef.current, "connected:", clientRef.current?.connected);
      }
    },
    [] 
  );
  return { isConnected, lastMessage, publish };
};
