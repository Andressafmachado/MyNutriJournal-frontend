import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import {
  appLoading,
  appDoneLoading,
  showMessageWithTimeout,
  setMessage,
} from "../appState/actions";

export function todayFoodList(data) {
  return {
    type: "todayFoods/fetched",
    payload: data,
  };
}

export function fetchFoods(date, userId) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/food
    `);
    const allFood = response.data;
    function todayFood(newdate) {
      const one = allFood.filter((food) => {
        const createdAt = food.createdAt.substr(0, 10);
        return createdAt === date;
      });
      return one;
    }

    dispatch(todayFoodList(todayFood()));
  };
}

//add food
export const addFood = (item, calories, userId, date) => {
  return async (dispatch, getState) => {
    // dispatch(appLoading());
    try {
      const response = await axios.post(`${apiUrl}/food`, {
        item,
        calories,
        userId,
      });
      console.log("add food", response.data);

      dispatch(showMessageWithTimeout("success", true, "new food added"));
      dispatch(fetchFoods(date, userId));
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
