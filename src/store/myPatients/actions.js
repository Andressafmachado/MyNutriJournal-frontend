import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../user/selectors";

// import myAxios from "../axios";
// import { fetchReservations } from "../todayReservations/actions";

const apiUrl = process.env.API_URL || "//localhost:4000";
export const SET_MESSAGE = "SET_MESSAGE";

export function myPatientsList(data) {
  console.log("data second action", data);
  return {
    type: "myPatients/fetched",
    payload: data,
  };
}

export function fetchMyPatients(id) {
  return async function thunk(dispatch, getState) {
    const { token } = selectUser(getState());

    const response = await axios.get(`${apiUrl}/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("data first action", response.data.users);
    dispatch(myPatientsList(response.data.users));
  };
}
