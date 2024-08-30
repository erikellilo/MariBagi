import { useSelector } from "react-redux";
import styled from "styled-components";
import ExistNameRowList from "./ExistNameRowList";

const ExistNameRowStyled = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 25rem;
  justify-content: flex-start;
`;

const ExistNameRow = () => {
  const users = useSelector((state) => state.users?.listUsers);
  return (
    <ExistNameRowStyled>
      {users.map((user, index) => (
        <ExistNameRowList key={index} user={user} />
      ))}
    </ExistNameRowStyled>
  );
};

export default ExistNameRow;
