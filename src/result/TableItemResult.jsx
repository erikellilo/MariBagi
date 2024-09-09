import styled from "styled-components";
import currencyFormat from "../assets/currencyFormat";

const StyledSpanForShared = styled.span`
  font-size: 0.7rem;
  word-wrap: wrap;
`;
const StyledTDRight = styled.td`
  text-align: right;
`;

const TableItemResult = ({
  itemName,
  itemPrice,
  amount,
  isShared,
  listUsersLength,
}) => {
  const getTotalPerItems =
    (isShared ? amount / listUsersLength : amount) * itemPrice;

  return (
    <>
      <tr>
        <td>
          {itemName}
          <StyledSpanForShared>
            {" "}
            x {isShared ? listUsersLength / amount : amount}
          </StyledSpanForShared>{" "}
        </td>
        <StyledTDRight>{currencyFormat(getTotalPerItems)}</StyledTDRight>
      </tr>
    </>
  );
};

export default TableItemResult;
