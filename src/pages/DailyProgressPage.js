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
    <div>
      <h1>progress: {Math.floor(progressInPercent)}%</h1>
      <h1>Daily Progress</h1>
      <br />
      <img src={user.image} wight="500px" height="500px" />
      <h2>Welcome {user.name}</h2>
      <br />
      <br />
      <br />
      <div style={{ fontFamily: "Linguini", backgroundColor: "#70AFC6" }}>
        <h3> {sentence.text}</h3>
        <h5> {sentence.author}</h5>
      </div>

      <br />
      {user.isDoctor ? null : (
        <div>
          <img
            src={myDoctor.image}
            class="rounded-circle"
            alt="patientImage"
            width="75"
            height="75"
          />
          your Doctor
          <br />
          name:{myDoctor.name}
          <br />
          email: {myDoctor.email}
        </div>
      )}
      <br />
      <div>
        <h2>comments</h2>
        {!todayComments ? (
          <div>loading ... </div>
        ) : (
          todayComments.map((comment) => {
            return (
              <div>
                {comment.name} said:
                <br />
                {comment.content}
                <br />
                <br />
              </div>
            );
          })
        )}

        <input
          style={{ border: "solid 1px", width: 150 }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button
          type="button"
          class="btn btn-primary btn-sm"
          variant="primary"
          type="submit"
          onClick={submitFormComment}
        >
          add
        </button>
      </div>
      <div>
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
                      ? "green  "
                      : "yellow",
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
                      class="btn btn-primary btn-sm"
                      variant="primary"
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
      <br />
      <br />
      <h1>new item</h1>
      <p>100 ml/100 gram</p>
      <input
        value={searchText}
        onChange={(e) => set_searchText(e.target.value)}
      />
      <button onClick={search} type="button" class="btn btn-primary btn-sm">
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
              variant="primary"
              type="submit"
              onClick={submitForm}
            >
              add
            </button>
          </div>
        )}
      </div>
      <br />
      <div>
        <h3>Today food</h3>
        {!food
          ? null
          : food.map((food, index) => {
              return (
                <div key={index}>
                  {food.item}, kcal: {food.calories}
                </div>
              );
            })}
      </div>
      <h2> total calories {sum}</h2>
    </div>
  );
}
