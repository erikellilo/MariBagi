import Header from "./Header";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";
import { BackgroundStyle } from "../GlobalStyles";

const StyledAppLayout = styled.div`
  background-color: var(--color-grey-50);
  height: 100vh;
  padding: 2rem 0;
`;

const Container = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 45rem;
  height: 100%;
  gap: 1rem;
  ${BackgroundStyle}
`;

const StyledMain = styled.main`
  flex-grow: 1;
  ${BackgroundStyle}
`;

const AppLayout = () => {
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
