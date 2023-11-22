import { Link } from "react-router-dom";
import { styled } from "styled-components";

const pageList = [
  { title: "캐러셀 관리", route: "carousel" },
  { title: "일반 장소 관리", route: "place" },
  { title: "추천 장소 관리", route: "recommendedplace" },
  { title: "추천 코스 관리", route: "recommendedcourse" },
];

const devURL = process.env.PUBLIC_URL ? "/proxy/3000" : "";

const SideBar = () => {
  return (
    <Container>
      <Header>
        <p style={{ fontSize: 24, fontWeight: 300 }}>{"TuTi"}</p>
      </Header>
      <Section>
        {pageList.map((page, index) => (
          <SideBarContent to={`${devURL}/admin/${page.route}`} key={index}>
            {page.title}
          </SideBarContent>
        ))}
      </Section>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  min-width: 150px;
  height: 100%;

  border-width: 1px;
  border-style: solid;
  border-color: #5396fd;
  border-radius: 10px;
`;

const Header = styled.header`
  text-align: center;

  width: 90%;

  border-bottom: 1px solid #8583ff;
  padding: 20px 0;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SideBarContent = styled(Link)``;

export default SideBar;
