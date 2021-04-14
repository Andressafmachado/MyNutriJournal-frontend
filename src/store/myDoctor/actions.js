import { apiUrl } from "../../config/constants";
import axios from "axios";

export function myDoctor(data) {
  return {
    type: "myDoctor/fetched",
    payload: data,
  };
}

export function fetchMyDoctor(id) {
  return async function thunk(dispatch, getState) {
    const response = await axios.get(`${apiUrl}/doctors/${id}
    `);
    dispatch(myDoctor(response.data));
  };
}
