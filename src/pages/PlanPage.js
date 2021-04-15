import React, { useEffect, useState } from "react";
import { fetchSpecificUser } from "../store/specificUser/actions";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { selectSpecificUser } from "../store/specificUser/selectors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Container from "react-bootstrap/Container";
import { selectToken, selectUser } from "../store/user/selectors";
import { addTask, fetchTasks } from "../store/Task/actions";
import { selectTasks } from "../store/Task/selectors";
import { fetchCompletedTasks } from "../store/completedTasks/actions";
import "react-datepicker/dist/react-datepicker.css";
import { selectCompletedTasks } from "../store/completedTasks/selectors";
import DatePicker from "react-datepicker";
import { selectAllFood } from "../store/allFood/selectors";
import { fetchAllFoods } from "../store/allFood/actions";
import { selectMyDoctor } from "../store/myDoctor/selectors";
import { fetchMyDoctor } from "../store/myDoctor/actions";
import { selectComments } from "../store/Comments/selectors";
import { fetchComments } from "../store/Comments/actions";
import { addComment, fetchTodayComments } from "../store/todayComments/actions";
import { selectTodayComments } from "../store/todayComments/selectors";

export default function PlanPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const specificUser = useSelector(selectSpecificUser);
  const history = useHistory();
  const token = useSelector(selectToken);
  const [name, setName] = useState("");
  const allTasks = useSelector(selectTasks);
  const allComments = useSelector(selectComments);
  const todayComments = useSelector(selectTodayComments);
  const [comment, setComment] = useState("");
  const completedTasks = useSelector(selectCompletedTasks);
  const [startDate, setStartDate] = useState(new Date());
  const datePicker = startDate
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-");
  const allFood = useSelector(selectAllFood);
  const myDoctor = useSelector(selectMyDoctor);
  const user = useSelector(selectUser);

  const weightInKg = specificUser.weight;
  const heightInM = specificUser.height;
  const age = specificUser.age;
  const gender = specificUser.gender;
  const genderString = gender === "m" ? "he" : "she";
  const dailyExercise = specificUser.exerciseDaily;

  const BMI = calculateBMI(weightInKg, heightInM);
  const BMR = calculateBMR(weightInKg, heightInM, age, gender);
  const idealWeight = calculateIdealWeight(heightInM);
  const dailyCalories = calculateDailyCalories(BMR, dailyExercise);
  const weightToLoseKg = weightInKg - idealWeight;
  const dietWeeks = calculateDietWeeks(weightToLoseKg);
  const dietWeeksString = Math.abs(dietWeeks);
  const dietCalories = calculateDietCalories(weightToLoseKg, dailyCalories);

  //progress
  const initialDate = specificUser.createdAt;
  const date = new Date();
  const today = date.toLocaleDateString().split("/").reverse().join("-");
  const start = moment(initialDate);
  const end = moment(today);
  const progressInDays = end.diff(start, "days");
  const dietInDays = dietWeeks * 7;
  const dietInDaysString = Math.abs(dietInDays);
  const progressInPercent = (progressInDays / dietInDays) * 100;

  useEffect(() => {
    dispatch(fetchMyDoctor(specificUser.doctorId));
  }, [dispatch, specificUser.doctorId]);

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [token, history]);

  useEffect(() => {
    dispatch(fetchCompletedTasks(specificUser.id));
  }, [dispatch, specificUser.id]);

  useEffect(() => {
    dispatch(fetchAllFoods(datePicker, specificUser.id));
  }, [dispatch, datePicker, specificUser.id]);

  //comments for specific day
  useEffect(() => {
    dispatch(fetchComments(specificUser.id, datePicker));
  }, [dispatch, specificUser.id, datePicker]);

  //today comments
  useEffect(() => {
    dispatch(fetchTodayComments(specificUser.id, today));
  }, [dispatch, specificUser.id, today]);

  const isCompleted = (name) => {
    const taskCompleted = completedTasks.find((task) => {
      const created = task.createdAt.substr(0, 10);
      return task.name === name && created === datePicker;
    });
    return taskCompleted ? true : false;
  };

  useEffect(() => {
    dispatch(fetchSpecificUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  function calculateBMI(weight, height) {
    return weight / (height * height);
  }

  function calculateBMR(weight, height, ageOfUser, genderOfUser) {
    const heightInCm = height * 100;

    let BMR;

    if (genderOfUser === "m") {
      BMR = 10 * weight + 6.25 * heightInCm - 5 * ageOfUser + 50;
    } else {
      BMR = 10 * weight + 6.25 * heightInCm - 5 * ageOfUser - 150;
    }

    return BMR;
  }

  function calculateIdealWeight(height) {
    return 22.5 * height * height;
  }

  function calculateDailyCalories(basalMetabolicRate, doesUserExercise) {
    return doesUserExercise === "yes"
      ? basalMetabolicRate * 1.6
      : basalMetabolicRate * 1.4;
  }

  function calculateDietWeeks(weightToLoseKg) {
    return Math.ceil(weightToLoseKg / 0.5);
  }

  function calculateDietCalories(weightToLoseKg, dailyCalories) {
    let dietCalories;
    if (weightToLoseKg < 0) {
      dietCalories = dailyCalories + 500;
    } else {
      dietCalories = dailyCalories - 500;
    }
    return dietCalories;
  }

  //ADD NEW TASK
  function submitForm(event) {
    event.preventDefault();
    dispatch(addTask(name, specificUser.id));
    setName("");
  }

  //ADD NEW COMMENT
  function submitFormComment(event) {
    event.preventDefault();
    dispatch(
      addComment(
        comment,
        user.name,
        specificUser.id,
        specificUser.doctorId,
        today
      )
    );
    setComment("");
  }

  let initialValue = 0;
  let sum = allFood.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.calories),
    initialValue
  );

  return (
    <div style={{ fontFamily: "Josefin Sans " }}>
      <p></p>
      <div class="d-flex bd-highlight">
        <div style={{ margin: "5%" }} class="p-2 flex bd-highlight">
          {" "}
          <img
            src={specificUser.image}
            wight="50%"
            height="auto"
            class="rounded-circle"
            alt="patientImage"
            width="auto"
            height="300"
          />
        </div>
        <div class="p-2 flex-fill bd-highlight">
          <h2 style={{ paddingTop: 22 }}>Personal data</h2>
          <br />
          <h5>name: {specificUser.name}</h5>
          <h5>email: {specificUser.email}</h5>
          <h5>age: {specificUser.age}</h5>
          <h5>height: {specificUser.height}</h5>
          <h5>weight: {specificUser.weight}</h5>
          <h5>gender: {specificUser.gender}</h5>
          <h5>exercise daily: {specificUser.exerciseDaily}</h5>
          <br />
          <br />
        </div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight">
          {user.isDoctor ? (
            <div>
              <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
                Progress {Math.floor(progressInPercent)}%
              </h1>
              days in a diet: {progressInDays}/ {dietInDaysString}
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
                You got this
              </h1>
              <br />
              <h5>Check out your progress:</h5>
              <h5>progress: {Math.floor(progressInPercent)}%</h5>
              days in a diet: {progressInDays}/ {dietInDaysString}
            </div>
          )}

          <br />
        </div>
      </div>
      <div class="d-flex bd-highlight">
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight"></div>
        <div
          style={{ border: "", textAlign: "center" }}
          class="p-2 flex-fill bd-highlight"
        >
          <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
            FACING THE FACTS
          </h1>
          {user.isDoctor ? (
            <p style={{ fontSize: 22 }}>
              {specificUser.name}'s BMI is {Math.round(BMI)}, {genderString} is{" "}
              {BMI < 18.5 ? "underweight" : "overweight"}.
              <br />
              {specificUser.name} ideal weight is {Math.round(idealWeight)} kg.{" "}
              <br />
              With a normal lifestyle {genderString} burns{" "}
              {Math.round(dailyCalories)} calories a day.
            </p>
          ) : (
            <p style={{ fontSize: 22 }}>
              Your BMI is {Math.round(BMI)}, you are{" "}
              {BMI < 18.5 ? "underweight" : "overweight"}.
              <br />
              Your ideal weight is {Math.round(idealWeight)} kg. <br />
              With a normal lifestyle you burn {Math.round(dailyCalories)}{" "}
              calories a day.
            </p>
          )}
          <br /> <br />
          <h2 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
            DIET PLAN
          </h2>{" "}
          {user.isDoctor ? (
            <p style={{ fontSize: 22 }}>
              If {genderString} wants to reach out the ideal weight of{" "}
              {Math.round(idealWeight)}
              kg,
              <br />
              {genderString} should eat {Math.round(dietCalories)} calories a
              day for {dietWeeksString} weeks/ {dietInDaysString} days.
            </p>
          ) : (
            <p style={{ fontSize: 22 }}>
              If you want to reach your ideal weight of{" "}
              {Math.round(idealWeight)}
              kg.
              <br /> Eat {Math.round(dietCalories)} calories a day for{" "}
              {dietWeeksString} weeks/ {dietInDaysString} days.
            </p>
          )}
          <br />
          <br />
          info:
          <br />A BMI under 18.5 is considered underweight
          <br />A BMI above 25 is considered overweight
          <br />
        </div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight"></div>
      </div>

      <div class="d-flex bd-highlight">
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight">
          <h3 style={{ paddingTop: 22 }}>Here we track all activities </h3>
          Choose a day to see the historic: <br />{" "}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />{" "}
          <br />
        </div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight"></div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight"></div>
      </div>
      <div class="d-flex bd-highlight">
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight">
          <h5
            style={{
              fontFamily: "Limelight",
              paddingTop: 22,
              backgroundColor: "#cfe0d8",
            }}
          >
            Tasks
          </h5>
          {allTasks < 1 ? <p>"nada" here!</p> : null}
          {!allTasks ? (
            <p>loading ...</p>
          ) : (
            allTasks.map((task) => {
              return (
                <div>
                  <div
                    value={name}
                    style={{
                      backgroundColor: isCompleted(task.name)
                        ? "#8cbaa3"
                        : "#f58e56",
                      width: 300,
                      padding: 10,
                      border: "solid gray 1px",
                    }}
                    key={task.id}
                  >
                    {isCompleted(task.name) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        class="bi bi-check-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        class="bi bi-x-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    )}{" "}
                    {"      "}
                    {task.name}
                  </div>{" "}
                </div>
              );
            })
          )}
          <br />
          <br />
          <br />
          <h5 style={{ fontFamily: "Limelight" }}>Manage tasks</h5>
          {allTasks < 1 ? <p>no tasks here yet, lets add something!</p> : null}
          {!allTasks ? (
            <p>no tasks here yet, lets add something!</p>
          ) : (
            allTasks.map((task) => {
              return <div>{task.name}</div>;
            })
          )}

          <br />

          <input
            style={{ border: "solid 1px", width: 150 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <button
            type="button"
            class="btn btn-light btn-sm"
            style={{ backgroundColor: "#cfe0d8" }}
            type="submit"
            onClick={submitForm}
          >
            add
          </button>
        </div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight">
          <h5
            style={{
              fontFamily: "Limelight",
              paddingTop: 22,
              backgroundColor: "#cfe0d8",
            }}
          >
            Food
          </h5>
          {!Array.isArray(allFood) ? (
            <div>your history food here!</div>
          ) : (
            allFood.map((food) => {
              return (
                <div
                  style={{
                    // backgroundColor: isCompleted(task.name)
                    //   ? "green  "
                    //   : "yellow",
                    width: 300,
                    padding: 10,
                    border: "solid gray 1px",
                  }}
                  key={food.id}
                >
                  {food.item}, {food.calories} kcal
                </div>
              );
            })
          )}
          {sum < 1 ? (
            <div> There is no registered food for this day! </div>
          ) : sum < dietCalories ? (
            <h5
              style={{
                backgroundColor: "#8cbaa3",
                padding: 5,
                width: 300,
                padding: 10,
                border: "solid gray 1px",
              }}
            >
              {" "}
              total calories today {sum}
            </h5>
          ) : (
            <h5
              style={{
                backgroundColor: "#f58e56",
                padding: 5,
                width: 300,
                padding: 10,
                border: "solid gray 1px",
              }}
            >
              {" "}
              total calories today {sum}
            </h5>
          )}
        </div>
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight">
          <h5
            style={{
              fontFamily: "Limelight",
              paddingTop: 22,
              backgroundColor: "#cfe0d8",
            }}
          >
            {" "}
            comments for this day
          </h5>{" "}
          {allComments.length > 0 ? null : (
            <div>There is no comments for this day!</div>
          )}
          {!allComments ? (
            <div>loading ... </div>
          ) : (
            allComments.map((comment) => {
              return (
                <div>
                  {comment.name} said
                  <div style={{ fontSize: 22 }}>{comment.content}</div>
                  <br />
                  <br />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div class="d-flex bd-highlight">
        <div
          style={{
            marginTop: "33px",
          }}
          class="p-2 flex-center bd-highlight"
        >
          <h4 style={{ fontFamily: "Limelight", paddingTop: 22 }}>thoughts?</h4>
          {user.isDoctor ? (
            <p>
              let's add something here to keep {specificUser.name} motivated...
            </p>
          ) : (
            <p>let's add something here to keep you motivated...</p>
          )}
          {!todayComments ? (
            <div>loading ... </div>
          ) : (
            todayComments.map((comment) => {
              return (
                <div
                  style={{
                    // backgroundColor: "gray",
                    margin: "5px",
                    padding: "5px",
                    width: "50%",
                  }}
                >
                  <div> {comment.name} said:</div>

                  <div style={{ fontSize: 22 }}>{comment.content}</div>
                </div>
              );
            })
          )}

          <textarea
            style={{ border: "solid 1px", width: 150 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <br />
          <button
            type="button"
            class="btn btn-light btn-sm"
            style={{ backgroundColor: "#cfe0d8" }}
            type="submit"
            onClick={submitFormComment}
          >
            add
          </button>
        </div>
        <div class="p-2 flex bd-highlight">
          {!user.doctorId > 0 ? null : (
            <div style={{ margin: "50px" }}>
              <img
                src={myDoctor.image}
                class="rounded-circle"
                alt="patientImage"
                width="150"
                height="150"
              />
            </div>
          )}
        </div>
        <div class="p-2 flex bd-highlight">
          {!user.doctorId > 0 ? null : (
            <div style={{ margin: "33px" }}>
              <h4 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
                Your Nutritionist
              </h4>
              <br />
              name:{myDoctor.name}
              <br />
              email: {myDoctor.email}
            </div>
          )}
        </div>
      </div>
      <div>
        <footer class="bg-light text-center text-lg-start">
          <div class="text-center p-3" style={{ backgroundColor: "#c5dbd3" }}>
            © 2021 Copyright: AndressaMachado
          </div>
        </footer>
      </div>
    </div>
  );
}
