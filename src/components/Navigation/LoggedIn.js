import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/user/actions";
import Button from "react-bootstrap/Button";
import { selectUser } from "../../store/user/selectors";
import Nav from "react-bootstrap/Nav";
// import "./fontfamilies.css";
export default function LoggedIn() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  return (
    <>
      <Nav.Item
        style={{
          padding: ".5rem 1rem",
          backgroundColor: "#8cbaa3",
          fontFamily: "New Tegomin",
        }}
      >
        {user.isDoctor
          ? `${user.name} Nutritionist`
          : ` ${user.name}'s Journal`}
      </Nav.Item>
      <Button
        style={{
          backgroundColor: "#8cbaa3",
          color: "black",
          border: "#8cbaa3",
        }}
        onClick={() => dispatch(logOut())}
      >
        Logout
      </Button>
    </>
  );
}
