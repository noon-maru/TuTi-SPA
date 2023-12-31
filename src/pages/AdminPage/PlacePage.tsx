import styled from "styled-components";

import GetPlace from "components/AdminPage/GetPlace";
import PostPlace from "components/AdminPage/PostPlace";

const PlacePage = () => {
  return (
    <Container>
      <Title>{"일반 장소 조회 및 삭제"}</Title>
      <GetPlace />
      <Title>{"일반 장소 추가"}</Title>
      <PostPlace />
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

export default PlacePage;
