import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40px;
  height: 15px;
`;

export const Wrapper = styled.div`
  aspect-ratio: 4 / 3;
  overflow: hidden;
  width: 20px;
  height: 15px;
`;

export const CoverImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
