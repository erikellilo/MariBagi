import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { inserNewItem } from "../features/itemsSlice";
import { addError, clearError } from "../features/errorSlice";

import { calculateSelector } from "../selector/selectorState";

import CalculateUserList from "../calculate/CalculateUserRow";
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
  width: 32rem;
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
    font-size: 1.75rem;
    font-weight: bolder;
    color: var(--color-grey-900);
    display: block;
    max-width: 15rem;
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
  isShared: true,
  userCalculate: [],
};

const minusValidation = (value) => (value < 0 ? true : false);

const CalculatePage = () => {
  const { bagiId, namaBagi, userObject, calculateName } =
    useSelector(calculateSelector);
  const [objectCalculate, setObjectCalculate] = useState(InitialStateCalculate);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!bagiId) navigate("/");
  }, [bagiId, navigate]);

  const handleChangeCalculate = (e) => {
    e.preventDefault();
    if (e.target.type === "number" && minusValidation(e.target.value)) return;
    setObjectCalculate((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleCheckBox = () =>
    setObjectCalculate((prev) => {
      return { ...prev, isShared: !prev.isShared };
    });

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
        calculateAmount: increment
          ? prev.calculateAmount + 1
          : prev.calculateAmount - 1,
      };
    });
  };

  const handleIncrementPerUsers = (e, increment, userInput = null) => {
    e.preventDefault();
    if (e.target.value < 0) return;
    const isExistingUser = objectCalculate?.userCalculate.find(
      (userExist) => userExist.userId === userInput
    );
    if (isExistingUser && isExistingUser?.amount <= 0 && !increment) return;

    setObjectCalculate((prev) => {
      let newUser = [...prev.userCalculate];

      if (!isExistingUser) {
        newUser.push({ userId: userInput, amount: increment ? 1 : 0 });
      } else {
        const oldData = newUser.findIndex((user) => user.userId === userInput);

        newUser[oldData] = {
          ...isExistingUser,
          amount: increment
            ? isExistingUser?.amount + 1
            : isExistingUser?.amount - 1,
        };
      }
      return {
        ...prev,
        userCalculate: newUser,
      };
    });
  };

  const handleOnSubmitNewItem = (e) => {
    e.preventDefault();

    const isExistListItem = calculateName.findIndex(
      (item) => item === objectCalculate.calculateName && item !== bagiId
    );

    const amountIntUser = objectCalculate.userCalculate?.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
    if (!objectCalculate.calculateName) {
      dispatch(clearError());
      dispatch(
        addError({ form: "Expanse For", message: "Cannot Insert Empty Name" })
      );
      return;
    }

    if (isExistListItem >= 0) {
      dispatch(clearError());
      dispatch(
        addError({
          form: "Expanse For",
          message: "Cannot Insert Same Name Of item",
        })
      );
      return;
    }

    if (
      !objectCalculate.isShared &&
      amountIntUser !== objectCalculate.calculateAmount
    ) {
      dispatch(
        addError({
          form: "Amount Item",
          message: "Amount In User Item Cannot More Than Amount Item",
        })
      );

      return;
    }

    if (objectCalculate.calculateAmount <= 0) {
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

  return (
    <CalculateContainer>
      <CalculateStyled>
        <CalculateContent>
          <h1>Calculate - {namaBagi}</h1>
          <Form onSubmit={handleOnSubmitNewItem} form="calculateForm">
            <FormRow name="Expanse For">
              <Input
                id="calculateName"
                name="expanse"
                placeholder="Bayarin Apa nih"
                value={objectCalculate.calculateName}
                handleOnchange={handleChangeCalculate}
              />
            </FormRow>
            <FormRow name="Amount Item">
              <ExapanseContentAndAmount>
                <ExpanseContent>
                  <ExpanseCurrency>
                    <h2>Rp</h2>
                  </ExpanseCurrency>
                  <Input
                    id="calculatePrice"
                    name="amount"
                    placeholder="Berapa nih?"
                    type="number"
                    value={objectCalculate.calculatePrice}
                    handleOnchange={handleChangeCalculate}
                  />
                </ExpanseContent>
              </ExapanseContentAndAmount>
            </FormRow>

            <FormRow name="Jumlah">
              <ExpanseAmount>
                <p>Jumlah</p>
                <Button onClick={handleMatchUserCount} type="button">
                  Match User
                </Button>
                <Counter handleOnIncrement={handleOnIncrement}>
                  {objectCalculate.calculateAmount}
                </Counter>
              </ExpanseAmount>
            </FormRow>

            <FormRow name="Shared" flexdirection="row">
              <ToggleContainer
                name="sharedToggle"
                id="isShared"
                handleOnchange={handleCheckBox}
                value={objectCalculate?.isShared}
              />
            </FormRow>

            {!objectCalculate.isShared && (
              <>
                {userObject.map((user) => {
                  const data = objectCalculate?.userCalculate.find(
                    (userInput) => userInput.userId === user.userId
                  );

                  return (
                    <FormRow name="" key={user.userId}>
                      <ExpanseAmount>
                        <p>{user.userName}</p>
                        <Counter
                          handleOnIncrement={handleIncrementPerUsers}
                          user={user}
                        >
                          {data?.amount || 0}
                        </Counter>
                      </ExpanseAmount>
                    </FormRow>
                  );
                })}
              </>
            )}
            <Button type="submit">Add New Items</Button>
          </Form>
        </CalculateContent>
      </CalculateStyled>
      <CalculateSummary />
    </CalculateContainer>
  );
};

export default CalculatePage;
