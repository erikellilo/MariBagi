import styled from "styled-components";
import { useSelector } from "react-redux";

const FormRowStyles = styled.div`
  display: ${(props) => props.hidden || "flex"};
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
`;

const FormContent = styled.div`
  display: flex;
  width: 100%;
  align-items: ${(props) =>
    props.flexdirection === "column" ? "flex-start" : "center"};
  flex-direction: ${(props) =>
    props.flexdirection === "column" ? "column" : "row"};
  justify-content: space-between;
  flex: 1;
`;

const ValidationWord = styled.p`
  color: red;
  font-weight: bold;
  font-size: 1rem;
  display: ${(props) => props.validationhidden || "block"};
`;

const Label = styled.label`
  flex: 0;
  font-weight: 900;
  color: var(--color-grey-900);
`;

const FormRow = ({ children, name, flexdirection = "column", hidden }) => {
  const { form, message } = useSelector((state) => state.error);
  return (
    <FormRowStyles hidden={hidden}>
      <FormContent flexdirection={flexdirection}>
        <Label htmlFor="" flexdirection={flexdirection}>
          {name === "Jumlah" ? "" : name}
        </Label>
        {children}
        <ValidationWord validationhidden={name === form ? "block" : "none"}>
          {name === form && message}
        </ValidationWord>
      </FormContent>
    </FormRowStyles>
  );
};

export default FormRow;
