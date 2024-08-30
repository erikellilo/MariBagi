import styled from "styled-components";

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
  justify-content: space-evenly;
  flex: 1;
`;

const Label = styled.label`
  flex: 0;
  font-weight: 900;
  font-size: ${(props) =>
    props.flexdirection === "row" ? "xx-small" : "small;"};
  color: var(--color-grey-900);
`;

const FormRow = ({ children, name, flexdirection = "column", hidden }) => {
  return (
    <FormRowStyles hidden={hidden}>
      <FormContent flexdirection={flexdirection}>
        <Label htmlFor="" flexdirection={flexdirection}>
          {name}
        </Label>
        {children}
      </FormContent>
    </FormRowStyles>
  );
};

export default FormRow;
