import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="flex-container">
        <div className="item1">
          <p>
            Welcome to <br />
            My Nutri Journal
          </p>
        </div>
        <div className="item2">
          <p>Our mission is to make your live easier, </p>
          <p>we know that keeping yourself health is not easy,</p>
          <p>let us help you, tracking your food and activities!</p>
          <p>You can do it by yourself or with your Nutritionist!</p>
          <Link style={{ color: "black" }} to={"./login"}>
            login
          </Link>{" "}
          /
          <Link style={{ color: "black" }} to={"./signup"}>
            signup
          </Link>
          <br /> <br />
          <p>
            Nutritionists are welcome as well
            <br />
            <Link style={{ color: "black" }} to={"./loginDoctor"}>
              login
            </Link>
            /
            <Link style={{ color: "black" }} to={"./signupDoctor"}>
              signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
