import { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { RootState } from "redux/reducers";
import SetCoursePoint from "./SetCoursePoint";

interface PostRecommendedCourseProps {
  setRecommendedCourseDataList: React.Dispatch<
    React.SetStateAction<RecommendedCourse[]>
  >;
}

const PostRecommendedCourse = ({
  setRecommendedCourseDataList,
}: PostRecommendedCourseProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);

  const [courseName, setCourseName] = useState<string>("");
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>(["", ""]);
  const [totalFee, setTotalFee] = useState<number>(0);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const jsonData = {
      courseName,
      placesId: selectedPlaces,
      travelTime: [],
      totalFee,
    };

    const fetchData = async () => {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/course/recommended/${userId}`;

      try {
        const response = await axios.post(url, JSON.stringify(jsonData), {
          headers: {
            "Content-Type": "application/json",
          },
        });

        alert("추천 코스가 정상적으로 추가 되었습니다.");
        setRecommendedCourseDataList((prev) => [...prev, response.data.course]);
      } catch (error) {
        alert(`코스 추가 오류! ${error}`);
        console.error("코스 추가 오류", error);
        throw error;
      }
    };

    fetchData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex" }}>
        <Fieldset>
          <label>
            {"코스 이름: "}
            <input
              type="text"
              placeholder="맑은 날 한강공원 나들이"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </label>
          {selectedPlaces.map((_, index) => (
            <SetCoursePoint
              key={index}
              pointIndex={index}
              pointName={
                index === 0
                  ? "출발지"
                  : index === selectedPlaces.length - 1
                  ? "도착지"
                  : "경유지"
              }
              selectedPlaces={selectedPlaces}
              setSelectedPlaces={setSelectedPlaces}
            />
          ))}
          <label>
            {"총 비용: "}
            <input
              type="text"
              placeholder="1000"
              value={totalFee}
              onChange={(e) =>
                setTotalFee(
                  Number.isNaN(parseInt(e.target.value))
                    ? 0
                    : parseInt(e.target.value)
                )
              }
            />
          </label>
        </Fieldset>
      </div>
      <SubmitButton type="submit">{"제출"}</SubmitButton>
    </form>
  );
};

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  padding: 10px;
`;

const SubmitButton = styled.button`
  border: 1px solid #7fcfe9;
  border-radius: 10px;

  padding: 10px;
`;

export default PostRecommendedCourse;
