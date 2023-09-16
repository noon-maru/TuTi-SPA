import { useRef, useEffect, useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";

import styled from "styled-components";

import useRNWebBridge from "hooks/useRNWebBridge";
import getAddressCoordinates from "utils/getAddressCoordinates";

declare global {
  interface Window {
    kakao: any;
    ReactNativeWebView: any;
  }
}

interface Place {
  _id: string;
  address: string;
  image: string;
  is_landmark: boolean;
  name: string;
  numberHearts: number;
  region: string;
  tags: any[];
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const receivedData = useRNWebBridge();

  // 마커 배열을 저장할 상태 변수들을 정의
  const [wishMarkers, setWishMarkers] = useState<any[]>([]);
  const [landmarkMarkers, setLandmarkMarkers] = useState<any[]>([]);
  const [allMarkers, setAllMarkers] = useState<any[]>([]);

  const setMarkerOnMap = useCallback(
    async (address: string) => {
      const imageSrc = `${process.env.PUBLIC_URL}/icon/mapMarker.png`;
      const imageSize = new window.kakao.maps.Size(40, 40);
      const imageOption = { offset: new window.kakao.maps.Point(20, 40) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const coordinates = await getAddressCoordinates(address);
      const markerPosition = new window.kakao.maps.LatLng(
        coordinates.y,
        coordinates.x
      );

      new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      }).setMap(kakaoMap);
    },
    [kakaoMap]
  );

  // 좌표 데이터를 DB에서 가져오는 함수입니다.
  // DB에서 각 장소 데이터를 가져오고,
  // 각 장소에서 주소 데이터를 가져오고,
  // 각 주소를 좌표로 변환해서 반환.
  const getMarkerData = useCallback(
    async (type: string) => {
      // 여기에서 DB의 주소 데이터를 가져옴
      let url: string;
      let response: AxiosResponse<any, any>;
      let places: Place[];
      let addresses: string[];

      try {
        switch (type) {
          case "wish":
            url = `${process.env.REACT_APP_SERVER_URL!}${process.env
              .REACT_APP_API!}/users/${userId}/wishPlace`;

            response = await axios.get(url);
            places = response.data;
            addresses = places.map((place) => place.address);

            return await Promise.all(
              addresses.map((address) => getAddressCoordinates(address))
            );

          case "landmark":
            url =
              process.env.REACT_APP_SERVER_URL! +
              process.env.REACT_APP_API! +
              "/place";
            response = await axios.get(url);
            places = response.data;
            addresses = places
              .filter((place) => place.is_landmark)
              .map((place) => place.address);

            return await Promise.all(
              addresses.map((address) => getAddressCoordinates(address))
            );

          case "all":
            url =
              process.env.REACT_APP_SERVER_URL! +
              process.env.REACT_APP_API! +
              "/place";
            response = await axios.get(url);
            places = response.data;
            addresses = places
              .filter((place) => !place.is_landmark)
              .map((place) => place.address);

            return await Promise.all(
              addresses.map((address) => getAddressCoordinates(address))
            );

          default:
            return [];
        }
      } catch (err) {
        console.error("네트워킹 오류:", err);
        throw new Error("데이터 가져오기 실패");
      }
    },
    [userId]
  );

  // 마커를 생성하는 함수입니다.
  const createMarkers = (markerData: any[], markerSet: Set<any>) => {
    return markerData
      .map((data) => {
        const imageSrc = `${process.env.PUBLIC_URL}/icon/mapMarker.png`;
        const imageSize = new window.kakao.maps.Size(40, 40);
        const imageOption = { offset: new window.kakao.maps.Point(20, 40) };

        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        const markerPosition = new window.kakao.maps.LatLng(data.y, data.x);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        // 이미 중복된 위치의 마커가 있다면 생성하지 않음
        if (!markerSet.has(markerPosition.toString())) {
          markerSet.add(markerPosition.toString());
          return marker;
        }

        return null;
      })
      .filter(Boolean); // null이 아닌 마커만 반환
  };

  const updateMapCenterFromAddress = useCallback(
    async (address: string) => {
      try {
        const coordinates = await getAddressCoordinates(address);
        const newLatLng = new window.kakao.maps.LatLng(
          Number(coordinates.y) - 0.004, // 마커보다 살짝 아래를 중앙으로 가리키게끔
          coordinates.x
        );
        kakaoMap.setCenter(newLatLng);
      } catch (error: any) {
        console.error("Failed to get coordinates:", error.message);
      }
    },
    [kakaoMap]
  );

  const initializeMap = useCallback(async () => {
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

    // 지도의 레벨 변경 이벤트를 감지하고 kakaoMapLevel 상태를 업데이트
    window.kakao.maps.event.addListener(createdMap, "zoom_changed", () => {
      setZoomLevel(createdMap.getLevel());
    });

    setKakaoMap(createdMap);
  }, []);

  const initializeMarker = useCallback(async () => {
    // DB에서 좌표 데이터를 가져와서 마커 배열을 초기화
    const wishMarkerData = await getMarkerData("wish");
    const landmarkMarkerData = await getMarkerData("landmark");
    const allMarkerData = await getMarkerData("all");

    // 중복된 위치의 마커를 걸러내기 위한 Set을 생성
    const wishMarkerSet = new Set(
      wishMarkers.map((marker) => marker.getPosition().toString())
    );

    // 중복된 위치의 마커를 걸러내고 마커 배열을 설정
    setWishMarkers(createMarkers(wishMarkerData, wishMarkerSet));
    setLandmarkMarkers(createMarkers(landmarkMarkerData, wishMarkerSet));
    setAllMarkers(createMarkers(allMarkerData, wishMarkerSet));
  }, [getMarkerData, wishMarkers]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (receivedData?.type === "enteringExplore") {
      setUserId(receivedData.data.userId);
      if (userId !== "") initializeMarker();
    }
  }, [initializeMarker, receivedData, userId]);

  // 마커 표시 로직
  const updateMarkers = useCallback(() => {
    if (kakaoMap) {
      if (zoomLevel >= 10) {
        allMarkers.map((marker) => marker.setMap(null));
        landmarkMarkers.map((marker) => marker.setMap(null));
        wishMarkers.map((marker) => marker.setMap(kakaoMap));
      } else if (zoomLevel >= 7) {
        allMarkers.map((marker) => marker.setMap(null));
        landmarkMarkers.map((marker) => marker.setMap(kakaoMap));
        wishMarkers.map((marker) => marker.setMap(kakaoMap));
      } else {
        allMarkers.map((marker) => marker.setMap(kakaoMap));
        landmarkMarkers.map((marker) => marker.setMap(null));
        wishMarkers.map((marker) => marker.setMap(kakaoMap));
      }
    }
  }, [zoomLevel, kakaoMap, wishMarkers, landmarkMarkers, allMarkers]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // 장소 서랍에서 장소를 선택했을 때
  useEffect(() => {
    if (kakaoMap && receivedData?.type === "placeSelect") {
      updateMapCenterFromAddress(receivedData.data.address);
      kakaoMap.setLevel(receivedData.data.zoomLevel);
    }
  }, [kakaoMap, receivedData, setMarkerOnMap, updateMapCenterFromAddress]);

  return <Map ref={mapRef} />;
};

const Map = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default KakaoMap;
