import Axios from "axios";
import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { selectUser } from "../store/user/selectors";

export default function DailyProgressPage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userId = user.id;
  const [sentence, setSentence] = useState("");

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
    <div>
      <h1>Daily Progress</h1>

      <br />
      <h2>Welcome {user.name}</h2>
      <br />
      <br />
      <br />

      <h3> {sentence.text}</h3>
      <h5> {sentence.author}</h5>
    </div>
  );
}
