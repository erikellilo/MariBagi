import { useDispatch } from "react-redux";
import { deleteUser } from "../features/usersSlice";
import ButtonRound from "../ui/ButtonRound";
import Closeicon from "../assets/icon/icon-close.svg";

import styled from "styled-components";

const ExistNameRowListStyled = styled.li`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.45rem 0.45rem 0.25rem;
  border-radius: 1rem;

  display: flex;
  align-items: center;
  width: 8rem;
  height: 3.25rem;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 0 0.75rem;
  gap: 0.25rem;

  transition: border-width 0.1s ease;
  &:hover {
    border-width: 0.1rem 0.6rem 0.6rem 0.1rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }

  & span {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div``;

const SpanText = styled.span`
  flex-grow: 0;
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
      <ButtonContainer>
        <ButtonRound
          variant="delete"
          title="delete"
          tooltip="delete"
          onClick={handleDeleteUser}
        >
          <Closeicon />
        </ButtonRound>
      </ButtonContainer>
      <SpanText>{user.userName}</SpanText>
    </ExistNameRowListStyled>
  );
};

export default ExistNameRowList;
