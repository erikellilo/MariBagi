import styled from "styled-components";

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
  border-width: 0.1rem 0.25rem 0.25rem 0.1rem;
  border-radius: 0.5rem;

  &:before {
    position: absolute;
    content: "";
  }

  &:hover {
    border-width: 0.1rem 0.2rem 0.2rem 0.1rem;
  }
  &:active {
    border-width: 0.4rem 0.2rem 0.2rem 0.4rem;
  }
`;

const ToggleSlider = () => {
  return <ToggleSliderSpan />;
};

export default ToggleSlider;
