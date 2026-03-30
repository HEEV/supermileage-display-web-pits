export function usePublish() {
    const publish = async (
      topic: string,
      message: any,
      options?: any
    ) => {
      try {
        await fetch("/api/mqtt/publish", {
          method: "POST",
          body: JSON.stringify({ topic, message, options }),
        });
      } catch (err) {
        console.error("Publish failed:", err);
      }
    };
  
    return { publish };
  }