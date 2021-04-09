import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { signUp } from "../../store/user/actions";
import { selectToken, selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [exerciseDaily, setExerciseDaily] = useState("");

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const history = useHistory();
  const user = useSelector(selectUser);

  function submitForm(event) {
    event.preventDefault();

    dispatch(
      signUp(
        name,
        email,
        password,
        age,
        height,
        weight,
        gender,
        exerciseDaily,
        history
      )
    );

    setEmail("");
    setPassword("");
    setName("");
    setAge("");
    setHeight("");
    setWeight("");
    setGender("");
    setExerciseDaily("");
  }

  return (
    <Container>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
        {user.isNutritionist ? (
          <div>
            <h1> Add a new patient</h1>
            <h5>Insert the data, we do the math for you!</h5>
          </div>
        ) : (
          <div>
            <h1 className="mt-5 mb-5">Signup and create a Plan!</h1>
            <h5>Add your personal information, we do the math for you!</h5>
          </div>
        )}

        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
          {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicAge">
          <Form.Label>Age</Form.Label>
          <Form.Control
            value={age}
            onChange={(event) => setAge(event.target.value)}
            type="integer"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Height</Form.Label>
          <Form.Control
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Gender</Form.Label>
          {/* <select>
         <options>m</options>
         <options>f</options>
           
         </select> */}
          <Form.Control
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Exercise Daily?</Form.Label>
          <Form.Control
            value={exerciseDaily}
            onChange={(event) => setExerciseDaily(event.target.value)}
            type="text"
          />
        </Form.Group>

        <Form.Group className="mt-5">
          <Button variant="primary" type="submit" onClick={submitForm}>
            Create My Plan
          </Button>
        </Form.Group>
        <p>
          Already have an account? <Link to="/">Click here to log in</Link>
        </p>
      </Form>
    </Container>
  );
}
