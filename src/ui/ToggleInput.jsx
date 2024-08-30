import styled from "styled-components";

const ToggleInputStyle = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;

  &:checked + span {
    background-color: #808080;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleInput = ({ name, id }) => {
  <ToggleInputStyle name={name} id={id} />;
};

export default ToggleInput;
