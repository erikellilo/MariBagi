import { useSelector } from "react-redux";
import styled from "styled-components";
import ExistNameRowList from "./ExistNameRowList";

const ExistNameRowStyled = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 1rem;
  max-width: 25rem;
  justify-content: flex-start;
`;

const ExistNameRow = () => {
  const users = useSelector((state) => state.users?.listUsers);
  return (
    <ExistNameRowStyled>
      {users.map((user, index) => (
        <ExistNameRowList key={index} name={user.userName} />
      ))}
    </ExistNameRowStyled>
  );
};

export default ExistNameRow;
