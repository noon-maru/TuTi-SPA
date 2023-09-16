import styled from "styled-components";

// import AppleSignIn from "utils/OAuth/AppleSigeIn";
// import GoogleSignIn from "utils/OAuth/GoogleSignIn";
import KakaoSignIn from "utils/OAuth/KakaoSignIn";
// import NaverSignIn from "utils/OAuth/NaverSignIn";

const SignInMethodPage = () => {
  return (
    <Container>
      <ButtonContainer>
        {/* <AppleSignIn handleLogin={handleLogin} /> */}
        {/* <GoogleSignIn handleLogin={handleLogin} /> */}
        <KakaoSignIn />
        {/* <NaverSignIn handleLogin={handleLogin} /> */}
        {/* <GuestLogin onPress={() => handleLogin("guest", "게스트")}>
          <GuestLoginText>게스트로 로그인</GuestLoginText>
        </GuestLogin> */}
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 60px;
`;

const ButtonContainer = styled.div`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
`;

// const GuestLogin = styled.div``;

// const GuestLoginText = styled.p`
//   margin-top: 10px;

//   text-decoration-line: underline;
//   color: rgba(255, 255, 255, 0.7);
// `;

export default SignInMethodPage;
