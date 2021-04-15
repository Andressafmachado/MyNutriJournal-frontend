import Axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { addFood } from "../store/Food/actions";
import { fetchFoods } from "../store/Food/actions";
import { fetchSpecificUser } from "../store/specificUser/actions";
import { selectSpecificUser } from "../store/specificUser/selectors";
import { selectToken, selectUser } from "../store/user/selectors";
import { selectFood } from "../store/Food/selectors";
import { useHistory } from "react-router";
import { selectTasks } from "../store/Task/selectors";
import { fetchTasks } from "../store/Task/actions";
import {
  addCompletedTask,
  fetchCompletedTasks,
} from "../store/completedTasks/actions";
import { selectCompletedTasks } from "../store/completedTasks/selectors";
import { fetchMyDoctor } from "../store/myDoctor/actions";
import { selectTodayComments } from "../store/todayComments/selectors";
import { fetchTodayComments } from "../store/todayComments/actions";
import { addComment } from "../store/todayComments/actions";
import moment from "moment";
import { selectMyDoctor } from "../store/myDoctor/selectors";
import "./DailyProgressPage.css";
import { Link } from "react-router-dom";

export default function DailyProgressPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userId = user.id;
  const [sentence, setSentence] = useState("");
  const [item, setItem] = useState("");
  const [calories, setCalories] = useState("");
  const specificUser = useSelector(selectSpecificUser);
  const date = new Date();
  const today = date.toLocaleDateString().split("/").reverse().join("-");
  const food = useSelector(selectFood);
  const [searchText, set_searchText] = useState("");
  const [searchState, setSearchState] = useState({ status: "idle" });
  const history = useHistory();
  const token = useSelector(selectToken);
  const allTasks = useSelector(selectTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const todayComments = useSelector(selectTodayComments);
  const myDoctor = useSelector(selectMyDoctor);
  const weightInKg = specificUser.weight;
  const heightInM = specificUser.height;
  const age = specificUser.age;
  const gender = specificUser.gender;
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
  // const date = new Date();
  // const today = date.toLocaleDateString().split("/").reverse().join("-");
  const start = moment(initialDate);
  const end = moment(today);
  const progressInDays = end.diff(start, "days");
  const dietInDays = dietWeeks * 7;
  const progressInPercent = (progressInDays / dietInDays) * 100;

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

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [token, history]);

  useEffect(() => {
    dispatch(fetchMyDoctor(specificUser.doctorId));
  }, [dispatch, specificUser.doctorId]);

  useEffect(() => {
    dispatch(fetchTasks(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchCompletedTasks(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchSpecificUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchFoods(today, userId));
  }, [dispatch, today, userId]);

  //today comments
  useEffect(() => {
    dispatch(fetchTodayComments(specificUser.id, today));
  }, [dispatch, specificUser.id, today]);

  const search = async () => {
    // console.log("TODO search movies for:", searchText);
    // collect the searchterm in our input field
    setSearchState({ status: "loading" });
    // This is to encode characters that have special meaning in urls
    // const encodedSearch = encodeURIComponent(searchText);

    const response = await Axios.get(
      `https://edamam-food-and-grocery-database.p.rapidapi.com/parser`,
      {
        params: { ingr: searchText },

        headers: {
          "x-rapidapi-key":
            "c4c10462bemshab94b761bbb6e7ap159766jsnb04e024926aa",
          "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
        },
      }
    );

    const item = response.data.hints;
    // After fetching the data we need to set it to some state so we can use it later
    // to render
    setSearchState({ status: "done", data: item });
    setItem(item);
  };

  //motivational sentences
  useEffect(() => {
    async function fetchData() {
      const response = await Axios.get(`https://type.fit/api/quotes`);
      const number = Math.round(Math.random() * 1643);
      const data = response.data[number];
      setSentence(data);
    }
    fetchData();
  }, []);

  function submitForm(event) {
    event.preventDefault();

    dispatch(
      addFood(
        item[0].food.label,
        item[0].food.nutrients.ENERC_KCAL,
        userId,
        today
      )
    );

    setItem("");
    setCalories("");
  }

  let initialValue = 0;
  let sum = food.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.calories),
    initialValue
  );

  const isCompleted = (name) => {
    const taskCompleted = completedTasks.find((task) => {
      const created = task.createdAt.substr(0, 10);
      return task.name === name && created === today;
    });
    return taskCompleted ? true : false;
  };

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

  return (
    <div style={{ fontFamily: "Josefin Sans " }}>
      <div style={{ margin: "2% " }} class="d-flex bd-highlight">
        <div class="d-flex align-content-end flex-wrap ">
          <img src={user.image} wight="300px" height="300px" />
        </div>
        <div style={{ margin: "2% " }} class="p-2 flex-fill bd-highlight">
          <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>
            Daily Progress
          </h1>
          <h2>Welcome {user.name}</h2>
          <br /> <br /> <br />
          <h5 style={{ fontFamily: "New Tegomin" }}> {sentence.text}</h5>
          <h6 style={{ fontFamily: "New Tegomin" }}> {sentence.author}</h6>
        </div>
      </div>
      <div class="d-flex bd-highlight">
        <div style={{ margin: "2% " }} class="p-2 flex-fill bd-highlight">
          <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>food</h1>

          <h4>Your should eat {Math.round(dietCalories)} a day</h4>
          <br />
          {!food
            ? null
            : food.map((food, index) => {
                return (
                  <div key={index}>
                    {food.item}, kcal: {food.calories}
                  </div>
                );
              })}
          <br />
          {sum < dietCalories ? (
            <h5
              style={{ backgroundColor: "#8cbaa3", padding: 5, width: "50%" }}
            >
              {" "}
              total calories today {sum}
            </h5>
          ) : (
            <h5
              style={{ backgroundColor: "#f58e56", padding: 5, width: "50%" }}
            >
              {" "}
              total calories today {sum}
            </h5>
          )}
        </div>
        <div style={{ margin: "2% " }} class="p-2 flex-fill bd-highlight">
          <h1 style={{ fontFamily: "Limelight", paddingTop: 22 }}>tasks</h1>
          <h4>Your tasks for today:</h4>
          {allTasks < 1 ? <p>You don't have tasks for today!</p> : null}
          {!allTasks ? (
            <p>You don't have tasks for today!</p>
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
                    {task.name}{" "}
                    {isCompleted(task.name) ? null : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(addCompletedTask(task.name, userId));
                        }}
                        type="button"
                        class="btn btn-light btn-sm"
                        style={{ backgroundColor: "#feb594" }}
                        type="submit"
                        value={name}
                      >
                        Done?
                      </button>
                    )}
                  </div>{" "}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div class="d-flex bd-highlight">
        <div class="p-2 flex-fill bd-highlight">
          <div style={{ margin: "2% " }} class="p-2 flex-fill bd-highlight">
            <h4>let's add some food here</h4>
            <p>100 ml/100 gram</p>
            <input
              value={searchText}
              onChange={(e) => set_searchText(e.target.value)}
            />
            <button
              onClick={search}
              type="button"
              class="btn btn-light btn-sm"
              style={{ backgroundColor: "#cfe0d8" }}
            >
              search
            </button>

            {searchState.status === "idle" && <div>Type to search</div>}
            {searchState.status === "loading" && <div>Loading...</div>}

            <div>
              {!item[0] ? null : (
                <div>
                  <img src={item[0].food.image} style={{ width: 150 }} />
                  <br />
                  {item[0].food.label}, kcal:
                  {JSON.stringify(item[0].food.nutrients.ENERC_KCAL)}
                  <br />
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    variant="light"
                    type="submit"
                    onClick={submitForm}
                  >
                    add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex bd-highlight">
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
        <div style={{ margin: "33px" }} class="p-2 flex-fill bd-highlight">
          <h4 style={{ fontFamily: "Limelight", paddingTop: 22 }}>comments</h4>
          <p>let's add some thoughts here to keep you motivated</p>
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
      </div>

      <div>
        <footer class="bg-light text-center text-lg-start">
          <div class="text-center p-3" style={{ backgroundColor: "#c5dbd3" }}>
            © 2021 Copyright: AndressaMachado
            {/* <a class="text-dark" href="https://mdbootstrap.com/"
            >
              AndressaMachado
            </a> */}
          </div>
        </footer>
      </div>
    </div>
  );
}
