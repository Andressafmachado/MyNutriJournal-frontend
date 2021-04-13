import React, { useEffect, useState } from "react";
import { fetchSpecificUser } from "../store/specificUser/actions";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { selectSpecificUser } from "../store/specificUser/selectors";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Container from "react-bootstrap/Container";
import { selectToken } from "../store/user/selectors";
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

export default function PlanPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const specificUser = useSelector(selectSpecificUser);
  const history = useHistory();
  const token = useSelector(selectToken);
  const [name, setName] = useState("");
  const allTasks = useSelector(selectTasks);
  const completedTasks = useSelector(selectCompletedTasks);
  const [startDate, setStartDate] = useState(new Date());
  const datePicker = startDate
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-");
  const allFood = useSelector(selectAllFood);
  const myDoctor = useSelector(selectMyDoctor);

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

  const isCompleted = (name) => {
    const taskCompleted = completedTasks.find((task) => {
      const created = task.createdAt.substr(0, 10);
      return task.name === name && created === datePicker;
    });
    return taskCompleted ? true : false;
  };

  //percent tasks done
  // const percTasksDone = (100 / allTasks.length) * completedTasks.length;

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
  const date = new Date();
  const today = date.toLocaleDateString().split("/").reverse().join("-");
  const start = moment(initialDate);
  const end = moment(today);
  const progressInDays = end.diff(start, "days");
  const dietInDays = dietWeeks * 7;
  const progressInPercent = (progressInDays / dietInDays) * 100;

  function submitForm(event) {
    event.preventDefault();

    dispatch(addTask(name, specificUser.id));

    setName("");
  }

  let initialValue = 0;
  let sum = allFood.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.calories),
    initialValue
  );

  return (
    <Container>
      <div>
        <div style={{ border: "solid ", padding: 50 }}>
          <h1>progress: {Math.floor(progressInPercent)}%</h1>
        </div>
        <div>
          <br />
          <img
            src={specificUser.image}
            wight="50%"
            height="auto"
            class="rounded-circle"
            alt="patientImage"
            width="150"
            height="150"
          />
          <br />
          <br />
          PERSONAL DATA:
          <h1>{specificUser.name}</h1>
          <h5>email: {specificUser.email}</h5>
          <h5>age: {specificUser.age}</h5>
          <h5>height: {specificUser.height}</h5>
          <h5>weight: {specificUser.weight}</h5>
          <h5>gender: {specificUser.gender}</h5>
          <h5>exerciseDaily: {specificUser.exerciseDaily}</h5>
        </div>
        {myDoctor.length < 3 ? null : (
          <div>
            your Doctor
            <br />
            name:{myDoctor.name}
            <br />
            email: {myDoctor.email}
          </div>
        )}
        <br />
        <br />
        <div>
          <br />
          <h2>FACING THE FACTS</h2>
          Your BMI is {Math.round(BMI)}, you are{" "}
          {BMI < 18.5 ? "underweight" : "overweight"}
          <br />
          Your ideal weight is {Math.round(idealWeight)} kg <br />
          With a normal lifestyle you burn {Math.round(dailyCalories)} calories
          a day
          <br /> <br />
          <h2>DIET PLAN</h2> <br />
          If you want to reach your ideal weight of {Math.round(idealWeight)}kg.
          <br /> Eat {Math.round(dietCalories)} calories a day For{" "}
          {dietWeeksString} weeks.
          <br />
          <br />
          info:
          <br />A BMI under 18.5 is considered underweight
          <br />A BMI above 25 is considered overweight
          <br />
          <br />
          <br />
          <br />
        </div>
        <br />
        <br />
        <br />
        <Link to="/dailyprogress">
          <button>Daily Progress</button>
        </Link>
        <br />
        <br />
        <br />
        <h2>Lets track your progress:</h2>
        total days: {dietInDays}
        <br />
        days in a diet: {progressInDays}
        <br />
        progress: {Math.floor(progressInPercent)}%
        <div>
          <br />

          <br />
          <h2>Manage tasks:</h2>
          {allTasks < 1 ? (
            <p>You don't have tasks yet, lets add something here!</p>
          ) : null}
          {!allTasks ? (
            <p>You don't have tasks yet, lets add something here!</p>
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
            class="btn btn-primary btn-sm"
            variant="primary"
            type="submit"
            onClick={submitForm}
          >
            add
          </button>
        </div>
        <div>
          {" "}
          <br />
          <br />
          <br />
          Choose a day to check your historic:
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />{" "}
          <br />
          <br />
          <h5>Tasks:</h5>
          {allTasks < 1 ? (
            <p>There is no completed tasks register for this day!</p>
          ) : null}
          {!allTasks ? (
            <p>loading ...</p>
          ) : (
            allTasks.map((task) => {
              return (
                <div>
                  <div
                    value={name}
                    style={{
                      // backgroundColor: isCompleted(task.name)
                      //   ? "green  "
                      //   : "yellow",
                      width: 300,
                      padding: 10,
                      border: "solid gray 1px",
                    }}
                    key={task.id}
                  >
                    {isCompleted(task.name) ? (
                      <img
                        src="https://mxpez29397.i.lithium.com/html/images/emoticons/2705.png"
                        width="30px"
                      />
                    ) : (
                      <img
                        src="https://images.emojiterra.com/google/android-11/128px/274c.png"
                        width="30px"
                      />
                    )}{" "}
                    {"      "}
                    {task.name}
                  </div>{" "}
                </div>
              );
            })
          )}
          <div>
            <h5>Food:</h5>
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
              <h5> There is no registered food for this day! </h5>
            ) : (
              <h5> total calories {sum}</h5>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
