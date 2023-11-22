import styled from "styled-components";

const RecommendedPlacePage = () => {
  return (
    <Container>
      <Title>{"추천 장소 추가"}</Title>
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

export default RecommendedPlacePage;
