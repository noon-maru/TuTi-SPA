import { Outlet } from "react-router-dom";

import styled from "styled-components";

import SideBar from "components/AdminPage/SideBar";

const AdminPage = () => {
  return (
    <Container>
      <SideBar />
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  width: 100vw;
  height: 100vh;

  padding: 20px;
`;

export default AdminPage;
