import styled from "styled-components";

const Button = styled.button`
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.4rem 0.6rem 0.6rem 0.4rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-grey-0);
  font-weight: 800;

  transition: border-width 0.3s ease;
  &:hover {
    border-width: 0.5rem 0.8rem 0.6rem 0.4rem;
  }
  &:active {
    border-width: 0.4rem;
  }
`;
export default Button;
