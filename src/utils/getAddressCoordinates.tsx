import axios from "axios";

const KAKAO_API_ENDPOINT =
  "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_API_KEY; // 환경변수에서 API 키 가져오기

const getAddressCoordinates = async (address: string) => {
  try {
    const response = await axios.get(KAKAO_API_ENDPOINT, {
      params: {
        query: address,
      },
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        'KA': "sdk/1.39.4 os/javascript lang/en-US device/MacIntel origin/https://code.tutiserver.kro.kr/proxy/3000"
      },
    });

    if (response.data.documents && response.data.documents.length > 0) {
      const { x, y } = response.data.documents[0].address; // 첫번째 결과의 좌표값 가져오기
      return { x, y };
    } else {
      throw new Error("No results found for the given address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    alert(error)
    throw error;
  }
}

export default getAddressCoordinates;
