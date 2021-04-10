import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/user/selectors";

// import myAxios from "../axios";
// import { fetchReservations } from "../todayReservations/actions";

const apiUrl = process.env.API_URL || "//localhost:4000";
export const SET_MESSAGE = "SET_MESSAGE";

export function specificUser(data) {
  return {
    type: "specificUser/fetched",
    payload: data,
  };
}

export function fetchSpecificUser(id) {
  return async function thunk(dispatch, getState) {
    const { token } = selectUser(getState());

    const response = await axios.get(`${apiUrl}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    dispatch(specificUser(response.data));
  };
}
