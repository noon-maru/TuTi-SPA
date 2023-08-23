import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import useRNWebBridge from "hooks/useRNWebBridge";
import getAddressCoordinates from "utils/getAddressCoordinates";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const receivedData = useRNWebBridge();

  const initializeMap = () => {
    if (!window.kakao) {
      console.error("Kakao Map library is not loaded.");
      return;
    }

    const container = mapRef.current;
    const mapOptions = {
      center: new window.kakao.maps.LatLng(36.004081, 127.621819),
      level: 13,
    };

    const createdMap = new window.kakao.maps.Map(container, mapOptions);
    setKakaoMap(createdMap);
  };

  const setMarkerOnMap = () => {
    const imageSrc = `${process.env.PUBLIC_URL}/icon/mapMarker.png`;
    const imageSize = new window.kakao.maps.Size(40, 40);
    const imageOption = { offset: new window.kakao.maps.Point(20, 40) };

    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    const markerPosition = new window.kakao.maps.LatLng(36.004081, 127.621819);

    new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    }).setMap(kakaoMap);
  };

  const updateMapCenterFromAddress = async (address: string) => {
    try {
      const coordinates = await getAddressCoordinates(address);
      const newLatLng = new window.kakao.maps.LatLng(coordinates.y, coordinates.x);
      kakaoMap.setCenter(newLatLng);
    } catch (error: any) {
      console.error("Failed to get coordinates:", error.message);
    }
  };

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (kakaoMap) setMarkerOnMap();

    if (kakaoMap && receivedData?.type === "placeSelect") {
      updateMapCenterFromAddress(receivedData.data.address);
      kakaoMap.setLevel(receivedData.data.zoomLevel);
    }
    
  }, [kakaoMap, receivedData]);

  return <Map ref={mapRef} />;
};

const Map = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default KakaoMap;
