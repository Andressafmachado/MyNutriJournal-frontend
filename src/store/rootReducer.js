import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import myPatientsReducer from "./myPatients/reducer";
import specificUserReducer from "./specificUser/reducer";
import foodReducer from "./Food/reducer";
import taskReducer from "./Task/reducer";
import completedTasksReducer from "./completedTasks/reducer";
import allFoodReducer from "./allFood/reducer";
import allDoctorsReducer from "./allDoctors/reducer";
import myDoctorReducer from "./myDoctor/reducer";
import commentsReducer from "./Comments/reducer";
import todayCommentsReducer from "./todayComments/reducer";

export default combineReducers({
  appState,
  user,
  myPatients: myPatientsReducer,
  specificUser: specificUserReducer,
  food: foodReducer,
  task: taskReducer,
  completedTasks: completedTasksReducer,
  allFood: allFoodReducer,
  allDoctors: allDoctorsReducer,
  myDoctor: myDoctorReducer,
  comments: commentsReducer,
  todayComments: todayCommentsReducer,
});
