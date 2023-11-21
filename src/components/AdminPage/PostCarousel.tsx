import { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import styled from "styled-components";

import { RootState } from "redux/reducers";

interface ImageData {
  imageName: string;
  imageUrl: string;
}

interface PostCarouselProps {
  setImageDataList: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

const PostCarousel = ({ setImageDataList }: PostCarouselProps) => {
  const { id: userId } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<Blob | string>("");

  const handleNameChange = (e: any) => {
    const value = e.target.value;
    const trimmedValue = value.replace(/\s+/g, "");
    setName(trimmedValue);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      // 이미지를 선택한 경우 처리
      setSelectedImage(file);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // FormData 객체를 생성하여 이미지를 담습니다.
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", selectedImage);

    console.log(formData);

    const fetchData = async () => {
      const url =
        process.env.REACT_APP_SERVER_URL! +
        process.env.REACT_APP_API! +
        `/carousel/${userId}`;

      try {
        await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("이미지가 정상적으로 업로드 되었습니다.");
        setImageDataList((prev) => [
          ...prev,
          { imageName: name, imageUrl: `/carousel/${name}.png` },
        ]);
      } catch (error) {
        alert(`이미지 업로드 오류! ${error}`);
        console.error("이미지 업로드 오류", error);
        throw error;
      }
    };

    fetchData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label>
          {"장소 이름(띄어쓰기 없이!!):"}
          <input
            type="text"
            placeholder="이미지 이름"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <label>
          {"캐러셀에 넣을 이미지:"}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage as Blob)}
            alt="Selected"
            style={{ maxWidth: "300px" }}
          />
        )}
        <SubmitButton type="submit">제출</SubmitButton>
      </fieldset>
    </form>
  );
};

const SubmitButton = styled.button`
  border: 1px solid #7fcfe9;
  border-radius: 10px;

  padding: 10px;
`;

export default PostCarousel;
