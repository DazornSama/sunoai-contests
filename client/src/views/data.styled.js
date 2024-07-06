import styled from "@emotion/styled";

export const LoginContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const MenuContainer = styled.div`
  display: grid;
  margin-top: 3rem;
  max-width: 100%;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
`;
