const initialState = { loading: true, myDoctor: [] };

export default function allDoctorsReducer(state = initialState, action) {
  switch (action.type) {
    case "myDoctor/loadingStart":
      return { ...state, loading: action.payload };

    case "myDoctor/fetched":
      return {
        loading: false,
        myDoctor: action.payload,
      };

    default:
      return state;
  }
}
