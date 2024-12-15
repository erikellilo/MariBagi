import { memo } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import CalculateSummaryItems from "./CalculateSummaryItems";
import { useSelector } from "react-redux";
import Button from "../ui/Button";

import { summarySelector } from "../selector/selectorState";

const CalculaterSummaryStyled = styled.div`
  display: ${(props) => (props.listitemslength ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  width: 100%;

  position: relative;
  background-color: var(--color-red-100);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  border: 0.25rem solid black;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 33.33%, var(--color-brand-500) 33.33%, var(--color-brand-500) 66.66%, transparent 66.66%), linear-gradient(-45deg, transparent 33.33%, var(--color-brand-500) 33.33%, var(--color-brand-500) 66.66%, transparent 66.66%);
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
const CalculateSummary = memo(() => {
  const { bagiId, userObject, itemObject } = useSelector(summarySelector);
  const navigate = useNavigate();

  const userMap = userObject.reduce((acc, user) => {
    acc[user.userId] = user.userName;
    return acc;
  }, {});

  const userObjectLength = userObject.length;

  const processedItems = itemObject.map((item) => ({
    ...item,
    userCalculate: item.userCalculate.map((userCalc) => ({
      ...userCalc,
      userName: userMap[userCalc.userId] || "Unknown User",
    })),
  }));

  const handleDetailRedirect = (e) => {
    e.preventDefault();
    navigate(`/result/${bagiId}`);
  };

  const listitemslength = itemObject?.length;
  return (
    <CalculaterSummaryStyled listitemslength={listitemslength ? 1 : 0}>
      <CalculatSummaryContent>
        {processedItems.map((item) => (
          <CalculateSummaryItems key={item.itemId} item={item} userObjectLength={userObjectLength} />
        ))}
        <Button onClick={handleDetailRedirect} type="button" color="green">
          Details..
        </Button>
      </CalculatSummaryContent>
    </CalculaterSummaryStyled>
  );
});

CalculateSummary.displayName = "CalculateSummary";

export default CalculateSummary;
