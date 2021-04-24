import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/user/selectors";
import NavbarItem from "./NavbarItem";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import { selectUser } from "../../store/user/selectors";

export default function Navigation() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  const loginLogoutControls = token ? <LoggedIn /> : <LoggedOut />;

  return (
    <Navbar
      style={{ backgroundColor: "#8cbaa3", fontFamily: "New Tegomin" }}
      expand="lg"
    >
      <Navbar.Brand
        style={{ fontFamily: "New Tegomin", fontSize: "33px" }}
        // as={NavLink} to="/"
      >
        My Nutri Journal
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav style={{ width: "100%" }} fill>
          {!user.isDoctor ? (
            <NavbarItem path="/dailyprogress" linkText="Home" />
          ) : (
            <NavbarItem path="/mypatients" linkText="Home" />
          )}

          {!user.isDoctor && token ? (
            <NavbarItem path={`./plan/${user.id}`} linkText="My Plan" />
          ) : null}

          {loginLogoutControls}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
