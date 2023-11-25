import { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { RootState } from "redux/reducers";

interface PostRecommendedPlaceProps {
  setRecommendedPlaceDataList: React.Dispatch<
    React.SetStateAction<RecommendedPlace[]>
  >;
}

const PostRecommendedPlace = ({
  setRecommendedPlaceDataList,
}: PostRecommendedPlaceProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);
  const { places } = useSelector((state: RootState) => state.places);

  const [placeName, setPlaceName] = useState<string>("");
  const [selectedPlace, setSelectedPlace] = useState<string>("");

  const handlePlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlace(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const jsonData = { placeId: selectedPlace };

    const fetchData = async () => {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/recommendedplaces/${userId}`;

      try {
        await axios.post(url, JSON.stringify(jsonData), {
          headers: {
            "Content-Type": "application/json",
          },
        });

        alert("장소가 정상적으로 추가 되었습니다.");
        setRecommendedPlaceDataList((prev) => [
          ...prev,
          {
            place: places.find((place) => place._id === selectedPlace)!,
          } as RecommendedPlace,
        ]);
      } catch (error) {
        alert(`장소 추가 오류! ${error}`);
        console.error("장소 추가 오류", error);
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
            {"장소명: "}
            <input
              type="text"
              placeholder="장소 검색"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
            />
            <select value={selectedPlace} onChange={handlePlaceChange}>
              <option value="">{"-- 장소를 선택하세요 --"}</option>
              {places
                .filter((place) => place.name.includes(placeName))
                .map((place, index) => (
                  <option key={index} value={place._id}>
                    {place.name}
                  </option>
                ))}
            </select>
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

export default PostRecommendedPlace;
