import Axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { addFood } from "../store/Food/actions";
import { fetchFoods } from "../store/Food/actions";
import { fetchSpecificUser } from "../store/specificUser/actions";
import { selectSpecificUser } from "../store/specificUser/selectors";
import { selectUser } from "../store/user/selectors";
import { selectFood } from "../store/Food/selectors";

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

  useEffect(() => {
    dispatch(fetchSpecificUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchFoods(today, userId));
  }, [dispatch, today, userId]);

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

  useEffect(() => {
    async function fetchData() {
      const response = await Axios.get(
        `https://edamam-food-and-grocery-database.p.rapidapi.com/parser`,
        {
          params: { ingr: "banana bread" },
          headers: {
            "x-rapidapi-key":
              "c4c10462bemshab94b761bbb6e7ap159766jsnb04e024926aa",
            "x-rapidapi-host":
              "edamam-food-and-grocery-database.p.rapidapi.com",
          },
        }
      );
      setItem(response.data.hints);
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

  console.log("soma", sum); // logs 6

  return (
    <Container>
      <div>
        <h1>Daily Progress</h1>
        <br />
        <h2>Welcome {user.name}</h2>
        <br />
        <br />
        <br />
        <h3> {sentence.text}</h3>
        <h5> {sentence.author}</h5>
        <br />
        <br />
        <div>
          <h4>Your tasks for today:</h4>
          {!specificUser.tasks ? (
            <p>You don't have tasks for today!</p>
          ) : (
            specificUser.tasks.map((task) => {
              return (
                <div key={task.id}>
                  <li style={{ border: "solid 1px", width: "200px" }}>
                    {task.name}
                  </li>
                </div>
              );
            })
          )}
        </div>
        <br />
        <br />
        <h1>new item</h1>
        <input />
        <button type="button" class="btn btn-primary btn-sm">
          search
        </button>
        <div>
          {" "}
          {/* {!item
            ? null
            : item.map((item, index) => {
                return (
                  <div>
                    <div
                      style={{
                        border: "solid 1px",
                        padding: 5,
                        width: 250,
                        height: 100,
                      }}
                      key={index}
                    >
                      <img src={item.food.image} style={{ width: 50 }} />
                      {item.food.label}, kcal:{" "}
                      {Math.round(item.food.nutrients.ENERC_KCAL)} <br />
                    </div>
                    <button>add</button>
                  </div>
                );
              })} */}
          {!item ? null : (
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
          <h3>your food</h3>
          {!food
            ? null
            : food.map((food) => {
                return (
                  <div>
                    {food.item}, kcal: {food.calories}
                  </div>
                );
              })}
        </div>
        total calories {sum}
      </div>
    </Container>
  );
}
