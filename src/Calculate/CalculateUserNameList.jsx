import styled from "styled-components";

const NameListStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  span {
    font-weight: 750;
  }
`;

const NameListButton = styled.button`
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 2px 2px 3px;

  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NameText = styled.span`
  max-width: rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.3rem;
`;

const Container = styled.div`
  width: 40%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 1rem;
`;

const CalculateUserNameList = ({ name }) => {
  return (
    <NameListStyled>
      <Container>
        <NameListButton>&#8722;</NameListButton>
        <NameText>{name}</NameText>
        <NameListButton>&#43;</NameListButton>
      </Container>
    </NameListStyled>
  );
};

export default CalculateUserNameList;
