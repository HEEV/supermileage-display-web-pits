import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient, IClientOptions, IClientPublishOptions } from 'mqtt';

interface UseMqttProps {
  uri: string;
  options?: IClientOptions;
  topic: string;
}

export const useMqtt = ({ uri, options, topic }: UseMqttProps) => {
  const clientRef = useRef<MqttClient | null>(null);
  //const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<{ topic: string; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const mqttClient = mqtt.connect(uri, {
      ...options,
      reconnectPeriod: 5000, 
    });

    mqttClient.on('connect', () => {
        if (cancelled) { mqttClient.end(true); return; }
        setIsConnected(true);
        mqttClient.subscribe(topic);
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT Connection Error: ', err);
      mqttClient.end();
    });

    mqttClient.on('message', (t, msg) => {
        if (!cancelled) setLastMessage({ topic: t, message: msg.toString() });
      });
    clientRef.current = mqttClient;
    return () => {
        cancelled = true;
        mqttClient.end(true);
        clientRef.current = null;
    };
  }, [uri]); 

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

