import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { RootState } from "redux/reducers";

import throttle from "utils/throttle";

interface getRecommendedCourseProps {
  recommendedCourseDataList: RecommendedCourse[];
  setRecommendedCourseDataList: React.Dispatch<
    React.SetStateAction<RecommendedCourse[]>
  >;
}

const GetRecommendedCourse = ({
  recommendedCourseDataList,
  setRecommendedCourseDataList,
}: getRecommendedCourseProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);

  const getCourseData = useCallback(async () => {
    try {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/course/recommended/${userId}`;

      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error("네트워킹 오류:", error);
      throw error;
    }
  }, [userId]);

  const deleteCourseData = async (courseId: string) => {
    try {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/course/${userId}/${courseId}`;

      const response = await axios.delete(url);
      console.log(response.data);
    } catch (error) {
      console.error("네트워킹 오류:", error);
      throw error;
    }
  };

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + (scrollRef.current?.scrollLeft || 0));
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (e: React.MouseEvent) => {
    if (isDrag && scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

      scrollRef.current.scrollLeft = startX - e.pageX;

      if (scrollLeft === 0) {
        setStartX(e.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(e.pageX + scrollLeft);
      }
    }
  };

  const handleCourseDelete = async (
    e: React.MouseEvent,
    courseId: string,
    courseName: string
  ) => {
    e.preventDefault();
    if (!window.confirm(`추천 코스 ${courseName}를 삭제 하시겠습니까?`)) {
      return;
    }

    const fetchData = async () => {
      try {
        await deleteCourseData(courseId);
        // 이미지 삭제 후 state 업데이트
        setRecommendedCourseDataList((prevList) =>
          prevList.filter((courseData) => courseData._id !== courseId)
        );
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setRecommendedCourseDataList(await getCourseData());
      } catch (error) {
        console.error("네트워킹 오류:", error);
        throw error;
      }
    };
    fetchData();
  }, [getCourseData, setRecommendedCourseDataList]);

  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <Container
      ref={scrollRef}
      onMouseDown={onDragStart}
      onMouseMove={isDrag ? onThrottleDragMove : undefined}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      {recommendedCourseDataList.map((courseData, index) => (
        <ImageContainer
          key={index}
          onClick={(e) =>
            handleCourseDelete(e, courseData._id, courseData.courseName)
          }
        >
          <p>{courseData.courseName}</p>
          {courseData.places.map((place, index) => (
            <>
              <Image
                key={index}
                src={process.env.REACT_APP_SERVER_URL! + place.image}
              />
              <PlaceName>{place.name}</PlaceName>
            </>
          ))}
        </ImageContainer>
      ))}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 20px;

  width: 70vw;

  border: 1px solid black;
  border-radius: 20px;

  padding: 20px;
  margin: 20px;

  overflow-x: scroll;
`;

const ImageContainer = styled.div``;

const PlaceName = styled.p``;

const Image = styled.img`
  width: 100px;
`;

export default GetRecommendedCourse;
