import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import { styled } from "styled-components";

import throttle from "utils/throttle";
import { RootState } from "redux/reducers";

interface getPlaceProps {
  placeDataList: Place[];
  setPlaceDataList: React.Dispatch<React.SetStateAction<Place[]>>;
}

const getPlaceData = async (): Promise<Place[]> => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! + process.env.REACT_APP_API! + "/place";

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const deletePlaceData = async (userId: string, placeId: string) => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! +
      process.env.REACT_APP_API! +
      `/place/${userId}/${placeId}`;

    const response = await axios.delete(url);
    console.log(response.data);
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const GetPlace = ({ placeDataList, setPlaceDataList }: getPlaceProps) => {
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

  const onDragMove = (e: any) => {
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
    if (!window.confirm(`${placeName} 장소를 삭제하시겠습니까?`)) {
      return;
    }

    const fetchData = async () => {
      try {
        await deletePlaceData(userId, placeId);
        // 이미지 삭제 후 state 업데이트
        setPlaceDataList((prevList) =>
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
        setPlaceDataList(await getPlaceData());
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  }, [setPlaceDataList]);

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
      {placeDataList.map((placeData) => (
        <ImageContainer
          key={placeData.name}
          onClick={(e) => handleImageDelete(e, placeData._id, placeData.name)}
        >
          <Image src={process.env.REACT_APP_SERVER_URL! + placeData.image} />
          <PlaceName>{placeData.name}</PlaceName>
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

export default GetPlace;
