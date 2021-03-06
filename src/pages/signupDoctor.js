import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { signUpDoctor } from "../store/user/actions";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import "./Login/index.css";

export default function SignupDoctor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  function submitForm(event) {
    event.preventDefault();

    dispatch(signUpDoctor(name, email, password, history, image));

    setEmail("");
    setPassword("");
    setName("");
  }

  const uploadImage = async (e) => {
    console.log("triggered");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "anqmz7kn"); //get the name at website> config> upload> (add new, mode : unsigned);
    setLoading(true);

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/andmachado/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const file = await res.json();
    setImage(file.url);
  };

  return (
    // <Container>
    <div className="login">
      <Form as={Col} md={{ span: 6, offset: 5 }} className="mt-5">
        <div>
          <h1 className="mt-5 mb-5" style={{ fontFamily: "Limelight" }}>
            Welcome Nutri
          </h1>
          <p>
            This app is going to help you track your patients and their
            activities. <br />
            Your patients can sign up, choose you as Nutritionist
            <br />
            and you will be connected!
          </p>

          <h1> Sign up</h1>
        </div>

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

        <h6>Upload your profile picture</h6>
        <input
          type="file"
          name="file"
          placeholder="drag it here"
          onChange={uploadImage}
        />
        <img src={image} width="50%" />

        <Form.Group className="mt-5">
          <Button
            style={{ backgroundColor: "#8cbaa3", color: "white" }}
            variant="light"
            type="submit"
            onClick={submitForm}
          >
            Sign up
          </Button>
        </Form.Group>
        <p>
          Already have an account?{" "}
          <Link to="/logindoctor" style={{ color: "black" }}>
            Click here to login
          </Link>
        </p>
      </Form>
    </div>
  );
}
