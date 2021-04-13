import { apiUrl } from "../../config/constants";
import axios from "axios";

export function allDoctorsList(data) {
  return {
    type: "allDoctors/fetched",
    payload: data,
  };
}

export function fetchAllDoctors(date, userId) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/doctors
    `);
    dispatch(allDoctorsList(response.data));
  };
}
