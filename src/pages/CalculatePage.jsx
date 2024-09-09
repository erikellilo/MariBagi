import styled from "styled-components";
import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import CalculateUserList from "../calculate/CalculateUserRow";
import Button from "../ui/Button";
import CalculateSummary from "../calculate/CalculateSummary";
import { useSelector, useDispatch } from "react-redux";
import Input from "../ui/Input";
import { useEffect, useState } from "react";
import ToggleContainer from "../ui/ToggleContainer";
import Counter from "../ui/Counter";
import { inserNewItem } from "../features/usersSlicer";
import { useNavigate, useParams } from "react-router-dom";

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

const InitialStateCalculate = {
  calculateName: "",
  calculatePrice: 0,
  calculateAmount: 0,
  isShared: true,
  userCalculate: [],
};

const minusValidation = (value) => (value < 0 ? true : false);

const CalculatePage = () => {
  const { namaBagi, listUsers, bagiId } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [objectCalculate, setObjectCalculate] = useState(InitialStateCalculate);
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
      return { ...prev, calculateAmount: listUsers.length };
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

  const handleDetailRedirect = (e) => {
    e.preventDefault();
    navigate(`/result/${bagiId}`);
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
    dispatch(inserNewItem(objectCalculate, bagiId));
    setObjectCalculate(InitialStateCalculate);
  };

  return (
    <CalculateContainer>
      <CalculateStyled>
        <CalculateContent>
          <h1>Calculate - {namaBagi}</h1>
          <Form onSubmit={handleOnSubmitNewItem} form="calculateForm">
            <FormRow name="Pengeluaran Untuk">
              <Input
                id="calculateName"
                name="expanse"
                placeholder="Bayarin Apa nih"
                value={objectCalculate.calculateName}
                handleOnchange={handleChangeCalculate}
              />
            </FormRow>
            <FormRow name="Biaya">
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

            <FormRow name="">
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
                {listUsers.map((user) => {
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
            <CalculateUserList />
            <Button type="submit">Add New Items</Button>
          </Form>
        </CalculateContent>
      </CalculateStyled>
      <CalculateSummary>
        <Button onClick={handleDetailRedirect}>Details..</Button>
      </CalculateSummary>
    </CalculateContainer>
  );
};

export default CalculatePage;
