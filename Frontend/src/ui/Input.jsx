import styled from "styled-components";
import { forwardRef } from "react";

const InputStyled = styled.input`
  padding: 0.75rem;
  background-color: var(--color-grey-0);
  height: 5rem;
  width: 100%;
  flex-grow: 1;
  border: 5px solid black;
  border-radius: 1rem;
`;

const Input = forwardRef(function Input(
  { type, id, name, value, placeholder, handleOnchange, onKeyDown, isDisable },
  ref
) {
  return (
    <InputStyled
      ref={ref}
      type={type}
      id={id}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={handleOnchange}
      onKeyDown={onKeyDown}
      disabled={isDisable}
      {...(type === "number" ? { min: 1 } : {})}
    />
  );
});

export default Input;
