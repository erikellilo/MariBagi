import { Outlet } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import Header from "./Header";
import React from "react";

const StyledAppLayout = styled.div`
  background-color: var(--color-green-100);
  background-image: linear-gradient(
      to right,
      var(--color-grey-900) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, var(--color-grey-900) 1px, transparent 1px);
  background-size: 25px 25px;
  min-height: 100vh;
`;

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 37.5rem;
  height: 100%;
  gap: 1rem;
`;

const StyledMain = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const AppLayout = (): React.JSX.Element => {
  return (
    <StyledAppLayout>
      <Container>
        <Header />
        <StyledMain>
          <MenuBar />
          <Outlet />
        </StyledMain>
      </Container>
    </StyledAppLayout>
  );
};

export default AppLayout;
