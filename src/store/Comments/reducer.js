const initialState = { loading: true, allComments: [] };

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case "comments/loadingStart":
      return { ...state, loading: action.payload };

    case "commentsList/fetched":
      return {
        loading: false,
        allComments: action.payload,
      };

    default:
      return state;
  }
}
