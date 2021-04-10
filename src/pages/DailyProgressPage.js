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

  const specificUser = useSelector(selectSpecificUser);
  console.log(specificUser);

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
                <div>
                  <lu>
                    <li style={{ border: "solid 1px", width: "200px" }}>
                      {task.name}
                    </li>
                  </lu>
                </div>
              );
            })
          )}
        </div>
        <br />
        <br />
        <br />
      </div>
    </Container>
  );
}
