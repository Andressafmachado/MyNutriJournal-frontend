import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div class="d-flex justify-content-end">
      {/* // <!-- Background image --> */}
      <div class="align-self-stretch">
        {/* // <!-- Background image --> */}
        <div>
          <img
            src="https://res.cloudinary.com/andmachado/image/upload/v1618391308/02c40f2c30dc41629a5c265394af6285_1_cv6aro.png"
            width="80%"
          />
          <h1>Welcome to my nutri journal</h1>
          <p> our purpose is to make it easy for you</p>
          <br />
          <div>
            User
            <br />
            <Link to={"./login"}>login</Link>
            <br />
            <Link to={"./signup"}>signup</Link>
            <br />
            <br />
          </div>
          <div>
            Nutritionist
            <br />
            <Link to={"./loginDoctor"}>login</Link>
            <br />
            <Link to={"./signupDoctor"}>signup</Link>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
