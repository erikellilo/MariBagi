import styled from "styled-components";
import CalculateUserNameList from "./CalculateUserNameList";

const ExistNameRowStyled = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 0.5rem;
  margin-top: -0.6rem;
  display: none;
`;

const CalculateUserList = () => {
  const Coba = ["Erik", "Putri", "Denis", "Joanna", "Eriz"];

  return (
    <ExistNameRowStyled>
      {Coba.map((name, index) => (
        <CalculateUserNameList key={index} name={name} />
      ))}
    </ExistNameRowStyled>
  );
};

export default CalculateUserList;
