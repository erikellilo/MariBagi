import styled from "styled-components";
import ButtonRectangle from "./ButtonRectangle";

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

const Counter = ({ children, handleOnIncrement, user = "" }) => {
  return (
    <CounterContainer>
      <ButtonRectangle
        onClick={(e) => handleOnIncrement(e, false, user.userId)}
        type="button"
        handleClickButton={handleOnIncrement}
        isIncrement={false}
        uniqueId={user.userId}
        color="red"
      >
        -
      </ButtonRectangle>
      <span>{children}</span>
      <ButtonRectangle
        onClick={(e) => handleOnIncrement(e, true, user.userId)}
        type="button"
        handleClickButton={handleOnIncrement}
        isIncrement={true}
        uniqueId={user.userId}
        color="green"
      >
        +
      </ButtonRectangle>
    </CounterContainer>
  );
};

export default Counter;
