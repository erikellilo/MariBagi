import styled from "styled-components";

const Button = styled.button`
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
  border-color: var(--color-grey-900);
  padding: ${(props) =>
    props.variant === "rectangle" ? "0.1rem 1.25rem" : "0.75rem"};

  background-color: ${(props) =>
    props.variant === "rectangle"
      ? "var(--color-green-500)"
      : "var(--color-blue-500)"};

  font-weight: 900;
  font-size: 1.25rem;

  transition: all 0.1s ease;
  &:hover {
    border-width: 0.1rem 0.5rem 0.5rem 0.1rem;
    transform: scale(1.05);
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
    transform: scale(1);
  }
`;
export default Button;
