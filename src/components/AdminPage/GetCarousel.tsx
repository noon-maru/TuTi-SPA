import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import { styled } from "styled-components";

import throttle from "utils/throttle";
import { RootState } from "redux/reducers";

interface ImageData {
  imageName: string;
  imageUrl: string;
}

interface getCarouselProps {
  imageDataList: ImageData[];
  setImageDataList: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

const getCarouselImageData = async (): Promise<ImageData[]> => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! +
      process.env.REACT_APP_API! +
      "/carousel";

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const deleteCarouselImageData = async (userId: string, imageName: string) => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! +
      process.env.REACT_APP_API! +
      `/carousel/${userId}/${imageName}`;

    const response = await axios.delete(url);
    console.log(response.data);
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const GetCarouselData = ({
  imageDataList,
  setImageDataList,
}: getCarouselProps) => {
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

  const handleImageDelete = async (e: React.MouseEvent, imageName: string) => {
    e.preventDefault();
    if (!window.confirm(`캐러셀에서 ${imageName} 이미지를 삭제하시겠습니까?`)) {
      return;
    }

    const fetchData = async () => {
      try {
        await deleteCarouselImageData(userId, imageName);
        // 이미지 삭제 후 state 업데이트
        setImageDataList((prevList) =>
          prevList.filter((imageData) => imageData.imageName !== imageName)
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
        setImageDataList(await getCarouselImageData());
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  }, [setImageDataList]);

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
      {imageDataList.map((imageData) => (
        <ImageContainer
          key={imageData.imageName}
          onClick={(e) => handleImageDelete(e, imageData.imageName)}
        >
          <Image
            src={
              process.env.REACT_APP_SERVER_URL! +
              process.env.REACT_APP_API! +
              imageData.imageUrl
            }
          />
          <PlaceName>{imageData.imageName}</PlaceName>
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

export default GetCarouselData;
