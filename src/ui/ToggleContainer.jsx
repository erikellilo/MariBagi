import styled from "styled-components";

const ToggleContainerContent = styled.label`
  display: inline-block;
  position: relative;
  width: 2.75rem;
  height: 2.5rem;
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
  left: 0;
  right: 0;
  bottom: 0;

  border: 1rem solid black;
  height: 25px;
  width: 25px;
  background-color: white;

  border-color: var(--color-grey-900);
  border-width: 0.2rem 0.4rem 0.4rem 0.2rem;
  border-radius: 0.5rem;

  &::after {
    content: "";
    position: absolute;
    display: none;
  }

  &:hover {
    border-width: 0.1rem 0.2rem 0.2rem 0.1rem;
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
    background: var(--color-brand-700);
  }
`;

const ToggleContainer = ({ name, id }) => {
  return (
    <ToggleContainerContent>
      <ToggleInputStyle name={name} id={id} />
      <ToggleSliderSpan />
    </ToggleContainerContent>
  );
};

export default ToggleContainer;
