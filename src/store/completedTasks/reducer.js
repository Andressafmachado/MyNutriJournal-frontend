const initialState = { loading: true, completedTasks: [] };

export default function completedTasksReducer(state = initialState, action) {
  switch (action.type) {
    case "completedTasks/loadingStart":
      return { ...state, loading: action.payload };

    case "completedTasksList/fetched":
      return {
        loading: false,
        completedTasks: action.payload,
      };

    // case "reservations/addNewReservation":
    //   console.log(`vc esta me vendo?`, action.payload);
    //   return { ...state, ...action.payload };

    default:
      return state;
  }
}
