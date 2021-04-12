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
  console.log("date picker", datePicker);

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [token, history]);

  useEffect(() => {
    dispatch(fetchCompletedTasks(specificUser.id));
  }, [dispatch, specificUser.id]);

  const isCompleted = (name) => {
    const taskCompleted = completedTasks.find((task) => {
      const created = task.createdAt.substr(0, 10);
      console.log("created ", created);
      return task.name === name && created === datePicker;
    });

    return taskCompleted ? true : false;
  };

  //percent tasks done
  const percTasksDone = (100 / allTasks.length) * completedTasks.length;

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

  function validateNumberOfInputs(argv) {
    if (argv.length !== 7) {
      console.log(`
        You gave ${argv.length - 2} arguments(s) to the program

        Please provide 5 arguments for

        weight (kg),
        height (m),
        age (years),
        wether you exercise daily (yes or no)
        and your gender (m or f)

        Example:

        $ node index.js 82 1.79 32 yes m
      `);

      process.exit();
    }
  }

  function validateWeightHeightAndAge(weight, height, ageOfUser, argv) {
    if (isNaN(weight) || isNaN(height) || isNaN(ageOfUser)) {
      console.log(`
        Please make sure weight, height and age are numbers:

        weight (kg) example: 82 | your input: ${argv[2]}
        height (m) example 1.79 | your input: ${argv[3]}
        age (years) example 32  | your input: ${argv[4]}

        $ node index.js 82 1.79 32 yes m
      `);

      process.exit();
    }

    if (ageOfUser < 20) {
      console.log(
        `This BMI calculator was designed to be used by people older than 20. BMI is calculated differently for young people.`
      );
      process.exit();
    }

    if (weight < 30 || weight > 300) {
      console.log(`Please, for weight provide a number between 30 and 300kg`);
      process.exit();
    }
  }

  function validateDailyExercise(doesUserExercise) {
    if (doesUserExercise !== "yes" && doesUserExercise !== "no") {
      console.log(
        `Please specify wether you exercise daily with "yes" or "no"`
      );
      process.exit();
    }
  }

  function validateGender(gender) {
    if (gender !== "m" && gender !== "f") {
      console.log(`Please, for gender provide "m" or "f".`);
      process.exit();
    }
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

  return (
    <Container>
      <div>
        <div style={{ border: "solid ", padding: 50 }}>
          <h1>progress: {Math.floor(progressInPercent)}%</h1>
        </div>
        <div>
          PERSONAL DATA:
          <h1>{specificUser.name}</h1>
          <h5>email: {specificUser.email}</h5>
          <h5>age: {specificUser.age}</h5>
          <h5>height: {specificUser.height}</h5>
          <h5>weight: {specificUser.weight}</h5>
          <h5>gender: {specificUser.gender}</h5>
          <h5>exerciseDaily: {specificUser.exerciseDaily}</h5>
        </div>
        <br />
        <br />
        <div>
          ************** BMI CALCULATOR **************
          <br />
          **************** FACING THE FACTS ****************
          <br />
          Your BMI is {Math.round(BMI)}
          <br />A BMI under 18.5 is considered underweight
          <br />A BMI above 25 is considered overweight
          <br />
          Your ideal weight is {Math.round(idealWeight)} kg <br />
          With a normal lifestyle you burn {Math.round(dailyCalories)} calories
          a day
          <br />
          <br />
          <br />
          ********** DIET PLAN ********** <br />
          If you want to reach your ideal weight of {Math.round(idealWeight)}kg.
          <br /> Eat {Math.round(dietCalories)} calories a day For {dietWeeks}{" "}
          weeks.
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
          {!allTasks ? (
            <p>loading...</p>
          ) : (
            allTasks.map((task) => {
              return <div>{task.name}</div>;
            })
          )}
          <br />

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
          completed tasks:
          <br />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <br />
          {percTasksDone}% done for this day!
          <br />
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
                    {isCompleted(task.name) ? (
                      <input type="checkbox" checked="checked" />
                    ) : (
                      <input type="checkbox" />
                    )}
                    {"      "}

                    <label>
                      {" "}
                      {"  "}
                      {task.name}
                    </label>
                  </div>{" "}
                </div>
              );
            })
          )}
          {completedTasks.length} / {allTasks.length} done!
        </div>
      </div>
    </Container>
  );
}
