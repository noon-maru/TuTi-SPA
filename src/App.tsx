import styled from "styled-components";
import KaKaoMap from "components/KakaoMap";

const App = () => {
  return (
    <Container>
      <KaKaoMap />
    </Container>
  );
};

const Container = styled.div`
  display: flex;

  width: 100vw;
  height: 100vh;

  justify-content: center;
  align-items: center;
`;

export default App;
