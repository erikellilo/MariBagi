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

const CounterStyled = styled.button`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.2rem 0.4rem 0.4rem 0.2rem;
  border-radius: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 3.25rem;
  height: 3.25rem;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: 0 0.75rem;

  transition: border-width 0.1s ease;
  &:hover {
    border-width: 0.1rem 0.5rem 0.5rem 0.1rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }
`;

const Counter = ({ children, handleOnIncrement, user = "" }) => {
  return (
    <CounterContainer>
      <ButtonRectangle
        // onClick={(e) => handleOnIncrement(e, false, user.userId)}
        type="button"
        handleClickButton={handleOnIncrement}
        isIncrement={false}
        uniqueId={user.userId}
        color="green"
      >
        -
      </ButtonRectangle>
      <span>{children}</span>
      <ButtonRectangle
        // onClick={(e) => handleOnIncrement(e, true, user.userId)}
        type="button"
        handleClickButton={handleOnIncrement}
        isIncrement={true}
        uniqueId={user.userId}
      >
        +
      </ButtonRectangle>
    </CounterContainer>
  );
};

export default Counter;
