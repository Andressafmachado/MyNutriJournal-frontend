import { LOG_OUT, LOGIN_SUCCESS, TOKEN_STILL_VALID } from "./actions";

const initialState = {
  token: localStorage.getItem("token"),
  age: localStorage.getItem("age"),
  name: null,
  email: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("age", action.payload.age);
      console.log("localstorage", localStorage);

      return { ...state, ...action.payload };

    case LOG_OUT:
      localStorage.removeItem("token");
      localStorage.removeItem("age");
      return { ...initialState, token: null };

    case TOKEN_STILL_VALID:
      // console.log(`token still valid at reducer`, action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
