import { useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import ExistNameRow from "../home/ExistNameRow";
import { insertNewUser, insertName } from "../features/usersSlicer";
import Input from "../ui/Input";

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
// const Input = styled.input`
//   padding: 0.75rem;
//   background-color: var(--color-grey-50);
//   height: 5rem;
//   width: 100%;
//   flex-grow: 1;
// `;
const InputWithButton = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  gap: 1rem;
`;

const Home = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formHome, setFormHome] = useState(users.namaBagi || "");
  const refUser = useRef(null);

  const handleOnChangeName = (e) => {
    e.preventDefault();
    setFormHome(e.target.value);
  };

  const handleOnChangeUser = (e) => {
    e.preventDefault();
    const inputValue = refUser.current.value; // Access input value through ref
    if (
      users?.listUsers.length > 0 &&
      users?.listUsers.find((user) => user.userName === inputValue)
    )
      return;
    if (!inputValue) return;
    dispatch(insertNewUser(inputValue));
    refUser.current.value = ""; // Clear the input
  };

  const handleOnSubmitFromEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      dispatch(insertNewUser(e.target.value));
      e.target.value = "";
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const bagiId = users.bagiId || new Date().getUTCMilliseconds();
    dispatch(insertName({ formHome, bagiId }));
    setFormHome("");
    navigate(`/calculate/${bagiId}`);
  };

  return (
    <HomeStyled>
      <HomeContent>
        <Form onSubmit={handleSubmitForm}>
          <FormRow name="BAGI">
            <Input
              type="text"
              id="bagi"
              name="name"
              value={formHome}
              placeholder="Tiket Dufan, Makan Senop, Nongkrong Blok M ..."
              handleOnchange={handleOnChangeName}
            />
          </FormRow>
          <FormRow name="NAMA">
            <InputWithButton>
              <Input
                type="text"
                id="users"
                name="users"
                ref={refUser}
                onKeyDown={handleOnSubmitFromEnter}
              />
              <Button type="button" onClick={handleOnChangeUser}>
                ADD
              </Button>
            </InputWithButton>
          </FormRow>
          <ExistNameRow />
          <Button type="submit">Get Started</Button>
        </Form>
      </HomeContent>
    </HomeStyled>
  );
};

export default Home;
