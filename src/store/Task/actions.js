import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

export function tasksList(data) {
  console.log("dataaa", data);
  return {
    type: "tasksList/fetched",
    payload: data,
  };
}

export function fetchTasks(userId) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/tasks
    `);
    const allTasks = response.data;
    dispatch(tasksList(allTasks));
  };
}

//add task
export const addTask = (name, userId) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(`${apiUrl}/tasks`, {
        name,
        userId,
      });
      console.log("add task", response.data);

      dispatch(showMessageWithTimeout("success", true, "new food added"));
      dispatch(fetchTasks(userId));
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
