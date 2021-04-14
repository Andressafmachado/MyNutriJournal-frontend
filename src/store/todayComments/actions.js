import { apiUrl } from "../../config/constants";
import axios from "axios";

import {
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

export function todayCommentsList(data) {
  return {
    type: "todayCommentsList/fetched",
    payload: data,
  };
}

export function fetchTodayComments(userId, date) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/comments
    `);

    const allComments = response.data;
    function todayComments(newdate) {
      const one = allComments.filter((comment) => {
        const createdAt = comment.createdAt.substr(0, 10);
        return createdAt === date;
      });
      return one;
    }
    dispatch(todayCommentsList(todayComments()));
  };
}

//add comment
export const addComment = (content, name, userId, doctorId, date) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(`${apiUrl}/comments`, {
        content,
        name,
        userId,
        doctorId,
      });

      dispatch(showMessageWithTimeout("success", true, "new comment added"));
      console.log("where is the id", userId);
      dispatch(fetchTodayComments(userId, date));
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(setMessage("danger", true, error.response.data.message));
      } else {
        console.log(error.message);
        dispatch(setMessage("danger", true, error.message));
      }

      dispatch(appDoneLoading());
    }
  };
};
