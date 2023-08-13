import { useRef, useEffect } from "react";
import styled from "styled-components";

// 전역 위치의 Window에 kakao라는 키 값 추가
declare global {
  interface Window {
    kakao: any; // kakao object의 타입을 지정
  }
}

// index.html에 script로 불러온 카카오 맵을 사용하기 위해 kakao 변수 가져오기.
const { kakao } = window;

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mapRef.current; // 지도를 담을 영역의 DOM 레퍼런스
    const mapOptions = {
      // 지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(36.004081, 127.621819), // 지도의 중심좌표. 서면마을 강변공원
      level: 13, // 지도의 레벨(확대, 축소 정도)
    };

    const kakaoMap = new kakao.maps.Map(container, mapOptions); // 지도 생성 및 객체 리턴
    
    const imageSrc =
        `${process.env.PUBLIC_URL}/icon/mapMarker.png`, // 마커이미지의 주소
      imageSize = new kakao.maps.Size(40, 40), // 마커이미지의 크기
      imageOption = { offset: new kakao.maps.Point(20, 40) }; // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
    const markerPosition = new kakao.maps.LatLng(36.004081, 127.621819); // 마커가 표시될 위치

    // 마커 생성
    var marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage, // 마커이미지 설정
    });

    // 마커가 지도 위에 표시되도록 설정
    marker.setMap(kakaoMap);
  }, []);

  return <Map ref={mapRef} />;
};

const Map = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default KakaoMap;
