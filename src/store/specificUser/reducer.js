const initialState = {
  loading: true,
  user: [],
};

export default function specificUserReducer(state = initialState, action) {
  switch (action.type) {
    case "specificUser/loadingStart":
      return { ...state, loading: action.payload };

    case "specificUser/fetched":
      return {
        loading: false,
        user: action.payload,
      };

    default:
      return state;
  }
}
