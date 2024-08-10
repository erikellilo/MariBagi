import styled from "styled-components";

const FormRowStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

const FormContent = styled.div`
  display: flex;
  align-items: ${(props) =>
    props.flexDirection === "column" ? "flex-start" : "center"};
  flex-direction: ${(props) =>
    props.flexDirection === "column" ? "column" : "row"};
  justify-content: flex-start;
  gap: ${(props) => (props.flexDirection === "column" ? 0 : "1rem;")};
`;

const Label = styled.label`
  font-weight: 900;

  font-size: small;
  color: var(--color-grey-900);
`;

const FormRow = ({ children, name, flexDirection = "column" }) => {
  return (
    <FormRowStyles>
      <FormContent flexDirection={flexDirection}>
        <Label htmlFor="">{name}</Label>
        {children}
      </FormContent>
    </FormRowStyles>
  );
};

export default FormRow;
