import styled from "styled-components";
import ExistNameRowList from "./ExistNameRowList";

const ExistNameRowStyled = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 1rem;
`;

const ExistNameRow = () => {
  const blankArray = Array.from({ length: 5 }, (_, index) => ({ index }));
  return (
    <ExistNameRowStyled>
      {blankArray.map((_, index) => (
        <ExistNameRowList key={index} name={index + 1} />
      ))}
    </ExistNameRowStyled>
  );
};

export default ExistNameRow;
