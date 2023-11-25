import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import throttle from "utils/throttle";
import { RootState } from "redux/reducers";

interface getRecommendedPlaceProps {
  recommendedPlaceDataList: RecommendedPlace[];
  setRecommendedPlaceDataList: React.Dispatch<
    React.SetStateAction<RecommendedPlace[]>
  >;
}

const getPlaceData = async (): Promise<RecommendedPlace[]> => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! +
      process.env.REACT_APP_API! +
      "/recommendedplaces";

    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const excludePlaceData = async (userId: string, placeId: string) => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! +
      process.env.REACT_APP_API! +
      `/recommendedplaces/${userId}/${placeId}`;

    const response = await axios.delete(url);
    console.log(response.data);
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const GetRecommendedPlace = ({
  recommendedPlaceDataList,
  setRecommendedPlaceDataList,
}: getRecommendedPlaceProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + (scrollRef.current?.scrollLeft || 0));
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (isDrag && scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

      scrollRef.current.scrollLeft = startX - e.pageX;

      if (scrollLeft === 0) {
        setStartX(e.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(e.pageX + scrollLeft);
      }
    }
  };

  const handleImageDelete = async (
    e: React.MouseEvent,
    placeId: string,
    placeName: string
  ) => {
    e.preventDefault();
    if (
      !window.confirm(`${placeName} 장소를 추천 장소에서 제외 하시겠습니까?`)
    ) {
      return;
    }

    const fetchData = async () => {
      try {
        await excludePlaceData(userId, placeId);
        // 이미지 삭제 후 state 업데이트
        setRecommendedPlaceDataList((prevList) =>
          prevList.filter((placeData) => placeData._id !== placeId)
        );
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRecommendedPlaceDataList(await getPlaceData());
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  }, [setRecommendedPlaceDataList]);

  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <Container
      ref={scrollRef}
      onMouseDown={onDragStart}
      onMouseMove={isDrag ? onThrottleDragMove : undefined}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {recommendedPlaceDataList.map((placeData) => (
        <ImageContainer
          key={placeData.place.name}
          onClick={(e) =>
            handleImageDelete(e, placeData._id!, placeData.place.name)
          }
        >
          <Image
            src={process.env.REACT_APP_SERVER_URL! + placeData.place.image}
          />
          <PlaceName>{placeData.place.name}</PlaceName>
        </ImageContainer>
      ))}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 20px;

  width: 70vw;

  border: 1px solid black;
  border-radius: 20px;

  padding: 20px;
  margin: 20px;

  overflow-x: scroll;
`;

const ImageContainer = styled.div``;

const PlaceName = styled.p``;

const Image = styled.img`
  width: 200px;
`;

export default GetRecommendedPlace;
