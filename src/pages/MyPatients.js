import React, { useEffect } from "react";
import { selectUser } from "../store/user/selectors";
import { useSelector, useDispatch } from "react-redux";
import PatientCart from "../components/PatientCart";
import { selectMyPatients } from "../store/myPatients/selectors";
import { fetchMyPatients } from "../store/myPatients/actions";
import { Link } from "react-router-dom";

export default function MyPatients() {
  const user = useSelector(selectUser);
  const myPatients = useSelector(selectMyPatients);
  const dispatch = useDispatch();
  console.log(`mypatients`, myPatients);
  console.log(`user`, user);

  useEffect(() => {
    dispatch(fetchMyPatients(user.id));
  }, [dispatch, user.id]);

  return (
    <div>
      <br />
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
