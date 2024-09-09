import styled from "styled-components";
import CalculateSummaryItems from "./CalculateSummaryItems";
import { useSelector } from "react-redux";

const CalculaterSummaryStyled = styled.div`
  display: ${(props) => (props.listitemslength ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  width: 100%;

  border: 0.25rem solid black;
  position: relative;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        45deg,
        transparent 33.33%,
        var(--color-brand-500) 33.33%,
        var(--color-brand-500) 66.66%,
        transparent 66.66%
      ),
      linear-gradient(
        -45deg,
        transparent 33.33%,
        var(--color-brand-500) 33.33%,
        var(--color-brand-500) 66.66%,
        transparent 66.66%
      );
    background-size: 10px 10px;
    opacity: 0.3;
  }
`;

const CalculatSummaryContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;
const CalculateSummary = ({ children }) => {
  const { listItems, listUsers } = useSelector((state) => state.users);

  const userMap = listUsers.reduce((acc, user) => {
    acc[user.userId] = user.userName;
    return acc;
  }, {});

  const processedItems = listItems.map((item) => ({
    ...item,
    userCalculate: item.userCalculate.map((userCalc) => ({
      ...userCalc,
      userName: userMap[userCalc.userId] || "Unknown User",
    })),
  }));

  const listitemslength = listItems?.length;
  return (
    <CalculaterSummaryStyled listitemslength={listitemslength ? 1 : 0}>
      <CalculatSummaryContent>
        {processedItems.map((item) => (
          <CalculateSummaryItems key={item.itemId} item={item} />
        ))}

        {children}
      </CalculatSummaryContent>
    </CalculaterSummaryStyled>
  );
};

export default CalculateSummary;
