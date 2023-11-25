import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { setPlaces } from "redux/slice/placesSlice";

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

const RecommendedCoursePage = () => {
  const dispatch = useDispatch();

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
      <Title>{"추천 코스 추가"}</Title>
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

export default RecommendedCoursePage;
