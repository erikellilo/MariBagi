import styled from "styled-components";
import currencyFormat from "../assets/currencyFormat";

const StyledSpanForShared = styled.span`
  font-size: 0.7rem;
  word-wrap: wrap;
`;
const StyledTDRight = styled.td`
  text-align: right;
`;

const TableItemResult = ({ itemName, amount, listShared, itemPricePerson, userLength }) => {
  console.log(listShared);
  const lengthOfShared = listShared.length === userLength - 1;
  const sharedWith = listShared.join(listShared?.length === 2 ? " & " : ",");

  return (
    <>
      <tr>
        <td style={{ minWidth: "8rem", fontWeight: "bold" }}>{itemName}</td>
        <td>
          {amount} <StyledSpanForShared>{lengthOfShared ? ` With All` : sharedWith ? `with ${sharedWith}` : ""}</StyledSpanForShared>
        </td>

        <StyledTDRight>{currencyFormat(itemPricePerson)}</StyledTDRight>
      </tr>
    </>
  );
};

export default TableItemResult;
