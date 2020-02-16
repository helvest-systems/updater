import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 597px;
  height: 212px;
  padding-top: 33px;
  padding-left: 27px;
  display: flex;
  background: #1e1e24;
  color: white;
  box-sizing: border-box;
`;

const Logo = styled.div`
  box-sizing: border-box;
  width: 108px;
  height: 137px;
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed white;
`;

const Wrapper = styled.div`
  margin-top: 24px;
  max-width: 375px;
`;

const Header = styled.div`
  margin-bottom: 9px;
  font-family: Raleway;
  font-weight: 700;
  font-size: 30px;
`;

export const Layout: React.FC<{}> = ({ children }) => (
  <Container>
    <Logo>Logo</Logo>
    <Wrapper>
      <Header>Helvest Updates Manager</Header>
      {children}
    </Wrapper>
  </Container>
);
