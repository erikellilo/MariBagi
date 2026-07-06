import styled from "styled-components";

const HeaderStyled = styled.header`
  text-align: center;
  text-justify: distribute;
  overflow: hidden;
`;

const H1 = styled.h3`
  color: var(--color-grey-900);
  display: inline-block;
  white-space: nowrap;
  padding-left: 100%;
  animation: runningText 10s linear infinite;

  @keyframes runningText {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }
`;

const Header = () => {
  return (
    <HeaderStyled>
      <H1>MariBagi • Mari Hitung • Mari Sharing</H1>
    </HeaderStyled>
  );
};

export default Header;
