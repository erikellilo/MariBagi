import styled from "styled-components";
import currencyFormat from "../assets/currencyFormat";
import ButtonRectangle from "../ui/ButtonRectangle";
import { useDispatch } from "react-redux";
import { deleteItem } from "../features/itemsSlice";
import IconClose from "../assets/icon/icon-close.svg";

const CalculateSummaryItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 0.25rem 1rem;

  background-color: var(--color-grey-0);

  border: 0.25rem solid black;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
`;

const ItemContenctDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  div {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  span {
    font-size: 1.25rem;

    font-weight: bold;
  }

  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;

    li {
      font-size: 1.25rem;
      font-weight: bolder;
    }
    li:nth-child(3) {
      font-size: 1rem;
      align-self: end;
      font-weight: bold;
    }
  }
`;

const CalculateSummaryItems = ({ item }) => {
  const { userCalculate, itemId } = item;
  const userCalculateLength = userCalculate?.length;
  const sliceTwouser = userCalculate?.length > 2 ? userCalculate?.slice(0, 2) : userCalculate?.slice();
  const dispatch = useDispatch();

  const handleDelete = (e, _, uniqueId) => {
    dispatch(deleteItem(uniqueId));
  };

  return (
    <CalculateSummaryItemStyled>
      <ItemContenctDiv>
        <h3>{item.calculateName}</h3>

        <ButtonRectangle size="small" handleClickButton={handleDelete} uniqueId={itemId} color="red">
          <IconClose />
        </ButtonRectangle>
      </ItemContenctDiv>
      <ItemContenctDiv>
        <div>
          {" "}
          <p>{currencyFormat(item.calculatePrice)}</p>
          <span>x{item.calculateAmount}</span>
        </div>

        {!item.isSharedPartial ? (
          <span>SHARED</span>
        ) : (
          <ul>
            {sliceTwouser?.map((user) => (
              <li key={user.userId}>{user.userName}</li>
            ))}
            {userCalculateLength > 2 && <li key="other">And {userCalculateLength - 2} more.. </li>}
          </ul>
        )}
      </ItemContenctDiv>
    </CalculateSummaryItemStyled>
  );
};

export default CalculateSummaryItems;
