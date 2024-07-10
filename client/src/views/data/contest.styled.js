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

export const CreateEditModalDescriptionWrapper = styled.div`
  display: flex;
  height: 420px;
  max-height: 420px;
  overflow: hidden;

  @media screen and (max-width: 1390px) {
    flex-direction: column;

    .markdown-container {
      margin-left: 0 !important;
      margin-top: 0.75rem;
    }
  }
`;

export const EditSongsModalWrapper = styled.div`
  display: flex;
  margin-top: 3rem;

  @media screen and (max-width: 1390px) {
    flex-direction: column;

    .songs-container {
      margin-left: 0 !important;
      margin-top: 1.25rem;
    }
  }
`;
