import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Inertia } from '@inertiajs/inertia'
import { InertiaLink } from '@inertiajs/inertia-react'
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import ListIcon from "@material-ui/icons/List";
import AddBoxIcon from "@material-ui/icons/AddBox";
import PersonIcon from "@material-ui/icons/Person";
import AddPage from '../Pages/Lists/Add'

const useStyles = makeStyles({
  bottomNavigation: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 99
  }
});


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

const NavBar2 = () => {
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
          <InertiaLink href="/profile/lists">
            <i className="fas fa-user"></i>
          </InertiaLink>
        </NavBarItem>
      </NavBarContainer>
      <AddPage isOpen={isCreateListModalOpen} closeCallback={toggleCreateListModalOpen} />
    </Fragment>
  )
}

const NavBar = () => {
  const classes = useStyles();
  const [selectedAction, setSelectedAction] = React.useState(0);

  return (
    <BottomNavigation
      value={selectedAction}
      onChange={(_, action) => {
        console.log(action);

        switch (action) {
          case 0:
            Inertia.get("/")
            break;
          case 1:
            Inertia.get("/")
            break;
          case 2:
            Inertia.get("/profile/lists")
            break;
          default:
            Inertia.get("/")
            break;
        }
        setSelectedAction(action);
      }}
      showLabels
      className={classes.bottomNavigation}
    >
      <BottomNavigationAction label="Lists" icon={<ListIcon />} />
      <BottomNavigationAction label="Add" icon={<AddBoxIcon />} />
      <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
    </BottomNavigation>
  );
};
export default NavBar
