import { useDispatch } from "react-redux";
import styled from "styled-components";
import { memo } from "react";

import { editFromExistingBagi } from "../features/bagiSlice";
import { editFromExistingUserBagi } from "../features/usersSlice";
import { editFromExistingitemBagi } from "../features/itemsSlice";
import getLocalStorage from "../assets/getLocalStorage";

import Closeicon from "../../public/icon-close.svg";
import Expand from "../../public/icon-pointing.svg";

const ExistingBagiStyled = styled.div`
  width: 100%;
  background-color: #f9f9f9;
  padding: 1.1rem;
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;

  position: relative;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  span {
    font-size: 1rem;
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 80%;
  left: 2%;
  gap: 0.5rem;
`;

const ButtonRound = styled.button`
  position: relative;
  background-color: ${(props) =>
    props.variant === "review"
      ? "var(--color-green-500)"
      : "var(--color-red-800)"};
  color: var(--color-grey-0);
  font-weight: bolder;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 100%;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &::after {
    content: "${(props) => props.tooltip}";
    position: absolute;
    top: 100%; /* Adjust this to control the distance */
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-grey-0);
    color: var(--color-grey-900);
    padding: 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;

    border: 0.1rem solid black;
    border-style: solid;
    border-radius: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    font-size: 0.75rem;
  }

  &:hover::after,
  &:focus::after,
  &:active::after {
    opacity: 1;
    visibility: visible;
  }
  & > * {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease-out;
  }

  &:hover > *,
  &:focus > *,
  &:active > * {
    opacity: 100;
    visibility: visible;
  }
`;

const HeaderExsisting = styled.div`
  padding-top: 1.5rem;
`;

const ExistingBagi = memo(({ dataBagi, setShouldRedirect }) => {
  const getLocalUser = getLocalStorage("user").filter(
    (user) => user.bagiId === dataBagi.bagiId
  );
  const sliceTwouser =
    getLocalUser.length > 2 ? getLocalUser?.slice(0, 2) : getLocalUser?.slice();

  const userCalculateLength = getLocalUser?.length;
  const dispatch = useDispatch();

  const handleOnClickExisting = (e) => {
    e.preventDefault();
    setShouldRedirect(false);
    dispatch(editFromExistingBagi(dataBagi));
    dispatch(editFromExistingUserBagi(dataBagi.bagiId));
    dispatch(editFromExistingitemBagi(dataBagi.bagiId));
  };

  const date = new Date(dataBagi.bagiDate);
  const stringDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  return (
    <ExistingBagiStyled>
      <ButtonContainer>
        <ButtonRound variant="delete" title="delete" tooltip="delete">
          <Closeicon />
        </ButtonRound>
        <ButtonRound
          variant="review"
          title="review"
          tooltip="review"
          onClick={handleOnClickExisting}
        >
          <Expand />
        </ButtonRound>
      </ButtonContainer>
      <HeaderExsisting>
        <h3>{dataBagi.namaBagi}</h3>
        <span>{stringDate}</span>
      </HeaderExsisting>
      <div>
        <ul>
          {sliceTwouser.map((user) => (
            <li key={user.userId}>{user.userName},</li>
          ))}
          {userCalculateLength > 2 && (
            <li key="other">And {userCalculateLength - 2} more.. </li>
          )}
        </ul>
      </div>
    </ExistingBagiStyled>
  );
});

ExistingBagi.displayName = "ExistingBagi";

export default memo(ExistingBagi);
