import { useEffect, useState } from "react";

import styled from "styled-components";

import axios from "axios";
import { useDispatch } from "react-redux";

import { setPlaces } from "redux/slice/placesSlice";

import GetRecommendedPlace from "components/AdminPage/GetRecommendedPlace";
import PostRecommendedPlace from "components/AdminPage/PostRecommendedPlace";

const getPlaceData = async (): Promise<Place[]> => {
  try {
    const url =
      process.env.REACT_APP_SERVER_URL! + process.env.REACT_APP_API! + "/place";

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("네트워킹 오류:", error);
    throw error;
  }
};

const RecommendedPlacePage = () => {
  const dispatch = useDispatch();

  const [recommendedPlaceDataList, setRecommendedPlaceDataList] = useState<
    RecommendedPlace[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setPlaces(await getPlaceData()));
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <Container>
      <Title>{"추천 장소 조회 및 삭제"}</Title>
      <GetRecommendedPlace
        recommendedPlaceDataList={recommendedPlaceDataList}
        setRecommendedPlaceDataList={setRecommendedPlaceDataList}
      />
      <Title>{"추천 장소 추가"}</Title>
      <PostRecommendedPlace
        setRecommendedPlaceDataList={setRecommendedPlaceDataList}
      />
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
