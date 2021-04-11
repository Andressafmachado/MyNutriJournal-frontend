const initialState = { loading: true, allFood: [] };

export default function foodReducer(state = initialState, action) {
  switch (action.type) {
    case "foods/loadingStart":
      return { ...state, loading: action.payload };

    case "todayFoods/fetched":
      return {
        loading: false,
        allFood: action.payload,
      };

    case "foods/addNewFood":
      console.log(`at food/reducer`, action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
