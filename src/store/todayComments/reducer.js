const initialState = { loading: true, todayComments: [] };

export default function todayCommentsReducer(state = initialState, action) {
  switch (action.type) {
    case "todayComments/loadingStart":
      return { ...state, loading: action.payload };

    case "todayCommentsList/fetched":
      return {
        loading: false,
        todayComments: action.payload,
      };

    default:
      return state;
  }
}
