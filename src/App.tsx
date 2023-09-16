import KakaoMap from "components/KakaoMap";
import { Route, Routes } from "react-router-dom";

import HomePage from "pages/HomePage";

const App = () => {
  const devURL = process.env.PUBLIC_URL ? "/proxy/3000" : "";

  return (
    <Routes>
      <Route path={`${devURL}/`} element={<HomePage />} />
      <Route path={`${devURL}/kakaomap`} element={<KakaoMap />} />
    </Routes>
  );
};

export default App;
