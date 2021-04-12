const initialState = { loading: true, allFood: [] };

export default function allFoodReducer(state = initialState, action) {
  switch (action.type) {
    case "foods/loadingStart":
      return { ...state, loading: action.payload };

    case "allFoods/fetched":
      return {
        loading: false,
        allFood: action.payload,
      };

    default:
      return state;
  }
}
