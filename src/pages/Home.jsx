import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { insertBagi } from "../features/bagiSlice";
import { insertNewUser } from "../features/usersSlice";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import ExistNameRow from "../home/ExistNameRow";
import Input from "../ui/Input";
import ExistingBagi from "../home/ExistingBagi";

const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 30rem;
`;

const HomeStyled = styled.div`
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
const HomeContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
`;

const InputWithButton = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  gap: 1rem;
`;

const Home = () => {
  const { bagi, user } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formHome, setFormHome] = useState(bagi.namaBagi || "");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const refUser = useRef(null);
  const getLocal = localStorage.getItem("users");
  const existingLocalState = JSON.parse(getLocal) || [];

  useEffect(() => {
    setFormHome(bagi.namaBagi);
  }, [bagi.namaBagi]);

  const handleOnChangeName = (e) => {
    e.preventDefault();
    setFormHome(e.target.value);
  };

  const handleOnChangeUser = (e) => {
    e.preventDefault();
    const inputValue = refUser.current.value;

    if (user?.length > 0 && user?.find((user) => user.userName === inputValue))
      return;
    if (!inputValue || inputValue?.trim() === "") return;
    dispatch(insertNewUser(inputValue));
    refUser.current.value = "";
  };

  const handleOnSubmitFromEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOnChangeUser(e);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const bagiId = bagi.bagiId || new Date().getUTCMilliseconds();
    dispatch(insertBagi({ formHome, bagiId }));
    setShouldRedirect(true);
  };

  useEffect(() => {
    if (shouldRedirect === false) return;
    // if (
    //   Object.keys(users?.isError).length >= 0 &&
    //   users?.isError?.form === "BAGI"
    // )
    //   return;

    setFormHome("");
    setShouldRedirect(false);
    navigate(`/calculate/${bagi.bagiId}`);
  }, [bagi.bagiId, shouldRedirect, navigate]);

  return (
    <HomeContainer>
      <HomeStyled>
        <HomeContent>
          <Form onSubmit={handleSubmitForm}>
            <FormRow
              name="BAGI"
              // validationWord={users?.isError?.error}
              // validationHidden={users?.isError?.form}k
            >
              <Input
                type="text"
                id="bagi"
                name="name"
                value={formHome}
                placeholder="Tiket Dufan, Makan Senop, Nongkrong Blok M ..."
                handleOnchange={handleOnChangeName}
              />
            </FormRow>
            <FormRow
              name="NAMA"
              // validationWord={users?.isError?.error?.error}
              // validationHidden={users?.isError?.error?.form}
            >
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
            <ExistNameRow users={user} />
            <Button type="submit">Get Started</Button>
          </Form>
        </HomeContent>
      </HomeStyled>
      {existingLocalState.length > 0 && (
        <HomeStyled>
          <HomeContent>
            <h2>Existing Bagi</h2>
            {existingLocalState?.map((local) => (
              <ExistingBagi
                key={local.bagiId}
                dataBagi={local}
                setShouldRedirect={setShouldRedirect}
              />
            ))}
          </HomeContent>
        </HomeStyled>
      )}
    </HomeContainer>
  );
};

export default Home;
