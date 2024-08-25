import styled from "styled-components";

const ResultContainer = styled.div`
  position: relative;
  background-color: var(--color-grey-200);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin: 3rem 1rem;
  padding: 1rem 2rem;
  min-height: 50vh;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1rem;
    background-image: radial-gradient(
      circle at 50% 100%,
      transparent 1rem,
      var(--color-grey-200) 0.8rem
    );
    background-size: 1.72rem 1rem;
    background-repeat: repeat-x;
  }

  &:before {
    top: -1rem;
    transform: rotate(180deg);
  }
  &:after {
    bottom: -1rem;
  }
`;

const StyledTable = styled.table`
  max-width: 200rem;
  width: 27.5rem;
  margin-top: 3rem;
  th,
  td {
    padding: 0.5rem;
    font-size: 1.25rem;
  }
  thead {
    background-color: var(--color-brand-200);
    color: var(--color-grey-200);
  }
  tbody {
    padding: 1rem;
    border-top: 10px solid black;
  }
  tfoot {
    padding-bottom: 1rem;
    td {
      border: none;

      padding-top: 10rem;
    }
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1.25rem;
    font-weight: bolder;
    color: var(--color-grey-600);
  }
`;

const StyledTDRight = styled.td`
  text-align: right;
`;
const StyledSpanForShared = styled.span`
  font-size: 0.7rem;
  word-wrap: wrap;
`;

const Result = () => {
  return (
    <ResultContainer>
      <StyledHeader>
        <h1>Split Bill</h1>
        <p>Pembagian Untuk : Bagi</p>
        <p>2024 08 23</p>
      </StyledHeader>

      <StyledTable>
        <thead>
          <tr>
            <th>Name/Item</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6">Erik</td>
          </tr>
          <tr>
            <td>
              Item1{" "}
              <StyledSpanForShared>(Shared With 3 People)</StyledSpanForShared>{" "}
            </td>
            <StyledTDRight>Rp100.000</StyledTDRight>
          </tr>
          <tr>
            <td>Item2</td>
            <StyledTDRight>Rp100.000</StyledTDRight>
          </tr>
          <tr>
            <StyledTDRight>Sub Total</StyledTDRight>
            <StyledTDRight>Rp150.000</StyledTDRight>
          </tr>

          <tr>
            <td colSpan="2"></td>
          </tr>

          <tr>
            <td colSpan="6">Putri</td>
          </tr>
          <tr>
            <td>
              Item1
              <StyledSpanForShared>
                (Shared With 3 People)
              </StyledSpanForShared>{" "}
            </td>
            <StyledTDRight>Rp100.000</StyledTDRight>
          </tr>
          <tr>
            <td>Item2</td>
            <StyledTDRight>Rp100.000</StyledTDRight>
          </tr>
          <tr>
            <StyledTDRight>Sub Total</StyledTDRight>
            <StyledTDRight>Rp150.000</StyledTDRight>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <StyledTDRight>TOTAL</StyledTDRight>
            <StyledTDRight>Rp430.000</StyledTDRight>
          </tr>
        </tfoot>
      </StyledTable>
    </ResultContainer>
  );
};

export default Result;
