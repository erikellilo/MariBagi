import styled from "styled-components";

const Button = styled.button`
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
  padding: 0.1rem 0.25rem;
  background-color: var(--color-grey-0);
  font-weight: 800;
  font-size: 1.5rem;

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
