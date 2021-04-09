import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { login } from "../../store/user/actions";
import { selectToken } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import { selectUser } from "../../store/user/selectors";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    if (user.isNutritionist === true) {
      history.push("/mypatients");
    } else if (user.isNutritionist === false) {
      history.push("/dailyProgress");
    }
  }, [token, history]);

  // useEffect(() => {
  //   if (token !== null) {
  //     history.push("/mypatients");
  //   }
  // }, [token, history]);

  function submitForm(event) {
    console.log("hi");
    event.preventDefault();

    dispatch(login(email, password));

    setEmail("");
    setPassword("");
  }

  return (
    <Container>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
        <h1 className="mt-5 mb-5">Welcome to My Nutri Journal</h1>
        <h3>
          This app is going yo help you track your diet and tasks to get a
          healthier life and active your goals!
        </h3>
        <br />
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
          <p style={{ fontSize: 8 }}>
            * use the password that your nutritionist created for you.
          </p>
          <Form.Control
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group className="mt-5">
          <Button variant="primary" type="submit" onClick={submitForm}>
            Log in
          </Button>
        </Form.Group>
        <br />

        <h5>Don't you have a nutritionist?</h5>
        <h3>
          You can also do it by yourself:
          <Link to="/signup" style={{ textAlign: "center" }}>
            {" "}
            sign up here
          </Link>{" "}
        </h3>
        <br />
        <h3>
          Are you a nutritionist?
          <Link to="/signup" style={{ textAlign: "center" }}>
            {" "}
            sign up here
          </Link>{" "}
        </h3>
      </Form>
    </Container>
  );
}
