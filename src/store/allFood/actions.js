import { apiUrl } from "../../config/constants";
import axios from "axios";

export function allFoodList(data) {
  return {
    type: "allFoods/fetched",
    payload: data,
  };
}

export function fetchAllFoods(date, userId) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/users/${userId}/food
    `);
    const newdate = date;
    const allFood = response.data;
    function specificDayFood() {
      const food = allFood.filter((food) => {
        const createdAt = food.createdAt.substr(0, 10);
        return createdAt === date;
      });

      return food;
    }

    dispatch(allFoodList(specificDayFood()));
  };
}
