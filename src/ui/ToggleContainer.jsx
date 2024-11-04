import styled from "styled-components";
import CheckedIcon from "../../public/icon-check.svg";

const ToggleContainerContent = styled.label`
  display: inline-block;
  position: relative;
  width: 2.75rem;
  height: 3rem;
  cursor: pointer;
  user-select: none;

  p {
    font-size: small;
    font-weight: 800;
    color: var(--color-grey-900);
  }
`;

const ToggleSliderSpan = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: -4px;
  right: 0;
  bottom: 0;

  border: 1rem solid black;
  height: 3rem;
  width: 3.2rem;
  background-color: var(--color-grey-0);

  border-width: 0.15rem 0.4rem 0.4rem 0.15rem;

  border-radius: 1rem;

  transition: border-width 0.1s ease;

  &::after {
    content: "";
    position: absolute;
    display: none;
  }

  &:hover {
    border-width: 0.2rem 0.4rem 0.4rem 0.2rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }
`;

const ToggleInputStyle = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  transition: all 0.1s ease;

  &:checked + ${ToggleSliderSpan} {
    background: var(--color-green-500);
  }
`;

const ToggleContainer = ({ name, id, handleOnchange, value }) => {
  return (
    <ToggleContainerContent>
      <ToggleInputStyle
        name={name}
        id={id}
        onChange={handleOnchange}
        value={value}
        checked={value}
      />
      <ToggleSliderSpan>{value && <CheckedIcon />}</ToggleSliderSpan>
    </ToggleContainerContent>
  );
};

export default ToggleContainer;
