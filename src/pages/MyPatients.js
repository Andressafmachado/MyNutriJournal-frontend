import React, { useEffect } from "react";
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

  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
  }, [token, history]);

  useEffect(() => {
    dispatch(fetchMyPatients(user.id));
  }, [dispatch, user.id]);

  return (
    <div>
      <br />
      <img src={user.image} />
      <h1>Welcome {`${user.name}`}</h1> <br />
      <br />
      <div>search for patient:</div>
      <input />
      <button>Search</button>
      {!myPatients ? (
        <p> loading</p>
      ) : (
        myPatients.map((patient) => {
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
