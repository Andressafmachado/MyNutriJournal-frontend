import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import myPatientsReducer from "./myPatients/reducer";
import specificUserReducer from "./specificUser/reducer";
import foodReducer from "./Food/reducer";
import taskReducer from "./Task/reducer";

export default combineReducers({
  appState,
  user,
  myPatients: myPatientsReducer,
  specificUser: specificUserReducer,
  food: foodReducer,
  task: taskReducer,
});
