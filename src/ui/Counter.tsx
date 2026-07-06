import styled from "styled-components";
import ButtonRectangle from "./ButtonRectangle";
import React from "react";

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  & span {
    font-size: 2rem;
    font-weight: bolder;
    color: var(--color-grey-900);
  }
`;

const Counter = ({
  children,
  handleOnIncrement,
  user,
}: {
  children: React.ReactNode;
  handleOnIncrement: () => void;
  user: { userId: number };
}): React.JSX.Element => {
  return (
    <CounterContainer>
      <ButtonRectangle size="large" handleClickButton={handleOnIncrement} isIncrement={false} uniqueId={user.userId} color="red">
        -
      </ButtonRectangle>
      <span>{children}</span>
      <ButtonRectangle size="large" handleClickButton={handleOnIncrement} isIncrement={true} uniqueId={user.userId} color="green">
        +
      </ButtonRectangle>
    </CounterContainer>
  );
};

export default Counter;
