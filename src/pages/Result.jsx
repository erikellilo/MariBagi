import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { resultSelector } from "../selector/selectorState";

import TableItemResult from "../result/TableItemResult";
import currencyFormat from "../assets/currencyFormat";

const ResultContainer = styled.div`
  position: relative;
  background-color: var(--color-grey-200);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin: 3rem 1rem;
  padding: 1rem 2rem;
  min-height: 50vh;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 0.95rem;
    background-image: radial-gradient(
      circle at 50% 100%,
      transparent 1rem,
      var(--color-grey-200) 0.8rem
    );
    background-size: 1.72rem 1rem;
    background-repeat: repeat-x;
  }

  &:before {
    top: -0.9rem;
    transform: rotate(180deg);
  }
  &:after {
    bottom: -0.9rem;
  }
`;

const StyledTable = styled.table`
  max-width: 200rem;
  width: 27.5rem;
  margin-top: 3rem;
  th,
  td {
    padding: 0.5rem;
    font-size: 1.25rem;
  }
  thead {
    background-color: var(--color-brand-200);
    color: var(--color-grey-200);
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
`;

const Result = () => {
  const { itemObject, userObject, namaBagi, itemObjectLength } =
    useSelector(resultSelector);
  let grandTotal = 0;

  console.log(itemObjectLength);
  const processedItems = itemObject.map((item) => ({
    ...item,
    userCalculateMap: new Map(item.userCalculate.map((uc) => [uc.userId, uc])),
  }));

  const getUserItems = useMemo(
    () => (userId) => {
      const userItems = processedItems
        .filter((item) => item.userCalculateMap?.has(userId) || item.isShared)
        .map((item) => {
          const usercalc = item.userCalculateMap.get(userId);
          const amount = usercalc ? usercalc.amount : 0;
          return {
            itemName: item.calculateName,
            itemPrice: item.calculatePrice,
            isShared: item.isShared,
            amount: amount === 0 ? item.calculateAmount : amount,
          };
        });

      const subTotal = userItems.reduce(
        (total, item) =>
          total +
          item.itemPrice *
            (item.isShared ? item.amount / itemObjectLength : item.amount),
        0
      );

      return { userItems, subTotal };
    },
    [itemObjectLength, processedItems]
  );

  return (
    <ResultContainer>
      <StyledHeader>
        <h1>Split Bill</h1>
        <p>Pembagian Untuk : {namaBagi}</p>
        <p>2024 08 23</p>
      </StyledHeader>

      <StyledTable>
        <thead>
          <tr>
            <th>Name/Item</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {userObject.map((user, index) => {
            const { userItems, subTotal } = getUserItems(user.userId);

            grandTotal += subTotal;

            return (
              <Fragment key={user.userId}>
                <tr key={user.userId}>
                  <td colSpan="6">{user.userName}</td>
                </tr>
                {userItems.map((item) => (
                  <TableItemResult
                    key={user.userId + item.itemName}
                    itemName={item.itemName}
                    itemPrice={item.itemPrice}
                    amount={item.amount}
                    isShared={item.isShared}
                    listUsersLength={itemObjectLength}
                  />
                ))}

                <tr>
                  <StyledTDRight>Sub Total</StyledTDRight>
                  <StyledTDRight>{currencyFormat(subTotal)}</StyledTDRight>
                </tr>

                {index < itemObjectLength.length - 1 && (
                  <tr>
                    <td colSpan="2"></td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <StyledTDRight>TOTAL</StyledTDRight>
            <StyledTDRight>{currencyFormat(grandTotal)}</StyledTDRight>
          </tr>
        </tfoot>
      </StyledTable>
    </ResultContainer>
  );
};

export default Result;
