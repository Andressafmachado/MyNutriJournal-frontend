import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { login } from "../../store/user/actions";
import "./index.css";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  function submitForm(event) {
    event.preventDefault();
    dispatch(login(email, password, history));
    setEmail("");
    setPassword("");
  }

  return (
    <div className="login">
      <Form as={Col} md={{ span: 6, offset: 5 }} className="mt-5">
        <h3>Login</h3>
        <br />
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
            variant="light"
            type="submit"
            id="buttonLoginPage"
            onClick={submitForm}
          >
            Login
          </Button>
        </Form.Group>
        <br />

        <h6>
          Don't you have an account yet?
          <Link to="/signup" id="linkLoginPage">
            {" "}
            sign up here
          </Link>{" "}
        </h6>
        <br />
      </Form>
    </div>
  );
}
