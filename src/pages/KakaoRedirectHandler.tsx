import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { login } from "redux/slice/userSlice";
import { RootState } from "redux/reducers";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);

  const [accessToken, setAccessToken] = useState<string>("");

  // 인가 코드
  const code = new URL(window.location.href).searchParams.get("code")!;
  const grant_type = "authorization_code";
  const client_id = `${process.env.REACT_APP_KAKAO_API_KEY}`;
  const redirect_uri = process.env.PUBLIC_URL
    ? `${process.env.REACT_APP_DEV_KAKAO_REDIRECT_URL}`
    : `${process.env.REACT_APP_KAKAO_REDIRECT_URL}`;

  const getProfile = useCallback(async () => {
    try {
      const profileResponse = await axios.post(
        "https://kapi.kakao.com/v2/user/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("프로필 가져오기 성공", profileResponse.data);

      const user = {
        id: profileResponse.data.id,
        username: profileResponse.data.nickname,
        profile: profileResponse.data.profileImageUrl,
      };

      dispatch(login(user));

      const response = await axios.post(
        process.env.REACT_APP_SERVER_URL! +
          process.env.REACT_APP_API! +
          "/users/login",
        user
      );
      console.log(response);
    } catch (e: any) {
      console.log(`프로필 가져오기 실패(code:${e.code})`, e.message);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    try {
      (async () => {
        const response = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${code}`,
          {},
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log(response.data);
        setAccessToken(response.data.access_token);
      })();
    } catch (error) {
      console.error("로그인 에러", error);
    }
  }, [client_id, code, redirect_uri]);

  useEffect(() => {
    if (accessToken) getProfile();
  }, [getProfile, accessToken]);

  useEffect(() => {
    const devURL = process.env.PUBLIC_URL ? "/proxy/3000" : "";
    if (user.id) navigate(`${devURL}/`);
  }, [user, navigate]);

  return <h1>로그인 중입니다!</h1>;
};

export default KakaoRedirectHandler;
