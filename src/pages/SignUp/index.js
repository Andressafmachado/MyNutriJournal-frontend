import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signUp } from "../../store/user/actions";
import { selectUser } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import { selectAllDoctors } from "../../store/allDoctors/selectors";
import { fetchAllDoctors } from "../../store/allDoctors/actions";
import "./index.css";

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
  const history = useHistory();
  const user = useSelector(selectUser);
  const userId = user.id;
  const allDoctors = useSelector(selectAllDoctors);
  const [doctorId, setDoctorId] = useState();

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  function submitForm(event) {
    event.preventDefault();
    dispatch(
      signUp({
        name,
        email,
        password,
        age,
        height,
        weight,
        gender,
        exerciseDaily,
        history,
        doctorId,
        image,
      })
    );
    setEmail("");
    setPassword("");
    setName("");
    setAge("");
    setHeight("");
    setWeight("");
    setImage("");
  }

  //upload profile picture
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

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
    <div className="signup">
      <Form as={Col} md={{ span: 6, offset: 5 }} className="mt-5">
        <div>
          <h1 className="mt-5 mb-5">Signup and create a Plan!</h1>
          <h4>
            Add your personal information, <br />
            we do the math for you!
          </h4>
        </div>
        <br />

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
        <Form.Group controlId="formBasicAge">
          <Form.Label>Age</Form.Label>
          <Form.Control
            value={age}
            onChange={(event) => setAge(event.target.value)}
            type="number"
            step="11"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Height</Form.Label>
          <Form.Control
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            type="number"
            name="price"
            pattern="[0-9]+([\.,][0-9]+)?"
            step="0.01"
            title="This should be a number with up to 2 decimal places."
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Weight</Form.Label>
          <Form.Control
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            type="number"
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Gender</Form.Label>
          <select
            class="form-control form-control-sm"
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <option>choose here</option>
            <option value={"f"}>female</option>
            <option value={"m"}>male</option>
          </select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Exercise Daily?</Form.Label>
          <select
            class="form-control form-control-sm"
            onChange={(e) => {
              setExerciseDaily(e.target.value);
            }}
          >
            <option>choose here</option>
            <option value={"no"}>no</option>
            <option value={"yes"}>yes</option>
          </select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select your Nutritionist here:</Form.Label>
          <select
            class="form-control form-control-sm"
            onChange={(e) => {
              setDoctorId(e.target.value);
            }}
          >
            <option>I don't have a Nutritionist!</option>
            {!Array.isArray(allDoctors)
              ? null
              : allDoctors.map((doctor) => {
                  return (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  );
                })}
          </select>
        </Form.Group>
        <div>
          <h5>Upload your profile picture</h5>
          <label id="label">
            {" "}
            Choose file
            <input
              id="input"
              type="file"
              name="file"
              placeholder="drag it here"
              onChange={uploadImage}
            />
          </label>
          <br />
          <img src={image} width="50%" />
        </div>
        <Form.Group className="mt-5">
          <Button
            variant="light"
            type="submit"
            id="buttonSignupPage"
            onClick={submitForm}
          >
            Create My Plan
          </Button>
        </Form.Group>
        <p>
          Already have an account?{" "}
          <Link id="linkSignupPage" to="/login">
            Click here to log in
          </Link>
        </p>
      </Form>
    </div>
  );
}
