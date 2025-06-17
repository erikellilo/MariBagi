import styled from "styled-components";
import ExistNameRowList from "./ExistNameRowList";
import { memo } from "react";
import { useSelector } from "react-redux";

const ExistNameRowStyled = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  max-width: 25rem;
  justify-content: flex-start;
`;

const ExistNameRow = memo(() => {
  const users = useSelector((state) => state.user);
  return (
    <ExistNameRowStyled>
      {users?.map((user, index) => (
        <ExistNameRowList key={index} user={user} />
      ))}
    </ExistNameRowStyled>
  );
});

ExistNameRow.displayName = "ExistNameRow";
export default ExistNameRow;
