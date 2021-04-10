const initialState = {
  loading: true,
  patients: [],
};

export default function allPatientsReducer(state = initialState, action) {
  switch (action.type) {
    case "myPatients/loadingStart":
      return { ...state, loading: action.payload };

    case "myPatients/fetched":
      console.log("reducer", action.payload);
      return {
        loading: false,
        patients: action.payload,
      };

    // case "reservations/addNewReservation":
    //   return { ...state, ...action.payload };

    default:
      return state;
  }
}
