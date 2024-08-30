import styled from "styled-components";

const ToggleSliderSpan = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-grey-500);
  background-color: var(--color-brand-700);
  outline: 2px solid var(--color-grey-900);
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 2rem;
    width: 2rem;
    left: 50%;
    bottom: 3px;
    background-color: var(--color-grey-50);
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ToggleSlider = () => {
  return <ToggleSliderSpan />;
};

export default ToggleSlider;
