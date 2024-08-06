import styled from "styled-components";

const FormRowStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

const FormContent = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0;
`;

const Label = styled.label`
  font-weight: 900;

  font-size: small;
  color: var(--color-grey-900);
`;

const FormRow = ({ children, name }) => {
  return (
    <FormRowStyles>
      <FormContent>
        <Label htmlFor="">{name}</Label>
        {children}
      </FormContent>
    </FormRowStyles>
  );
};

export default FormRow;
