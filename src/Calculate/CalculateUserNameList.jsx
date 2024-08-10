import styled from "styled-components";

const NameListStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-brand-200);
  color: var(--color-grey-900);
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.25rem;

  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.2rem;
  border-radius: 1rem;

  span {
    font-weight: 750;
  }
`;

const NameListButton = styled.button`
  border-style: solid;
  border-color: var(--color-grey-900);
  border-radius: 0.5rem;

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
  flex: 1;
`;

const CalculateUserNameList = ({ name }) => {
  return (
    <NameListStyled>
      <NameListButton>&#8722;</NameListButton>
      <NameText>{name}</NameText>
      <NameListButton>&#43;</NameListButton>
    </NameListStyled>
  );
};

export default CalculateUserNameList;
