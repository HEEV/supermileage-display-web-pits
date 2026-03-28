import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient, IClientOptions, IClientPublishOptions } from 'mqtt';

interface UseMqttProps {
  uri: string;
  options?: IClientOptions;
  topic: string;
}

const createClientId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
};

export const useMqtt = ({ uri, options, topic }: UseMqttProps) => {
  const clientRef = useRef<MqttClient | null>(null);
  //const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<{ topic: string; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
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
      mqttClient.reconnect();
      //mqttClient.end();
    });

    mqttClient.on('message', (t, msg) => {
        if (!cancelled) setLastMessage({ topic: t, message: msg.toString() });
        console.log('RECEIVED:', topic, msg.toString());
      });
    clientRef.current = mqttClient;
    return () => {
        cancelled = true;
        mqttClient.end(true);
        clientRef.current = null;
    };
  }, [options, topic, uri]); 

  const publish = useCallback(
    (targetTopic: string, message: string, pubOptions?: IClientPublishOptions) => {
      if (clientRef.current?.connected) {
        clientRef.current.publish(targetTopic, message, pubOptions || {}, (err) => {
          if (err) console.error("Publish error:", err);
          else console.log("Published to", targetTopic);
        });
      } else {
        console.warn("Not connected. client:", clientRef.current, "connected:", clientRef.current?.connected);
      }
    },
    [] 
  );
//   const publish = useCallback(
//     (targetTopic: string, message: string, options?: IClientPublishOptions) => {
//       if (client && isConnected) {
//         client.publish(targetTopic, message, options || {}, (err) => {
//           if (err) console.error("Publish error:", err);
//         });
//       } else {
//         console.warn("MQTT client not connected. Cannot publish.");
//       }
//     },
//     [client, isConnected]
//   );

  return { isConnected, lastMessage, publish };
};

