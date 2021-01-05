import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { InertiaLink } from '@inertiajs/inertia-react'
import AddPage from '../Pages/Lists/Add'

const NavBarContainer = styled.header`
  position: fixed;
  z-index: 12;
  background-color: white;
  height: 45px;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #000;
  display: flex;
  align-items: center;
`

const NavBarItem = styled.div`
  color: #fff;
  flex: 1;
  text-align: center;
  font-size: 2rem;
  & > a {
    padding: 0.5rem;
    color: white;
  }
`

const NavBar = () => {
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false)

  function toggleCreateListModalOpen(e) {
    setIsCreateListModalOpen(!isCreateListModalOpen)
  }

  return (
    <Fragment>
      <NavBarContainer>
        <NavBarItem>
          <InertiaLink href="/">
            <i className="fas fa-list"></i>
          </InertiaLink>
        </NavBarItem>
        <NavBarItem>
          <InertiaLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsCreateListModalOpen(true)
            }}
          >
            <i className="fas fa-plus-square"></i>
          </InertiaLink>
        </NavBarItem>
        <NavBarItem>
          <InertiaLink href="/profie">
            <i className="fas fa-user"></i>
          </InertiaLink>
        </NavBarItem>
      </NavBarContainer>
      <AddPage isOpen={isCreateListModalOpen} closeCallback={toggleCreateListModalOpen} />
    </Fragment>
  )
}

export default NavBar
