import { useState } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import { RootState } from "redux/reducers";

interface SetCoursePointProps {
  pointIndex: number;
  pointName: string;
  selectedPlaces: string[];
  setSelectedPlaces: React.Dispatch<React.SetStateAction<string[]>>;
}

const SetCoursePoint = ({
  pointIndex,
  pointName,
  selectedPlaces,
  setSelectedPlaces,
}: SetCoursePointProps) => {
  const { places } = useSelector((state: RootState) => state.places);

  const [placeName, setPlaceName] = useState<string>("");

  const handlePlaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaces((prev) =>
      prev.map((place, index) =>
        index === pointIndex ? e.target.value : place
      )
    );
  };

  return (
    <label>
      {`${pointName}: `}
      <input
        type="text"
        placeholder="장소 검색"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
      />
      <select value={selectedPlaces[pointIndex]} onChange={handlePlaceChange}>
        <option value="">{"-- 장소를 선택하세요 --"}</option>
        {places
          .filter((place) => place.name.includes(placeName))
          .map((place, index) => (
            <option key={index} value={place._id}>
              {place.name}
            </option>
          ))}
      </select>
      <AddTagInput
        onClick={() =>
          setSelectedPlaces((prev) => [
            ...prev.slice(0, pointIndex + 1),
            "",
            ...prev.slice(pointIndex + 1),
          ])
        }
      >
        {"+"}
      </AddTagInput>
    </label>
  );
};

const AddTagInput = styled.span`
  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 5px;

  margin-left: 5px;
  padding: 0px 5px;
`;

export default SetCoursePoint;
