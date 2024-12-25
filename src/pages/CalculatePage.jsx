import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { inserNewItem } from "../features/itemsSlice";
import { addError, clearError } from "../features/errorSlice";

import { calculateSelector } from "../selector/selectorState";

import CalculateSummary from "../calculate/CalculateSummary";

import FormRow from "../ui/FormRow";
import Form from "../ui/Form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Counter from "../ui/Counter";
import ToggleContainer from "../ui/ToggleContainer";

const CalculateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem;
  gap: 3rem;
`;

const CalculateStyled = styled.div`
  width: 35rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  padding: 1rem 2rem;
  flex-wrap: wrap;

  border: 0.25rem solid black;
  position: relative;
  background-color: var(--color-red-100);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  border: 0.25rem solid black;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;
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
  background-color: var(--color-green-500);
  padding: 0.3rem 0.5rem 0rem 0.5rem;
  border: 0.2rem solid var(--color-grey-900);
  display: flex;
  align-items: center;
  justify-content: center;

  border: 0.25rem solid black;
  border-style: solid;
  border-width: 0.25rem 0.5rem 0.5rem 0.25rem;
  border-radius: 1rem;

  transition: border-width 0.1s ease;
  h2 {
    font-size: 2.5rem;
    color: var(--color-grey-900);
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
  margin-top: 1rem;

  & p {
    font-size: 1.25rem;
    font-weight: bolder;
    color: var(--color-grey-900);
    display: block;
    max-width: 11rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const ExpanseContent = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
`;

const InitialStateCalculate = {
  calculateName: "",
  calculatePrice: 0,
  calculateAmount: 0,
  isSharedPartial: false,
  userCalculate: [],
};

const minusValidation = (value) => (value < 0 ? true : false);
const currencyFormatWithoutCurrencyCode = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    currency: "IDR",
  }).format(number);
};

const CalculatePage = () => {
  const { bagiId, namaBagi, userObject, calculateName } = useSelector(calculateSelector);
  const [objectCalculate, setObjectCalculate] = useState(InitialStateCalculate);
  const [displayShare, setDisplayShare] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!bagiId) navigate("/");
  }, [bagiId, navigate]);

  const handleChangeCalculate = (e) => {
    e.preventDefault();
    setObjectCalculate((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleChangeCalculatePrice = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue.replace(/^0+/, "");
    setObjectCalculate((prev) => {
      return { ...prev, [e.target.id]: formattedValue };
    });
  };

  const handleMatchUserCount = (e) => {
    e.preventDefault();
    setObjectCalculate((prev) => {
      return { ...prev, calculateAmount: userObject.length };
    });
  };

  const handleOnIncrement = (e, increment) => {
    e.preventDefault();
    if (objectCalculate.calculateAmount <= 0 && !increment) return;
    setObjectCalculate((prev) => {
      return {
        ...prev,
        calculateAmount: increment ? prev.calculateAmount + 1 : prev.calculateAmount - 1,
      };
    });
  };

  const handleCheckedPartialShared = (e, userInput) => {
    const isExist = objectCalculate.userCalculate.find((user) => user.userId === userInput);

    setObjectCalculate((prev) => ({
      ...prev,
      userCalculate: isExist ? prev.userCalculate.filter((user) => user.userId !== userInput) : [...prev.userCalculate, { userId: userInput }],
    }));
  };

  const handleOnSubmitNewItem = (e) => {
    e.preventDefault();

    const isExistListItem = calculateName.findIndex((item) => item === objectCalculate.calculateName && item !== bagiId);

    if (!objectCalculate.calculateName) {
      console.log("masuk");
      dispatch(clearError());
      dispatch(addError({ form: "Expanse For", message: "Cannot Insert Empty Name" }));
      return;
    }

    if (isExistListItem >= 0) {
      console.log("masuk2");

      dispatch(clearError());
      dispatch(
        addError({
          form: "Expanse For",
          message: "Cannot Insert Same Name Of item",
        })
      );
      return;
    }

    if (objectCalculate.calculateAmount <= 0) {
      console.log("masuk3");

      dispatch(
        addError({
          form: "Jumlah",
          message: "Jumlah Cannot Be 0",
        })
      );

      return;
    }

    dispatch(inserNewItem(objectCalculate, bagiId));
    dispatch(clearError());
    setObjectCalculate(InitialStateCalculate);
  };

  const handleSharedWithAll = (e) => {
    e.preventDefault();
    !displayShare && setDisplayShare(true);
    setObjectCalculate((prev) => ({
      ...prev,
      userCalculate: prev.userCalculate?.length > 0 ? [] : userObject.map((user) => ({ userId: user.userId })),
    }));
  };

  return (
    <CalculateContainer>
      <CalculateStyled>
        <CalculateContent>
          <h1>Calculate - {namaBagi}</h1>
          <Form onSubmit={handleOnSubmitNewItem} form="calculateForm">
            <FormRow name="Expanse For">
              <Input id="calculateName" name="expanse" placeholder="Bayarin Apa nih" value={objectCalculate.calculateName} handleOnchange={handleChangeCalculate} type="text" />
            </FormRow>
            <FormRow name="Price Per Item">
              <ExapanseContentAndAmount>
                <ExpanseContent>
                  <ExpanseCurrency>
                    <h2>Rp</h2>
                  </ExpanseCurrency>
                  <Input id="calculatePrice" name="amount" placeholder="Berapa nih?" type="text" value={currencyFormatWithoutCurrencyCode(objectCalculate.calculatePrice)} handleOnchange={handleChangeCalculatePrice} />
                </ExpanseContent>
              </ExapanseContentAndAmount>
            </FormRow>

            <FormRow name="Amount Item" hiddenName={false}>
              <ExpanseAmount>
                <Button onClick={handleMatchUserCount} type="button">
                  Match User
                </Button>
                <Counter handleOnIncrement={handleOnIncrement}>{objectCalculate.calculateAmount}</Counter>
              </ExpanseAmount>
            </FormRow>

            <FormRow name="Shared Option" hiddenName={true}>
              <ExpanseAmount>
                <Button type="button" onClick={() => setDisplayShare((prev) => !prev)}>
                  Shared With..
                </Button>
                <Button type="button" onClick={handleSharedWithAll}>
                  Shared Allno
                </Button>
              </ExpanseAmount>
            </FormRow>

            {displayShare && (
              <>
                {userObject.map((user) => {
                  const userExist = objectCalculate?.userCalculate?.find((userInput) => userInput.userId === user.userId);

                  return (
                    <FormRow name="" key={user.userId}>
                      <ExpanseAmount>
                        <p>{user.userName}</p>

                        <ToggleContainer name={user.name} handleOnchange={(e) => handleCheckedPartialShared(e, user.userId)} value={userExist} />
                      </ExpanseAmount>
                    </FormRow>
                  );
                })}
              </>
            )}
            <Button type="submit" color="green">
              Add New Items
            </Button>
          </Form>
        </CalculateContent>
      </CalculateStyled>
      <CalculateSummary />
    </CalculateContainer>
  );
};

export default CalculatePage;
