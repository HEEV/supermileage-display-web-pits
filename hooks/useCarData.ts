import { useEffect, useState } from "react";

export function useCarData(car: string) {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/mqtt/data?car=${car}`);
        const json = await res.json();

        if (mounted) {
          setData(json.data);
          setIsConnected(true);
        }
      } catch (err) {
        console.error(err);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [car]);

  return { data, isConnected };
}