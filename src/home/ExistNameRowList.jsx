import { useDispatch } from "react-redux";
import { deleteUser } from "../features/usersSlicer";

import styled from "styled-components";

const ExistNameRowListStyled = styled.li`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 7.5rem;
  height: 3.25rem;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 0 0.75rem;

  transition: border-width 0.1s ease;
  &:hover {
    border-width: 0.1rem 0.5rem 0.5rem 0.1rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }

  & span {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const SpanText = styled.span`
  flex-grow: 1;
  max-width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExistNameRowList = ({ user }) => {
  const dispatch = useDispatch();

  const handleDeleteUser = (e) => {
    e.preventDefault();
    dispatch(deleteUser(user.userId));
  };
  return (
    <ExistNameRowListStyled onClick={handleDeleteUser}>
      <SpanText>{user.userName}</SpanText>
      <span>&#x2716;</span>
    </ExistNameRowListStyled>
  );
};

export default ExistNameRowList;
