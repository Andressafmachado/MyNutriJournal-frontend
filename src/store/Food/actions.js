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
  console.log("data second action food", data);
  return {
    type: "todayFoods/fetched",
    payload: data,
  };
}

export function fetchFoods(date, userId) {
  console.log("date", date);
  console.log("userid", userId);
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/food
    `);
    const allFood = response.data;
    console.log("allfood", allFood);
    function todayFood(newdate) {
      const one = allFood.filter((food) => {
        const createdAt = food.createdAt.substr(0, 10);
        return createdAt === date;
      });
      return one;
    }

    console.log("today reservations: ", todayFood());
    dispatch(todayFoodList(todayFood()));
  };
}

//add food
export const addFood = (item, calories, userId, date) => {
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
      dispatch(showMessageWithTimeout("success", true, "you added a new food"));
      // dispatch(appDoneLoading());
      console.log("ate aqui", userId);
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
