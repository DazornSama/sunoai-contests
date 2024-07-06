import styled from "@emotion/styled";

export const ContestList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;

  @media screen and (max-width: 1390px) {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
`;
