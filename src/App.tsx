import KakaoMap from "components/KakaoMap";
import { Route, Routes } from "react-router-dom";

import HomePage from "pages/HomePage";
import KakaoRedirectHandler from "pages/KakaoRedirectHandler";
import SignInMethodPage from "pages/SignInMethodPage";

const App = () => {
  const devURL = process.env.PUBLIC_URL ? "/proxy/3000" : "";

  return (
    <Routes>
      <Route path={`${devURL}/`} element={<HomePage />} />
      <Route path={`${devURL}/kakaomap`} element={<KakaoMap />} />
      <Route path={`${devURL}/signin`} element={<SignInMethodPage />} />
      <Route
        path={`${devURL}/oauth/redirect/kakao`}
        element={<KakaoRedirectHandler />}
      />
    </Routes>
  );
};

export default App;
