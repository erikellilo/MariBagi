import { useDispatch } from "react-redux";
import styled from "styled-components";
import { memo } from "react";

import { editFromExistingBagi } from "../features/bagiSlice";
import { editFromExistingUserBagi } from "../features/usersSlice";
import { editFromExistingitemBagi } from "../features/itemsSlice";
import getLocalStorage from "../assets/getLocalStorage";

import Button from "../ui/Button";

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
  gap: 1rem;

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
      <div>
        <h3>{dataBagi.namaBagi}</h3>
        <span>{stringDate}</span>
      </div>
      <div>
        <ul>
          {sliceTwouser.map((user) => (
            <li key={user.userId}>{user.userName},</li>
          ))}
          {userCalculateLength > 2 && (
            <li key="other">And {userCalculateLength - 2} more.. </li>
          )}
        </ul>

        <Button type="button" onClick={handleOnClickExisting}>
          Edit
        </Button>
      </div>
    </ExistingBagiStyled>
  );
});

ExistingBagi.displayName = "ExistingBagi";

export default memo(ExistingBagi);
