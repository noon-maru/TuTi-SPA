import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { RootState } from "redux/reducers";
import AdditionalInputBox from "./AdditionalInputBox";

import { setPlaces } from "redux/slice/placesSlice";

import getAddressCoordinates from "utils/getAddressCoordinates";

const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "강원",
  "제주",
];

const regionFullNames = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종광역시",
  "경기도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "강원도",
  "제주도",
];

const convertAbbreviationToFullName = (region: string) => {
  const index = regions.findIndex((name) => name === region);
  return regionFullNames[index];
};

const convertFullNameToAbbreviation = (regionFullName: string) => {
  const index = regionFullNames.findIndex((name) => name === regionFullName);
  return regions[index];
};

const PostPlace = () => {
  const dispatch = useDispatch();

  const { id: userId } = useSelector((state: RootState) => state.user);
  const { places } = useSelector((state: RootState) => state.places);

  const [region, setRegion] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isLandmark, setIsLandmark] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([""]);
  const [parkingInfo, setParkingInfo] = useState<string>("");
  const [advice, setAdvice] = useState<string>("");
  const [admissionFee, setAdmissionFee] = useState<string>();
  const [closedDays, setClosedDays] = useState<string[]>([""]);
  const [busRoutes, setBusRoutes] = useState<string[]>([""]);
  const [busStops, setBusStops] = useState<string[]>([""]);
  const [subwayInfo, setSubwayInfo] = useState<string[]>([""]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const trimmedValue = value.replace(/\s+/g, "");
    setName(trimmedValue);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAddress: string = e.target.value;
    const enteredRegionFullName = regionFullNames.find((item) =>
      enteredAddress.includes(item)
    );
    const enteredRegion = regions.find((item) => enteredAddress.includes(item));

    setAddress(enteredAddress);
    if (enteredRegionFullName) {
      setRegion(convertFullNameToAbbreviation(enteredRegionFullName));
    } else if (enteredRegion) {
      setRegion(enteredRegion);
    }
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const trimmedValue = value.replace(/\s+/g, "");
    setTagList((prev) =>
      prev.map((tag, i) => (i === index ? trimmedValue : tag))
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { lat: latitude, lng: longitude } = await getAddressCoordinates(
      address
    );

    const jsonData = {
      region,
      name,
      address,
      latitude,
      longitude,
      image: `/static/photo/JPG/${convertAbbreviationToFullName(
        region
      )}/${name}/${image}.jpg`,
      isLandmark,
      tag: tagList,
      tourismInfo: {
        parkingInfo,
        advice,
        admissionFee,
        closedDays,
        subwayInfo,
        busInfo: {
          busRoutes,
          busStops,
        },
      },
    };

    const fetchData = async () => {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/place/${userId}`;

      try {
        const response = await axios.post(url, JSON.stringify(jsonData), {
          headers: {
            "Content-Type": "application/json",
          },
        });

        alert("장소가 정상적으로 추가 되었습니다.");
        dispatch(setPlaces([...places, response.data]));
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
          <legend>{"장소 기본 정보"}</legend>
          <label>
            {"장소명: "}
            <input
              type="text"
              placeholder="띄어쓰기 없이!!"
              value={name}
              onChange={handleNameChange}
            />
          </label>
          <label>
            {"주소: "}
            <input
              type="text"
              placeholder="인천 미추홀구 인하로 100"
              value={address}
              onChange={handleAddressChange}
            />
          </label>
          <label>
            {"랜드마크 여부: "}
            <input
              type="radio"
              name="isLandmark"
              checked={isLandmark === true}
              onClick={() => setIsLandmark(true)}
            />
            {"예"}
            <input
              type="radio"
              name="isLandmark"
              checked={isLandmark === false}
              onClick={() => setIsLandmark(false)}
            />
            {"아니오"}
          </label>
          <label>
            {"썸네일: "}
            <input
              type="text"
              placeholder="108A004A0 (1)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>
          <AdditionalInputBox
            label="태그: "
            placeholder="바닷가"
            list={tagList}
            setList={setTagList}
            handleChange={handleTagChange}
          />
        </Fieldset>
        <Fieldset>
          <legend>{"장소 상세 정보"}</legend>
          <label>
            {"주차 정보: "}
            <input
              type="text"
              placeholder="주차수용 : 60대 /☆☆★"
              value={parkingInfo}
              onChange={(e) => setParkingInfo(e.target.value)}
            />
          </label>
          <label>
            {"관광 관련 정보: "}
            <input
              type="text"
              placeholder="모자를 챙겨가시는 걸 추천합니다."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </label>
          <label>
            {"입장료: "}
            <input
              type="text"
              placeholder="성인 5000원, 유아 3000원"
              value={admissionFee}
              onChange={(e) => setAdmissionFee(e.target.value)}
            />
          </label>
          <AdditionalInputBox
            label="휴무일:"
            placeholder="일요일"
            list={closedDays}
            setList={setClosedDays}
          />
          <fieldset style={{ display: "flex", gap: 5 }}>
            <legend>{"버스 정보"}</legend>
            <AdditionalInputBox
              label="버스 노선"
              placeholder="광역버스 1601번"
              list={busRoutes}
              setList={setBusRoutes}
            />
            <AdditionalInputBox
              label="버스 정류장"
              placeholder="인하대정문"
              list={busStops}
              setList={setBusStops}
            />
          </fieldset>
          <AdditionalInputBox
            label="지하철 정보"
            placeholder="수인분당선 인하대역"
            list={subwayInfo}
            setList={setSubwayInfo}
          />
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

export default PostPlace;
