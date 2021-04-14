import React, { useEffect, useState } from "react";
import { selectUser, selectToken } from "../store/user/selectors";
import { useSelector, useDispatch } from "react-redux";
import PatientCart from "../components/PatientCart";
import { selectMyPatients } from "../store/myPatients/selectors";
import { fetchMyPatients } from "../store/myPatients/actions";
import { Link, useHistory } from "react-router-dom";

export default function MyPatients() {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const myPatients = useSelector(selectMyPatients);
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchText, set_searchText] = useState("");
  const [state, setState] = useState(myPatients);
  console.log("mystate", state);

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [token, history]);

  useEffect(() => {
    dispatch(fetchMyPatients(user.id));
  }, [dispatch, user.id]);

  const found = myPatients.filter(function (patient) {
    if (patient.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
  });
  console.log("found", found);

  const navigateToSearch = (e) => {
    e.preventDefault();
    const routeParam = encodeURIComponent(searchText);
    // history.push(`/searchpage/${routeParam}`);
    console.log(searchText);
  };

  return (
    <div>
      <br />
      <img src={user.image} />
      <h1>Welcome {`${user.name}`}</h1> <br />
      <br />
      <div>search for patient:</div>
      <input
        value={searchText}
        onChange={(e) => set_searchText(e.target.value)}
      />
      <button type="submit">Search</button>
      {found?.length < 1 ? (
        <p> Patients not found!</p>
      ) : (
        found.map((patient) => {
          return (
            <div key={patient.id}>
              <Link to={`./plan/${patient.id}`}>
                <PatientCart patient={patient} />
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}
