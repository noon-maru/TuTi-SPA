import { useState } from "react";

import styled from "styled-components";

import GetCarouselData from "components/AdminPage/GetCarousel";
import PostCarousel from "components/AdminPage/PostCarousel";

interface ImageData {
  imageName: string;
  imageUrl: string;
}

const CarouselPage = () => {
  const [imageDataList, setImageDataList] = useState<ImageData[]>([]);

  return (
    <Container>
      <Title>{"이미지 조회 및 삭제"}</Title>
      <GetCarouselData
        imageDataList={imageDataList}
        setImageDataList={setImageDataList}
      />
      <PostCarousel setImageDataList={setImageDataList} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex: 6;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  height: 100%;

  border: 1px solid black;
  border-radius: 10px;

  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1.4rem;
`;

export default CarouselPage;
