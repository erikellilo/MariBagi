import React from "react";
import styled from "styled-components";

interface Props {
  readonly variant: "review";
  readonly tooltip: string;
}

const ButtonRoundStyled = styled.button<Props>`
  position: relative;
  background-color: ${(props): string => (props.variant === "review" ? "var(--color-green-500)" : "var(--color-red-800)")};
  color: var(--color-grey-0);
  font-weight: bolder;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 100%;
  outline: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &::after {
    content: "${(props): string => props.tooltip}";
    position: absolute;
    top: 100%; /* Adjust this to control the distance */
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-grey-0);
    color: var(--color-grey-900);
    padding: 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;

    border: 0.1rem solid black;
    border-style: solid;
    border-radius: 1rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    font-size: 0.75rem;
  }

  &:hover::after,
  &:active::after {
    opacity: 1;
    visibility: visible;
  }
  & > * {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s ease-out;
  }

  &:hover > *,
  &:focus > * {
    opacity: 100;
    visibility: visible;
  }
`;

const ButtonRound = ({
  children,
  tooltip,
  variant,
  onclick,
}: {
  children: React.ReactNode;
  tooltip: string;
  variant: "review";
  onclick: () => void;
}): React.JSX.Element => {
  return (
    <ButtonRoundStyled type="button" tooltip={tooltip} variant={variant} onClick={onclick}>
      {children}
    </ButtonRoundStyled>
  );
};

export default ButtonRound;
