import styled from "@emotion/styled";

export const ContestDescription = styled.div`
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 0.375rem;
  max-height: 300px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const SongList = styled.div`
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  gap: 1.25rem;

  @media screen and (max-width: 1390px) {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(1, minmax(0px, 1fr));
  }
`;

export const Song = styled.div`
  position: relative;
  display: flex;
  padding: 0.575rem;
  background-color: rgb(39, 38, 38);
  background: linear-gradient(
      0deg,
      rgba(251, 211, 141, 0) 0%,
      rgba(251, 211, 141, 0.2) 200%
    ),
    rgb(39, 38, 38);
  border: 1px solid #424242;
  border-radius: 0.375rem;
  box-shadow: linear-gradient(
      0deg,
      rgba(251, 211, 141, 0) 0%,
      rgba(251, 211, 141, 0.2) 200%
    ),
    rgb(39, 38, 38);

  &:hover,
  &:active {
    cursor: pointer;
    background: linear-gradient(
      135deg,
      rgba(251, 211, 141, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 200%
    );
  }
`;

export const SongCover = styled.div`
  margin-right: 1rem;
  width: 140px;
  height: 140px;

  img {
    width: 140px;
    height: 140px;
    background-color: rgb(39, 38, 38);
    border-radius: 0.375rem;
  }
`;

export const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SongTitle = styled.div`
  margin-bottom: 0.125rem;
  font-weight: 700;
  outline: 2px solid transparent;
  outline-offset: 2px;
`;

export const SongAuthor = styled.div`
  margin-bottom: 0.125rem;
  font-weight: 500;
`;

export const SongPrompt = styled.div`
  max-width: 95%;
  color: rgba(255, 255, 255, 0.5);
`;

export const SongCountry = styled.div`
  position: absolute;
  right: 0.575rem;
  bottom: 0.575rem;
`;
