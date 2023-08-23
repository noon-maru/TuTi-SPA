import { useState, useEffect } from "react";

interface ReceivedDataType {
  type: string;
  data: {zoomLevel: number, address: string};
};

const useRNWebBridge = () => {
  const [receivedData, setReceivedData] = useState<ReceivedDataType | null>(null);

  const handleReceivedData = (event: any) => {
    if (typeof event.data === "string") {
      try {
        const parsedData = JSON.parse(event.data);
        setReceivedData(parsedData);

        if (parsedData.type === "placeSelect") {
          // alert(parsedData.data);
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    const isAndroid = navigator.userAgent.toLowerCase().includes("android");
    const isIOS = /iphone|ipad/.test(navigator.userAgent.toLowerCase());

    const addTarget = isAndroid ? document : isIOS ? window : null;

    if (addTarget) {
      addTarget.addEventListener("message", handleReceivedData);

      return () => {
        addTarget.removeEventListener("message", handleReceivedData);
      };
    }
  }, []);

  return receivedData;
};

export default useRNWebBridge;
