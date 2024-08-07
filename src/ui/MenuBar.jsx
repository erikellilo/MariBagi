import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledNavUl = styled.ul`
  text-decoration: none;
  display: flex;
  gap: 1.4rem;
  list-style-type: none;
  margin: 0.5rem 1rem;
  justify-content: space-evenly;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;

  font-size: 1rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  padding: 0.5rem 0.75rem;
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  width: 5rem;

  transition: border-width 0.05s ease;
  &:hover {
    border-width: 0.1rem 0.4rem 0.5rem 0.1rem;
  }

  &:active,
  &.active:link,
  &.active:visited {
    border-width: 0.2rem 0.25rem 0.2rem 0.2rem;
  }
`;

const MenuBar = () => {
  return (
    <nav>
      <StyledNavUl>
        <li>
          <StyledNavLink to="/">Home</StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/calculate">Calculate</StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/result/:resultId">Detail</StyledNavLink>
        </li>
      </StyledNavUl>
    </nav>
  );
};

export default MenuBar;
