import Axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecificUser } from "../store/specificUser/actions";
import { selectSpecificUser } from "../store/specificUser/selectors";
import { selectUser } from "../store/user/selectors";

export default function DailyProgressPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userId = user.id;
  const [sentence, setSentence] = useState("");
  const [item, setItem] = useState("");
  const specificUser = useSelector(selectSpecificUser);

  useEffect(() => {
    dispatch(fetchSpecificUser(userId));
  }, [dispatch, userId]);

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
          params: { ingr: "banana" },
          headers: {
            "x-rapidapi-key":
              "c4c10462bemshab94b761bbb6e7ap159766jsnb04e024926aa",
            "x-rapidapi-host":
              "edamam-food-and-grocery-database.p.rapidapi.com",
          },
        }
      );
      setItem(response.data.hints);
      console.log("novo useeffect", response);
    }
    fetchData();
  }, []);

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
        <button>search</button>
        <div>
          {" "}
          {!item
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
              })}
        </div>
        <br />
      </div>
    </Container>
  );
}
