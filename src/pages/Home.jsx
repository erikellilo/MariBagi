import styled from "styled-components";

const HomeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 2rem;
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

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5;
`;

const Button = styled.button`
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.4rem 0.6rem 0.6rem 0.4rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-grey-0);
  font-weight: 800;

  transition: border-width 0.3s ease;
  &:hover {
    border-width: 0.5rem 0.8rem 0.6rem 0.4rem;
  }
  &:active {
    border-width: 0.4rem;
  }
`;

const FormContent = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: medium;
  color: var(--color-grey-900);
`;
const Input = styled.input`
  padding: 0.9rem;
  background-color: var(--color-grey-50);
  width: 100%;
`;
const ExistNameRow = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ExistNameRowList = styled.li`
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--color-gray-900);
  background-color: var(--color-grey-0);
  padding: 0.5rem 0.75rem;
  border-radius: 25px;
  border-style: solid;
  border-color: var(--color-grey-900);
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;

  transition: border-width 0.3s ease;
  &:hover {
    border-width: 0.3rem 0.6rem 0.5rem 0.25rem;
  }
  &:active {
    border-width: 0.25rem;
  }
`;

const Home = () => (
  <HomeStyled>
    <HomeContent>
      <FormStyled>
        <FormRow>
          <Label htmlFor="bagi">Berbagi Untuk</Label>
          <FormContent>
            <Input
              type="text"
              id="bagi"
              name="bagi"
              placeholder="Tiket Dufan, Makan Senop, Nongkrong Blok M ..."
            />
          </FormContent>
        </FormRow>
        <FormRow>
          <Label htmlFor="name">Nama Orang</Label>
          <FormContent>
            <Input type="text" id="name" name="name" />
            <Button onClick={(e) => e.preventDefault()}>ADD</Button>
          </FormContent>
          <FormContent>
            <ExistNameRow>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
              <ExistNameRowList>
                <span>Nama 1</span>
                <span>&#x2716;</span>
              </ExistNameRowList>
            </ExistNameRow>
          </FormContent>
        </FormRow>
        <Button>Get Started</Button>
      </FormStyled>
    </HomeContent>
  </HomeStyled>
);

export default Home;
