import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { loginDoctor } from "../store/user/actions";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import "./Login/index.css";

export default function LoginDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  function submitForm(event) {
    console.log("hi");
    event.preventDefault();

    dispatch(loginDoctor(email, password, history));

    setEmail("");
    setPassword("");
  }

  return (
    // <Container className="login">
    <div className="login">
      <Form as={Col} md={{ span: 6, offset: 5 }} className="mt-5">
        <h1 className="mt-5 mb-5" style={{ fontFamily: "Limelight" }}>
          Welcome Doctor
        </h1>
        <h5>Login</h5>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group className="mt-5">
          <Button
            style={{ backgroundColor: "#8cbaa3", border: "black" }}
            type="submit"
            onClick={submitForm}
          >
            Log in
          </Button>
        </Form.Group>
        <h6>
          Don't have an account yet?
          <Link style={{ color: "black" }} to="/signupdoctor">
            {" "}
            sign up here
          </Link>{" "}
        </h6>
      </Form>
      {/* </Container> */}
    </div>
  );
}
