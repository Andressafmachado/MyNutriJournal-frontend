import React, { useEffect } from "react";
import "./App.css";

import { Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Loading from "./components/Loading";
import MessageBox from "./components/MessageBox";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { useDispatch, useSelector } from "react-redux";
import { selectAppLoading } from "./store/appState/selectors";
import { getUserWithStoredToken } from "./store/user/actions";
import { Jumbotron } from "react-bootstrap";
import loginDoctor from "./pages/loginDoctor";
import signupDoctor from "./pages/signupDoctor";
import MyPatients from "./pages/MyPatients";
import PlanPage from "./pages/PlanPage";
import DailyProgressPage from "./pages/DailyProgressPage";

const Home = () => (
  <Jumbotron>
    <h1>Home</h1>
  </Jumbotron>
);
const Other = () => (
  <Jumbotron>
    <h1>Other</h1>
  </Jumbotron>
);

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAppLoading);

  useEffect(() => {
    dispatch(getUserWithStoredToken());
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation />
      <MessageBox />
      {isLoading ? <Loading /> : null}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signupdoctor" component={signupDoctor} />
        <Route path="/signup" component={SignUp} />
        <Route path="/logindoctor" component={loginDoctor} />
        <Route path="/mypatients" component={MyPatients} />
        <Route path="/plan/:id" component={PlanPage} />
        <Route path="/dailyprogress" component={DailyProgressPage} />
      </Switch>
    </div>
  );
}

export default App;
