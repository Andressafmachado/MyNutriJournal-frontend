import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/user/selectors";
import NavbarItem from "./NavbarItem";
import LoggedIn from "./LoggedIn";
// import LoggedOut from "./LoggedOut";
import { selectUser } from "../../store/user/selectors";

export default function Navigation() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const loginLogoutControls = token ? <LoggedIn /> : null;

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand
      // as={NavLink} to="/"
      >
        My Nutri Journal
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav style={{ width: "100%" }} fill>
          {!user.age ? (
            <NavbarItem path="/mypatients" linkText="Home" />
          ) : (
            <NavbarItem path="/dailyprogress" linkText="Home" />
          )}

          {!user.age ? null : (
            <NavbarItem path={`./plan/${user.id}`} linkText="My Plan" />
          )}

          {loginLogoutControls}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
