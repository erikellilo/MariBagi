import styled from "styled-components";

const ExistNameRowListStyled = styled.li`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  padding: 0.5rem 0.75rem;
  border-radius: 25px;
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;

  transition: border-width 0.3s ease;
  &:hover {
    border-width: 0.3rem 0.6rem 0.5rem 0.25rem;
  }
  &:active {
    border-width: 0.25rem;
  }
`;

const ExistNameRowList = ({ name }) => (
  <ExistNameRowListStyled>
    <span>{name}</span>
    <span>&#x2716;</span>
  </ExistNameRowListStyled>
);

export default ExistNameRowList;
