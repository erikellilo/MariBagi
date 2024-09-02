import styled from "styled-components";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import CalculateUserList from "../calculate/CalculateUserRow";
import Button from "../ui/Button";
import CalculateSummary from "../calculate/CalculateSummary";
import CalculateSummaryItems from "../calculate/CalculateSummaryItems";
import { useSelector } from "react-redux";
import Input from "../ui/Input";
import { useState } from "react";
import ToggleContainer from "../ui/ToggleContainer";
import Counter from "../ui/Counter";

const CalculateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem;
  gap: 3rem;
`;

const CalculateStyled = styled.div`
  width: 32rem;
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
`;

const ToggleListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  margin-top: 1rem;

  & p {
    font-size: 1.75rem;
    font-weight: bolder;
    color: var(--color-grey-900);
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
  const { namaBagi, listUsers } = useSelector((state) => state.users);
  const [expanseName, setExpanseName] = useState("");
  const [expansePrice, setExpansePrice] = useState(0);
  const [jumlahExpanse, setJumlahExpanse] = useState(0);

  const handleChangeExpanseName = (e) => {
    e.preventDefault();
    setExpanseName(e.target.value);
  };

  const handleChangeExpansePrice = (e) => {
    e.preventDefault();
    if (e.target.value < 0) return;
    setExpansePrice(e.target.value);
  };

  const handleMatchUserCount = (e) => {
    e.preventDefault();
    setJumlahExpanse(listUsers.length);
  };

  const handleOnIncrement = (e, increment) => {
    e.preventDefault();
    if (jumlahExpanse <= 0 && !increment) return;
    if (increment === true) {
      setJumlahExpanse((prev) => (prev = prev + 1));
    } else {
      setJumlahExpanse((prev) => (prev = prev - 1));
    }
  };

  return (
    <CalculateContainer>
      <CalculateStyled>
        <CalculateContent>
          <h1>Calculate - {namaBagi}</h1>
          <Form>
            <FormRow name="Pengeluaran Untuk">
              <Input
                id="expanse"
                name="expanse"
                placeholder="Bayarin Apa nih"
                value={expanseName}
                handleOnchange={handleChangeExpanseName}
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
                    value={expansePrice}
                    handleOnchange={handleChangeExpansePrice}
                  />
                </ExpanseContent>
              </ExapanseContentAndAmount>
            </FormRow>
            <FormRow name="">
              <ExpanseAmount>
                <p>Jumlah</p>
                <Button onClick={handleMatchUserCount}>Match User</Button>
                <Counter handleOnIncrement={handleOnIncrement}>
                  {jumlahExpanse}
                </Counter>
              </ExpanseAmount>
            </FormRow>

            <FormRow name="Shared" flexdirection="row">
              <ToggleContainer name="sharedToggle" id="sharedToggle" />
            </FormRow>
            {/* <ToggleListContainer>
              <FormRow name="Include Tax?" flexdirection="row">
                <ToggleContainer name="sharedToggle" id="sharedToggle" />
              </FormRow>
              <FormRow name="Shared?" flexdirection="row">
                <ToggleContainer name="sharedToggle" id="sharedToggle" />
              </FormRow>
              <FormRow name="Service Charge?" flexdirection="row">
                <ToggleContainer name="sharedToggle" id="sharedToggle" />
              </FormRow>
            </ToggleListContainer> */}
            <FormRow name="Service Charge" hidden={true}>
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
      <CalculateSummary listofexpanse={true}>
        <CalculateSummaryItems shared={true} />
        <CalculateSummaryItems />
        <Button>Details..</Button>
      </CalculateSummary>
    </CalculateContainer>
  );
};

export default CalculatePage;
