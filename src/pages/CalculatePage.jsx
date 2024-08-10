import styled from "styled-components";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import CalculateUserList from "../Calculate/CalculateUserRow";
import Button from "../ui/Button";

const CalculateStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 1rem;
  padding: 2rem;
  border: 0.25rem solid black;
  width: 100%;

  position: relative;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        45deg,
        transparent 33.33%,
        var(--color-brand-500) 33.33%,
        var(--color-brand-500) 66.66%,
        transparent 66.66%
      ),
      linear-gradient(
        -45deg,
        transparent 33.33%,
        var(--color-brand-500) 33.33%,
        var(--color-brand-500) 66.66%,
        transparent 66.66%
      );
    background-size: 10px 10px;
    opacity: 0.3;
  }
`;

const CalculateContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.75rem;
  background-color: var(--color-grey-50);
  height: 5rem;
  width: 100%;
  flex-grow: 1;
`;

const ExpanseCurrency = styled.div`
  background-color: var(--color-brand-200);
  padding: 0.3rem 0.5rem 0rem 0.5rem;
  border: 0.2rem solid var(--color-grey-900);
  display: flex;
  align-items: center;
  justify-content: center;

  transition: border-width 0.1s ease;
  h1 {
    font-size: 2.5rem;
    color: var(--color-grey-900);
  }

  ${Input}:hover ~ & {
    background-color: yellow;
  }
`;

const ToggleContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 6rem;
  height: 3.5rem;
`;

const ToggleInput = styled.input.attrs({ type: "checkbox" })`
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

const ToggleSlider = styled.span`
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
    height: 2.75rem;
    width: 2.75rem;
    left: 5%;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ExpanseContent = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;

  &:focus-within ${ExpanseCurrency} {
    background-color: var(--color-grey-500);
    outline: 2px solid var(--color-brand-600);
    outline-offset: -1px;
  }
`;

const CalculatePage = () => {
  return (
    <CalculateStyled>
      <CalculateContent>
        <h1>Calculate</h1>
        <Form>
          <FormRow name="Pengeluaran Untuk">
            <Input id="expanse" name="expanse" placeholder="Bayarin Apa nih" />
          </FormRow>
          <FormRow name="Biaya">
            <ExpanseContent>
              <ExpanseCurrency>
                <h1>Rp</h1>
              </ExpanseCurrency>
              <Input
                id="amount"
                name="amount"
                placeholder="Berapa nih?"
                type="number"
              />
            </ExpanseContent>
          </FormRow>
          <FormRow name="Shared?" flexDirection="row">
            <ToggleContainer>
              <ToggleInput name="sharedToggle" id="sharedToggle"></ToggleInput>
              <ToggleSlider />
            </ToggleContainer>
          </FormRow>
          <CalculateUserList />
          <Button>Add New Items</Button>
        </Form>
      </CalculateContent>
    </CalculateStyled>
  );
};

export default CalculatePage;
