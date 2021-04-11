import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

export function completedTasksList(data) {
  console.log("completedTasksList", data);
  return {
    type: "completedTasksList/fetched",
    payload: data,
  };
}

export function fetchCompletedTasks(userId) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/completedtasks
    `);
    const allTasks = response.data;
    dispatch(completedTasksList(allTasks));
  };
}

//add task
export const addCompletedTask = (name, userId) => {
  console.log("in action name", userId);
  return async (dispatch, getState) => {
    // dispatch(appLoading());
    try {
      const response = await axios.post(`${apiUrl}/completedtasks`, {
        name,
        userId,
      });
      console.log("add completed task", response.data);

      dispatch(showMessageWithTimeout("success", true, "new food added"));
      dispatch(fetchCompletedTasks(userId));
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
