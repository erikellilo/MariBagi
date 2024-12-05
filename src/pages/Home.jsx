import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { insertBagi } from "../features/bagiSlice";
import { insertNewUser } from "../features/usersSlice";
import { addError, clearError } from "../features/errorSlice";

import getLocalStorage from "../assets/getLocalStorage";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Button from "../ui/Button";
import ExistNameRow from "../home/ExistNameRow";
import Input from "../ui/Input";
import ExistingBagi from "../home/ExistingBagi";
import { homeSelector } from "../selector/selectorState";

const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-width: 30rem;
  gap: 2rem;
  margin-top: 2rem;
`;

const HomeStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  flex-wrap: wrap;
  padding: 2rem;
  width: 100%;
  background-color: var(--color-red-100);

  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  border: 0.25rem solid black;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
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
  const { bagiId, namaBagi, userIds, userNames } = useSelector(homeSelector);

  const [formHome, setFormHome] = useState(namaBagi || "");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [existingLocalState, setExistingLocalState] = useState(
    getLocalStorage("bagi") || []
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bagiIdRef = useRef(bagiId || new Date().getUTCMilliseconds());
  const refUser = useRef(null);

  useEffect(() => {
    setFormHome(namaBagi);
  }, [namaBagi]);

  useEffect(() => {
    if (bagiId && bagiId !== bagiIdRef.current) bagiIdRef.current = bagiId;
  }, [bagiId]);

  const handleOnChangeName = (e) => {
    e.preventDefault();
    setFormHome(e.target.value);
  };

  const handleOnChangeUser = (e) => {
    e.preventDefault();
    const inputValue = refUser.current.value;

    if (
      userIds?.length > 0 &&
      userNames?.find((user) => user.toUpperCase() === inputValue.toUpperCase())
    ) {
      dispatch(clearError());
      dispatch(
        addError({ form: "NAMA", message: "Cannot Add Same Name In One Bagi" })
      );
      return;
    }

    if (!inputValue || inputValue?.trim() === "") {
      {
        dispatch(clearError());
        dispatch(
          addError({
            form: "NAMA",
            message: "Cannot Add Empty Name",
          })
        );
        return;
      }
    }

    dispatch(insertNewUser(inputValue, bagiIdRef.current));
    dispatch(clearError());
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

    const isExistingLocal = existingLocalState?.findIndex(
      (users) => users.bagiId === bagiId
    );

    const isExistingName = existingLocalState?.findIndex(
      (users) => users.namaBagi.toUpperCase() === formHome.toUpperCase()
    );

    if (userIds.length < 2) {
      dispatch(clearError());
      dispatch(
        addError({ form: "BAGI", message: "Need to Insert Minimal Of 2 Users" })
      );
      return;
    }

    if (!formHome) {
      dispatch(clearError());
      dispatch(
        addError({
          form: "BAGI",
          message: "Cannot Insert Empty String In Bagi Name",
        })
      );
      return;
    }

    if (
      isExistingName >= 0 &&
      existingLocalState[isExistingName].bagiId !== bagiIdRef.current
    ) {
      dispatch(clearError());
      dispatch(
        addError({
          form: "BAGI",
          message: "Cannot Insert A Same Name with different ID",
        })
      );
      return;
    }

    dispatch(
      insertBagi({ formHome, bagiId: bagiIdRef.current, isExistingLocal })
    );
    dispatch(clearError());
    setShouldRedirect(true);
  };

  useEffect(() => {
    if (shouldRedirect === false) return;

    setFormHome("");
    setShouldRedirect(false);
    navigate(`/calculate/${bagiId}`);
  }, [bagiId, shouldRedirect, navigate]);

  return (
    <HomeContainer>
      <HomeStyled>
        <HomeContent>
          <Form onSubmit={handleSubmitForm}>
            <FormRow name="BAGI" k>
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
                <Button
                  type="button"
                  onClick={handleOnChangeUser}
                  variant="rectangle"
                  color="green"
                >
                  ADD
                </Button>
              </InputWithButton>
            </FormRow>
            <ExistNameRow />
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
                setExistingLocalState={setExistingLocalState}
              />
            ))}
          </HomeContent>
        </HomeStyled>
      )}
    </HomeContainer>
  );
};

export default Home;
