import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

export function commentsList(data) {
  return {
    type: "commentsList/fetched",
    payload: data,
  };
}

export function fetchComments(userId, date) {
  console.log("user id ", userId);
  console.log("date aquiuser id ", date);

  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/comments
    `);
    console.log(response);
    const allComments = response.data;
    console.log("aall comments in action", allComments);
    function todayComments(newdate) {
      const one = allComments.filter((comment) => {
        const createdAt = comment.createdAt.substr(0, 10);
        return createdAt === date;
      });
      return one;
    }
    dispatch(commentsList(todayComments()));
  };
}
