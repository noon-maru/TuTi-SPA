import { useRef, useEffect, useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";

import styled from "styled-components";

import useRNWebBridge from "hooks/useRNWebBridge";

declare global {
  interface Window {
    kakao: any;
    ReactNativeWebView: any;
  }
}

const kakao = window.kakao;

interface Coordinate {
  lat: number;
  lng: number;
  address?: string;
}

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [allPlacesData, setAllPlacesData] = useState<Place[]>([]);

  // 마커 배열을 저장할 상태 변수들을 정의
  const [wishMarkers, setWishMarkers] = useState<any[]>([]);
  const [landmarkMarkers, setLandmarkMarkers] = useState<any[]>([]);
  const [allMarkers, setAllMarkers] = useState<any[]>([]);

  const [clusterer, setClusterer] = useState<any>(null);

  const receivedData = useRNWebBridge();

  // 마커가 선택되었을 때, 호출되는 핸들러
  const handleMarkerClick = useCallback(
    (address: string) => {
      // RN 웹뷰에서만 동작하도록 체크
      if (window.ReactNativeWebView) {
        const placeData = allPlacesData.find(
          (element) => address === element.address
        );
        const message = {
          type: "markerClick",
          // InformBox에 들어갈 정보
          data: {
            placeId: placeData?._id,
            address: placeData?.address,
            markerName: placeData?.name || "일시적 오류",
            parkingInfo: placeData?.tourismInfo.parkingInfo,
            advice: placeData?.tourismInfo.advice,
            admissionFee: placeData?.tourismInfo.admissionFee,
            closedDays: placeData?.tourismInfo.closedDays,
            subwayInfo: placeData?.tourismInfo.subwayInfo,
            busInfo: placeData?.tourismInfo.busInfo,
          },
        };
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
    },
    [allPlacesData]
  );

  // 마커가 아닌 지도 부분을 선택했을 때, 호출되는 핸들러
  const handleMapClick = useCallback((mouseEvent: any) => {
    // 클릭한 위치의 좌표를 얻음
    const clickLatLng = mouseEvent.latLng;

    // RN 웹뷰에서만 동작하도록 체크
    if (window.ReactNativeWebView) {
      const message = {
        type: "mapClick",
        // 클릭한 위치의 좌표 정보를 메시지로 보냄
        data: {
          lat: clickLatLng.getLat(),
          lng: clickLatLng.getLng(),
        },
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, []);

  // 좌표 데이터를 DB에서 가져오는 함수입니다.
  const getMarkerData = useCallback(
    async (type: string) => {
      // 여기에서 DB의 좌표 데이터를 가져옴
      let url: string;
      let response: AxiosResponse<Place[]>;
      let places: Place[];
      let coordinates: Coordinate[];

      try {
        switch (type) {
          case "wish":
            if (!userId || userId === "guest") return [];

            url = `${process.env.REACT_APP_SERVER_URL!}${process.env
              .REACT_APP_API!}/users/${userId}/wishPlace`;

            response = await axios.get(url);
            places = response.data;
            coordinates = places.map((place) => ({
              address: place.address,
              lat: place.latitude,
              lng: place.longitude,
            }));

            return coordinates;

          case "landmark":
            url =
              process.env.REACT_APP_SERVER_URL! +
              process.env.REACT_APP_API! +
              "/place";
            response = await axios.get(url);
            places = response.data.filter((place: Place) => place.isLandmark);
            coordinates = places.map((place: Place) => ({
              address: place.address,
              lat: place.latitude,
              lng: place.longitude,
            }));

            return coordinates;

          case "all":
            url =
              process.env.REACT_APP_SERVER_URL! +
              process.env.REACT_APP_API! +
              "/place";
            response = await axios.get(url);
            places = response.data.filter((place: Place) => !place.isLandmark);
            coordinates = places.map((place: Place) => ({
              address: place.address,
              lat: place.latitude,
              lng: place.longitude,
            }));

            return coordinates;

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

  const updateMapCenter = useCallback(
    async (address: string, coordinates?: Coordinate) => {
      try {
        if (!coordinates) {
          coordinates = { lat: 36.004081, lng: 127.621819 };
          allPlacesData.forEach((element) => {
            if (element.address === address) {
              coordinates = { lat: element.latitude, lng: element.longitude };
            }
          });
        }
        const newLatLng = new kakao.maps.LatLng(
          Number(coordinates.lat) - 0.004, // 마커보다 살짝 아래를 중앙으로 가리키게끔
          coordinates.lng
        );
        kakaoMap.setCenter(newLatLng);
      } catch (error: any) {
        console.error("Failed to get coordinates:", error.message);
      }
    },
    [kakaoMap, allPlacesData]
  );

  // 마커를 생성하는 함수입니다.
  const createMarkers = useCallback(
    (
      type: string,
      markerData: Coordinate[],
      duplicationCheckData?: Coordinate[]
    ) => {
      return markerData
        .map((data) => {
          let imageSrc;
          switch (type) {
            case "wish":
              imageSrc = `${process.env.PUBLIC_URL}/mapMarker/mapMarker(wish).png`;
              break;
            case "landmark":
              imageSrc = `${process.env.PUBLIC_URL}/mapMarker/mapMarker(landmark).png`;
              break;
            case "all":
              imageSrc = `${process.env.PUBLIC_URL}/mapMarker/mapMarker.png`;
              break;
          }
          const imageSize = new kakao.maps.Size(40, 40);
          const imageOption = { offset: new kakao.maps.Point(20, 40) };

          const markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );

          const markerPosition = new kakao.maps.LatLng(data.lat, data.lng);

          const marker = new kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
            clickable: true,
          });

          // 마커에 클릭 이벤트를 등록
          kakao.maps.event.addListener(marker, "click", () => {
            handleMarkerClick(data?.address || "");
            updateMapCenter("", { lat: data.lat, lng: data.lng });
          });

          // 이미 중복된 위치의 마커가 있다면 생성하지 않음
          if (
            duplicationCheckData &&
            duplicationCheckData.some(
              (existingData) =>
                existingData.lat === data.lat && existingData.lng === data.lng
            )
          ) {
            return null; // 중복된 경우, null을 반환하여 마커를 생성하지 않습니다.
          }

          return marker; // 중복이 아닌 경우, 마커를 반환합니다.
        })
        .filter(Boolean); // null이 아닌 마커만 반환
    },
    [handleMarkerClick, updateMapCenter]
  );

  const initializeMap = useCallback(async () => {
    if (!kakao) {
      console.error("Kakao Map library is not loaded.");
      return;
    }

    const container = mapRef.current;
    const mapOptions = {
      center: new kakao.maps.LatLng(36.004081, 127.621819),
      level: 13,
    };

    const createdMap = new kakao.maps.Map(container, mapOptions);

    // 지도의 레벨 변경 이벤트를 감지하고 kakaoMapLevel 상태를 업데이트
    kakao.maps.event.addListener(createdMap, "zoom_changed", () => {
      setZoomLevel(createdMap.getLevel());
    });

    // 맵에 클릭 이벤트를 등록
    kakao.maps.event.addListener(createdMap, "click", handleMapClick);

    // 클러스터러 초기화
    const newClusterer = new kakao.maps.MarkerClusterer({
      map: createdMap,
      averageCenter: true,
      minLevel: 10,
      styles: [
        {
          width: "50px", // 클러스터 아이콘의 너비
          height: "50px", // 클러스터 아이콘의 높이
          background: `url(${process.env.PUBLIC_URL}/mapMarker/clusterer.png)`, // 클러스터 배경 이미지 URL
          backgroundSize: "cover", // 배경 이미지 크기 조절 옵션
          color: "black", // 클러스터 아이콘 안의 텍스트 색상
          textAlign: "center", // 텍스트 가운데 정렬
          lineHeight: "50px", // 텍스트 높이
          fontSize: "20px", // 폰트 사이즈
        },
        // 다른 스타일을 추가할 수 있음
      ],
    });

    setClusterer(newClusterer); // 클러스터러 상태 업데이트

    setKakaoMap(createdMap);
  }, [handleMapClick]);

  const initializeMarker = useCallback(async () => {
    // DB에서 좌표 데이터를 가져와서 마커 배열을 초기화
    const wishMarkerData = await getMarkerData("wish"); // 찜 한 장소 마커 좌표
    const landmarkMarkerData = await getMarkerData("landmark"); // 랜드마크 마커 좌표
    const allMarkerData = await getMarkerData("all"); // 전체 장소 마커 좌표

    // 중복된 위치의 마커를 걸러내고 마커 배열을 설정
    setWishMarkers(createMarkers("wish", wishMarkerData));
    setLandmarkMarkers(
      createMarkers("landmark", landmarkMarkerData, wishMarkerData)
    );
    setAllMarkers(createMarkers("all", allMarkerData, wishMarkerData));

    // RN 웹뷰에서만 동작하도록 체크
    if (window.ReactNativeWebView)
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "initializationComplete" })
      );
  }, [getMarkerData, createMarkers]);

  // 마커 표시 로직
  const updateMarkers = useCallback(() => {
    if (kakaoMap && clusterer) {
      clusterer.clear();

      if (zoomLevel >= 10) {
        clusterer.addMarkers(wishMarkers);
      } else if (zoomLevel >= 7) {
        clusterer.addMarkers(landmarkMarkers);
        clusterer.addMarkers(wishMarkers);
      } else {
        clusterer.addMarkers(allMarkers);
        clusterer.addMarkers(landmarkMarkers);
        clusterer.addMarkers(wishMarkers);
      }
    }
  }, [
    zoomLevel,
    kakaoMap,
    wishMarkers,
    landmarkMarkers,
    allMarkers,
    clusterer,
  ]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (receivedData?.type === "enteringExplore") {
      setUserId(receivedData.data.userId);
    }
  }, [receivedData]);

  // 찜 버튼을 클릭했을 때, Marker 배열 다시 초기화
  useEffect(() => {
    if (receivedData?.type === "wishClick") {
      initializeMarker();
    }
  }, [receivedData, initializeMarker]);

  useEffect(() => {
    if (userId !== "") {
      initializeMarker();
    }
  }, [userId, initializeMarker]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    (async () => {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        "/place";
      const response: AxiosResponse<Place[]> = await axios.get(url);
      setAllPlacesData(response.data);
    })();
  }, []);

  // 장소 서랍에서 장소를 선택했을 때
  useEffect(() => {
    if (kakaoMap && receivedData?.type === "placeSelect") {
      kakaoMap.setLevel(receivedData.data.zoomLevel);
      updateMapCenter(receivedData.data.address);
      handleMarkerClick(receivedData.data.address);
    }
  }, [kakaoMap, receivedData, updateMapCenter, handleMarkerClick]);

  return <Map ref={mapRef} />;
};

const Map = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default KakaoMap;
