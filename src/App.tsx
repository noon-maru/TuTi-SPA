import KakaoMap from "components/KakaoMap";
import { Route, Routes } from "react-router-dom";

import HomePage from "pages/HomePage";
import KakaoRedirectHandler from "pages/KakaoRedirectHandler";
import SignInMethodPage from "pages/SignInMethodPage";
import AdminPage from "pages/AdminPage";
import CarouselPage from "pages/AdminPage/CarouselPage";
import PlacePage from "pages/AdminPage/PlacePage";
import RecommendedPlacePage from "pages/AdminPage/RecommendedPlacePage";
import RecommendedCoursePage from "pages/AdminPage/RecommendedCoursePage";

const App = () => {
  const devURL = process.env.PUBLIC_URL ? "/proxy/3000" : "";

  return (
    <Routes>
      <Route path={`${devURL}/`} element={<HomePage />} />
      <Route path={`${devURL}/kakaomap`} element={<KakaoMap />} />
      <Route path={`${devURL}/admin`} element={<AdminPage />}>
        <Route path={"carousel"} element={<CarouselPage />} />
        <Route path={"place"} element={<PlacePage />} />
        <Route path={"recommendedplace"} element={<RecommendedPlacePage />} />
        <Route path={"recommendedcourse"} element={<RecommendedCoursePage />} />
      </Route>
      <Route path={`${devURL}/signin`} element={<SignInMethodPage />} />
      <Route
        path={`${devURL}/oauth/redirect/kakao`}
        element={<KakaoRedirectHandler />}
      />
    </Routes>
  );
};

export default App;
