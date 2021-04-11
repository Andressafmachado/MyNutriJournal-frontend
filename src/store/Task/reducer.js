const initialState = { loading: true, allTasks: [] };

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case "tasks/loadingStart":
      return { ...state, loading: action.payload };

    case "tasksList/fetched":
      return {
        loading: false,
        allTasks: action.payload,
      };

    // case "reservations/addNewReservation":
    //   console.log(`vc esta me vendo?`, action.payload);
    //   return { ...state, ...action.payload };

    default:
      return state;
  }
}
