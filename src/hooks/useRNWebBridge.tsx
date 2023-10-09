import { useState, useEffect } from "react";

interface PlaceSelectType {
  type: "placeSelect";
  data: { zoomLevel: number; address: string };
}

interface EnteringExplore {
  type: "enteringExplore";
  data: { userId: string };
}

interface WishClick {
  type: "wishClick";
  data: {};
}

type ReceivedDataType = PlaceSelectType | EnteringExplore | WishClick;

const useRNWebBridge = () => {
  const [receivedData, setReceivedData] = useState<ReceivedDataType | null>(
    null
  );

  // React 앱에서 RN 앱으로 메시지를 보내는 함수
  const sendMessageToRN = () => {
    // RN 웹뷰에서만 동작하도록 체크
    if (window.ReactNativeWebView) {
      const message = { type: "initialize" }; // 또는 원하는 데이터를 포함한 메시지
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  };

  const handleReceivedData = (event: any) => {
    if (typeof event.data === "string") {
      try {
        const parsedData = JSON.parse(event.data);
        setReceivedData(parsedData);

        if (parsedData.type === "enteringExplore") {
          // alert(JSON.stringify(parsedData.data));
        }
        if (parsedData.type === "placeSelect") {
          // alert(parsedData.data);
        }
        if (parsedData.type === "wishClick") {
          // alert(JSON.stringify(parsedData.data));
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

      // RN 앱에 메시지 보내기
      sendMessageToRN();

      return () => {
        addTarget.removeEventListener("message", handleReceivedData);
      };
    }
  }, []);

  return receivedData;
};

export default useRNWebBridge;
