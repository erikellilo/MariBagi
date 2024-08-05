import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledNavUl = styled.ul`
  text-decoration: none;
  display: flex;
  gap: 1.4rem;
  list-style-type: none;
  margin: 0.5rem 1rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;

  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  padding: 0.5rem 0.75rem;
  border-radius: 25px;
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;

  &:hover {
    border-width: 0.3rem 0.6rem 0.5rem 0.25rem;
  }

  &:active,
  &.active:link,
  &.active:visited {
    border-width: 0.25rem;
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
