import SocialLoginButton from "components/SocialLoginButton";

const KakaoSignIn = () => {
  const loginWithKakao = () => {
    const CLIENT_ID = `${process.env.REACT_APP_KAKAO_API_KEY}`;
    const REDIRECT_URI = process.env.PUBLIC_URL
      ? `${process.env.REACT_APP_DEV_KAKAO_REDIRECT_URL}`
      : `${process.env.REACT_APP_KAKAO_REDIRECT_URL}`;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // a 태그 처럼 js를 이용해 외부 페이지로 넘어가기 위해선 location.href 사용
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <SocialLoginButton
      icon={`${process.env.PUBLIC_URL}/OAuth/KakaoIcon.png`}
      backgroundColor={"#FEE500"}
      text={"카카오로 로그인"}
      textColor={"black"}
      onClick={() => loginWithKakao()}
    />
  );
};

export default KakaoSignIn;
