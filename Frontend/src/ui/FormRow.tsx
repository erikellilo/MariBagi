import styled from "styled-components";
import { useSelector } from "react-redux";
import React from "react";

interface Props {
  hidden?: boolean;
  flexdirection?: "column" | "flex-start" | "center" | "row";
  validationhidden?: boolean;
}

const FormRowStyles = styled.div<Props>`
  display: ${(props): string => (props.hidden === true ? "none" : "flex")};
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
`;

const FormContent = styled.div<Props>`
  display: flex;
  width: 100%;
  align-items: ${(props): string => (props.flexdirection === "column" ? "flex-start" : "center")};
  flex-direction: ${(props): string => (props.flexdirection === "column" ? "column" : "row")};
  justify-content: space-between;
  flex: 1;
`;

const ValidationWord = styled.p<Props>`
  color: red;
  font-weight: bold;
  font-size: 1rem;
  display: ${(props): string => (props.validationhidden === true ? "none" : "block")};
`;

const Label = styled.label`
  flex: 0;
  font-weight: 900;
  color: var(--color-grey-900);
`;

const FormRow = ({
  children,
  name,
  hiddenName = false,
  flexdirection,
  hidden,
}: {
  children: React.ReactNode;
  name: string;
  hiddenName: boolean;
  flexdirection: Props;
  hidden: boolean;
}): React.JSX.Element => {
  const { form, message } = useSelector(state => state.error);
  return (
    <FormRowStyles hidden={hidden}>
      <FormContent flexdirection={flexdirection}>
        <Label htmlFor="" flexdirection={flexdirection}>
          {hiddenName ? "" : name}
        </Label>
        {children}
        <ValidationWord validationhidden={name === form ? "block" : "none"}>{name === form && message}</ValidationWord>
      </FormContent>
    </FormRowStyles>
  );
};

export default FormRow;
