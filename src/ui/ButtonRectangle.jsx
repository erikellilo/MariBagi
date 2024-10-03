import styled from "styled-components";

const ButtonRectangleStyled = styled.button`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: ${(props) =>
    props.color === "green"
      ? "var(--color-green-500)"
      : "var(--color-red-800)"};
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.2rem 0.4rem 0.4rem 0.2rem;
  border-radius: ${(props) => (props.size === "small" ? "0.5rem" : "1rem")};

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: ${(props) => (props.size === "small" ? "2rem" : "3.25rem")};
  height: ${(props) => (props.size === "small" ? "2rem" : "3.25rem")};
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: ${(props) => (props.size === "small" ? "0" : "0 0.75rem")};

  transition: border-width 0.1s ease;
  &:hover {
    border-width: ${(props) =>
      props.size === "small"
        ? "0.1rem 0.2rem 0.2rem 0.1rem"
        : "0.1rem 0.5rem 0.5rem 0.1rem"};
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
    border-width: ${(props) =>
      props.size === "small"
        ? "0.3rem 0.15rem 0.15rem 0.3rem"
        : "0.4rem 0.2rem 0.2rem 0.4rem"};
  }
`;

const ButtonRectangle = ({
  handleClickButton,
  children,
  uniqueId = null,
  isIncrement = null,
  size,
  color,
}) => {
  return (
    <ButtonRectangleStyled
      type="button"
      onClick={(e) => handleClickButton(e, isIncrement, uniqueId)}
      size={size}
      color={color}
    >
      {children}
    </ButtonRectangleStyled>
  );
};

export default ButtonRectangle;
