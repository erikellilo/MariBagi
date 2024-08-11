import styled from "styled-components";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import ExistNameRow from "../Home.jsx/ExistNameRow";

const HomeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 1rem;
  padding: 2rem;
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

const HomeContent = styled.div`
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

const InputWithButton = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  gap: 1rem;
`;

const Home = () => (
  <HomeStyled>
    <HomeContent>
      <Form>
        <FormRow name="BAGI">
          <Input
            type="text"
            id="bagi"
            name="bagi"
            placeholder="Tiket Dufan, Makan Senop, Nongkrong Blok M ..."
          />
        </FormRow>
        <FormRow name="NAMA">
          <InputWithButton>
            <Input type="text" id="name" name="name" />
            <Button onClick={(e) => e.preventDefault()}>ADD</Button>
          </InputWithButton>
        </FormRow>
        <ExistNameRow />
        <Button>Get Started</Button>
      </Form>
    </HomeContent>
  </HomeStyled>
);

export default Home;
