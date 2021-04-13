const initialState = { loading: true, allDoctors: [] };

export default function allDoctorsReducer(state = initialState, action) {
  switch (action.type) {
    case "allDoctors/loadingStart":
      return { ...state, loading: action.payload };

    case "allDoctors/fetched":
      return {
        loading: false,
        allDoctors: action.payload,
      };

    default:
      return state;
  }
}
