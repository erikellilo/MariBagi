import styled from "styled-components";

const ExistNameRowListStyled = styled.li`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 8rem;
  height: 4.5rem;
  cursor: pointer;

  transition: border-width 0.1s ease;
  &:hover {
    border-width: 0.1rem 0.5rem 0.5rem 0.1rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }
`;

const ExistNameRowList = ({ name }) => (
  <ExistNameRowListStyled>
    <span>{name}</span>
    <span>&#x2716;</span>
  </ExistNameRowListStyled>
);

export default ExistNameRowList;
