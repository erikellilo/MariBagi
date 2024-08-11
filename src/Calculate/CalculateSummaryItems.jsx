import styled from "styled-components";

const CalculateSummaryItemStyled = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  border: 0.25rem solid var(--color-grey-900);
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-grey-100);

  div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ul {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.125rem;
    }
  }
`;

const CalculateSummaryItems = ({ shared }) => {
  return (
    <CalculateSummaryItemStyled>
      <h3>Konser</h3>
      <div>
        <p>1.000.000</p>
        {shared ? (
          <p>Shared</p>
        ) : (
          <ul>
            <li>Erik,</li>
            <li>Denis</li>
            <li> & 2 Others..</li>
          </ul>
        )}
      </div>
    </CalculateSummaryItemStyled>
  );
};

export default CalculateSummaryItems;
