import styled from "styled-components";
import React from "react";

interface Props {
  readonly size: "small" | "large";
}

const ButtonRectangleStyled = styled.button<Props>`
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: ${(props): string => (props.color === "green" ? "var(--color-green-500)" : "var(--color-red-800)")};
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.2rem 0.4rem 0.4rem 0.2rem;
  border-radius: ${(props): string => (props.size === "small" ? "0.5rem" : "1rem")};

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: ${(props): string => (props.size === "small" ? "2rem" : "4rem")};
  height: ${(props): string => (props.size === "small" ? "2rem" : "4rem")};
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  padding: ${(props): string => (props.size === "small" ? "0" : "0 0.75rem")};

  transition: border-width 0.1s ease;
  &:hover {
    border-width: ${(props): string => (props.size === "small" ? "0.1rem 0.2rem 0.2rem 0.1rem" : "0.1rem 0.5rem 0.5rem 0.1rem")};
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
    border-width: ${(props): string =>
      props.size === "small" ? "0.3rem 0.15rem 0.15rem 0.3rem" : "0.4rem 0.2rem 0.2rem 0.4rem"};
  }
`;

const ButtonRectangle = ({
  handleClickButton,
  children,
  uniqueId = null,
  isIncrement = null,
  size = "small",
  color,
}: {
  handleClickButton: (e: React.MouseEvent<Element, MouseEvent>, isIncrement: boolean | null, uniqueId: number | null) => void;
  children: React.ReactNode;
  uniqueId?: number | null;
  isIncrement?: boolean | null;
  size: "small" | "large";
  color?: string;
}): React.JSX.Element => {
  return (
    <ButtonRectangleStyled type="button" onClick={e => handleClickButton(e, isIncrement, uniqueId)} size={size} color={color}>
      {children}
    </ButtonRectangleStyled>
  );
};

export default ButtonRectangle;
