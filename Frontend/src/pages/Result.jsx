import { Fragment, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { resultSelector } from "../selector/selectorState";

import TableItemResult from "../result/TableItemResult";
import currencyFormat from "../assets/currencyFormat";

const ResultContainer = styled.div`
  position: relative;
  background-color: #efe4db;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin: 3rem 1rem;
  padding: 1rem 2rem;
  min-height: 50vh;
  padding-bottom: 5rem;
  position: relative;

  background: radial-gradient(circle at 50% 100%, transparent 15px, #efe4db 16px) 0 0/30px 100% repeat-x;

  &:before {
    content: "";
    position: absolute;
    top: -18px;
    left: 0px;
    width: 100%;
    height: 20px;
    background: radial-gradient(circle at 50% 0%, transparent 15px, #efe4db 16px) 0 0/30px 100% repeat-x;
  }
`;

const StyledTable = styled.table`
  max-width: 200rem;
  width: 30rem;
  margin-top: 3rem;
  th,
  td {
    padding: 0.5rem;
    font-size: 1.25rem;
  }
  thead {
    background-color: var(--color-brand-200);
    color: var(--color-grey-200);
    text-align: left;
  }
  tbody {
    padding: 1rem;
    border-top: 10px solid black;
  }
  tfoot {
    padding-bottom: 1rem;
    td {
      border: none;

      padding-top: 10rem;
    }
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 1.25rem;
  border-bottom: 3px dotted black;

  h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1.25rem;
    font-weight: bolder;
    color: var(--color-grey-600);
  }
`;

const StyledTDRight = styled.td`
  text-align: right;
  font-weight: bolder;
`;

const itemPricePersonCalculate = (itemPrice, amount, listUsersLength, listShared, userLength) => {
  const itemPricePerPerson = itemPrice * amount;
  const listSharedLength = listShared?.length;
  const valuuePerItem = listShared?.length >= 0 && !userLength ? itemPricePerPerson / (listSharedLength + 1) : itemPricePerPerson / listUsersLength;

  return valuuePerItem;
};

const Result = () => {
  const { itemObject, userObject, namaBagi, itemObjectLength } = useSelector(resultSelector);
  let grandTotal = 0;
  const userLength = userObject?.length;

  const getUserName = useCallback(
    (userId) => {
      return userObject.find((user) => user.userId === userId)?.userName;
    },
    [userObject]
  );

  const getUserItems = useMemo(
    () => (userId) => {
      const userItems = itemObject
        .filter((item) => {
          return item.userCalculate?.some((user) => user.userId === userId) || userLength === item.userCalculate.length;
        })
        .map((item) => {
          const sharedPartialList = item.userCalculate.filter((user) => user.userId !== userId).map((user) => getUserName(user.userId));
          const userLengthMap = userLength === item.userCalculate.length;
          return {
            itemName: item.calculateName,
            itemPrice: item.calculatePrice,
            isShared: !item.isSharedPartial,
            amount: item.calculateAmount,
            listShared: sharedPartialList,
            itemPricePerson: itemPricePersonCalculate(item.calculatePrice, item.calculateAmount, itemObjectLength, sharedPartialList, userLengthMap),
          };
        });

      const subTotal = userItems.reduce((total, item) => total + item.itemPricePerson, 0);

      return { userItems, subTotal };
    },
    [itemObjectLength, itemObject, getUserName, userLength]
  );

  return (
    <ResultContainer>
      <StyledHeader>
        <h1>Split Bill</h1>
        <h2>{namaBagi}</h2>
        <p>2024 08 23</p>
      </StyledHeader>

      <StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Price Total/Person</th>
          </tr>
        </thead>
        <tbody>
          {userObject.map((user) => {
            const { userItems, subTotal } = getUserItems(user.userId);
            grandTotal += subTotal;

            return (
              <Fragment key={user.userId}>
                <tr key={user.userId}>
                  <td
                    colSpan="6"
                    style={{
                      fontWeight: "bolder",
                      borderBottom: "2px dotted black",
                    }}
                  >
                    {user.userName}
                  </td>
                </tr>
                {userItems.map((item) => (
                  <TableItemResult key={user.userId + item.itemName} itemName={item.itemName} amount={item.amount} isShared={item.isShared} listShared={item.listShared} itemPricePerson={item.itemPricePerson} userLength={userLength} />
                ))}

                <tr>
                  <td colSpan="2">Sub Total</td>
                  <StyledTDRight style={{ backgroundColor: "#EEE982" }}>{currencyFormat(subTotal)}</StyledTDRight>
                </tr>
                <tr>
                  <td style={{ paddingBottom: "2rem" }}></td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <StyledTDRight>TOTAL</StyledTDRight>
            <td></td>

            <StyledTDRight>
              <h3 style={{ backgroundColor: "#EEE982" }}>{currencyFormat(grandTotal)}</h3>
            </StyledTDRight>
          </tr>
        </tfoot>
      </StyledTable>
    </ResultContainer>
  );
};

export default Result;
