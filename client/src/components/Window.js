import React from "react";
import styled from "styled-components"

const Container = styled.div`
  margin-top: 1.2rem;
`;

const Header = styled.header`
  overflow: auto;
  text-align: center;
  border-bottom: 1px solid grey;
`;

const Title = styled.h4`
  margin: 0.5rem 0;
`;

const Content = styled.div`
  margin: 1.5rem;
`;

const Window = ({ children, title }) => (
  <Container>
    <Header>
      <Title>{title}</Title>
    </Header>
    <Content>{children}</Content>
  </Container>
);

export default Window;
