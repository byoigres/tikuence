import React from 'react'
import styled from 'styled-components'
import StyledReactModal from 'styled-react-modal'

var __gutter = '14px'
var __modal_color = '#fff'
var __soft_color = '#fafafa'

export const Modal = StyledReactModal.styled`
  position: relative;
  width: 20rem;
  background-color: white;
  opacity: ${(props) => props.opacity};
  transition: opacity ease 500ms;
`

const ModalHeaderContainer = styled.div`
  height: 3rem;
  background-color: ${__modal_color};
  border-bottom: solid 1px #cccccc;
  display: grid;
  padding-left: ${__gutter};
  align-items: center;
  grid-template-columns: auto 60px;
  h4 {
    margin: 0;
    text-align: left;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: 20px;
    opacity: 0.8;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
`

export const ModalHeader = ({ title, closeCallback = () => {} }) => (
  <ModalHeaderContainer>
    <h4>{title}</h4>
    <span className="fas fa-times" onClick={closeCallback}></span>
  </ModalHeaderContainer>
)
export const ModalContent = styled.div`
  flex: 1;
  text-align: left;
  overflow: auto;
  padding: ${__gutter};
`

export const ModalActions = styled.div`
  height: auto;
  text-align: right;
  border-top: solid 1px #cccccc;
  padding: ${__gutter};
  background-color: #ffffff;
  background-color: ${__soft_color};
  button,
  input {
    margin: 0;
    &:not(:last-child) {
      margin-right: ${__gutter};
    }
  }
`
