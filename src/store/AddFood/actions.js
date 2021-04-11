import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

//add food
export const addFood = (item, calories, userId) => {
  console.log("info chegando", item);
  return async (dispatch, getState) => {
    // dispatch(appLoading());
    try {
      const response = await axios.post(`${apiUrl}/food`, {
        item,
        calories,
        userId,
      });
      console.log("add food", response.data);
      // dispatch(loginSuccess(response.data));
      // dispatch(showMessageWithTimeout("success", true, "account created"));
      // dispatch(appDoneLoading());
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
