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

    case "reservations/addNewReservation":
      console.log(`vc esta me vendo?`, action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
