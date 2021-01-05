import React from 'react'
import styled from 'styled-components'
import { ModalProvider } from 'styled-react-modal'
import NavBar from './NavBar'

const Container = styled.section`
  max-width: 32rem;
  height: 100vh;
  width: 100vw;

  overflow-y: scroll;

  scroll-snap-type: mandatory;
  scroll-snap-points-y: repeat(3rem);
  scroll-snap-type: y mandatory;
  position: relative;
  /* left: 510px;
  top: 50px; */
  z-index: 1;
  /* border-radius: 15px;
  border: none; */
`

const InnerContainer = styled.div`
  /* margin: ${(p) => (p.isFull ? 0 : 24)}px; */
  margin: 0;
`

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: calc(100% - 38px);
  z-index: 9;
  border: 19px solid black;
  pointer-events: none;
`

const Layout = ({ children, isFull = false }) => (
  <Container>
    <ModalProvider>
      <Backdrop />
      <InnerContainer isFull={isFull}>{children}</InnerContainer>
      <NavBar>Hola</NavBar>
    </ModalProvider>
  </Container>
)

export default Layout
