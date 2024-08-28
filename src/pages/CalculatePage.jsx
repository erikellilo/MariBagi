import styled from "styled-components";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import CalculateUserList from "../calculate/CalculateUserRow";
import Button from "../ui/Button";
import CalculateSummary from "../calculate/CalculateSummary";
import CalculateSummaryItems from "../calculate/CalculateSummaryItems";

const CalculateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem;
  gap: 3rem;
`;

const CalculateStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  padding: 1rem 2rem;
  flex-wrap: wrap;

  border: 0.25rem solid black;
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

  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    text-align: center;
    color: var(--color-brand-900);
  }
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
  h2 {
    font-size: 2.5rem;
    color: var(--color-grey-900);
  }

  ${Input}:hover ~ & {
    background-color: yellow;
  }
`;

const ToggleListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ToggleContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 5rem;
  height: 2.5rem;
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
    height: 2rem;
    width: 2rem;
    left: 50%;
    bottom: 3px;
    background-color: var(--color-grey-50);
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ExapanseContentAndAmount = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.5rem;

  p {
    font-size: small;
    font-weight: 800;
    color: var(--color-grey-900);
  }
`;

const ExpanseAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
    <CalculateContainer>
      <CalculateStyled>
        <CalculateContent>
          <h1>Calculate</h1>
          <Form>
            <FormRow name="Pengeluaran Untuk">
              <Input
                id="expanse"
                name="expanse"
                placeholder="Bayarin Apa nih"
              />
            </FormRow>
            <FormRow name="Biaya">
              <ExapanseContentAndAmount>
                <ExpanseContent>
                  <ExpanseCurrency>
                    <h2>Rp</h2>
                  </ExpanseCurrency>
                  <Input
                    id="amount"
                    name="amount"
                    placeholder="Berapa nih?"
                    type="number"
                  />
                </ExpanseContent>
                <ExpanseAmount>
                  <p>Jumlah</p>
                  <div>
                    <button>-</button>
                    <span>1</span>
                    <button>+</button>
                  </div>
                </ExpanseAmount>
              </ExapanseContentAndAmount>
            </FormRow>
            <ToggleListContainer>
              <FormRow name="Include Tax?" flexdirection="row">
                <ToggleContainer>
                  <ToggleInput
                    name="sharedToggle"
                    id="sharedToggle"
                  ></ToggleInput>
                  <ToggleSlider />
                </ToggleContainer>
              </FormRow>
              <FormRow name="Shared?" flexdirection="row">
                <ToggleContainer>
                  <ToggleInput
                    name="sharedToggle"
                    id="sharedToggle"
                  ></ToggleInput>
                  <ToggleSlider />
                </ToggleContainer>
              </FormRow>
              <FormRow name="Service Charge?" flexdirection="row">
                <ToggleContainer>
                  <ToggleInput
                    name="sharedToggle"
                    id="sharedToggle"
                  ></ToggleInput>
                  <ToggleSlider />
                </ToggleContainer>
              </FormRow>
            </ToggleListContainer>
            <FormRow name="Service Charge">
              <ExpanseContent>
                <ExpanseCurrency>
                  <h2>Rp</h2>
                </ExpanseCurrency>
                <Input
                  id="amount"
                  name="amount"
                  placeholder="Berapa nih?"
                  type="number"
                />
              </ExpanseContent>
            </FormRow>
            <CalculateUserList />
            <Button>Add New Items</Button>
          </Form>
        </CalculateContent>
      </CalculateStyled>
      <CalculateSummary>
        <CalculateSummaryItems shared={true} />
        <CalculateSummaryItems />
        <Button>Details..</Button>
      </CalculateSummary>
    </CalculateContainer>
  );
};

export default CalculatePage;
