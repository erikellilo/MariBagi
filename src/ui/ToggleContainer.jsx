import styled from "styled-components";
import ToggleSlider from "./ToggleSlider";
import ToggleInput from "./ToggleInput";

const ToggleContainerContent = styled.div`
  display: inline-block;
  position: relative;
  width: 5rem;
  height: 2.5rem;
`;

const ToggleContainer = ({ children, name, id }) => {
  return (
    <ToggleContainerContent>
      <ToggleInput name={name} id={id} />
      <ToggleSlider />
      {children}
    </ToggleContainerContent>
  );
};

export default ToggleContainer;
