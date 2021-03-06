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
    <div style={{ fontFamily: "Josefin Sans " }}>
      <div style={{ padding: "5%" }} class="d-flex bd-highlight">
        <div style={{ border: "" }} class="p-2 flex-fill bd-highlight"></div>
        <div
          style={{
            textAlign: "center",
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: 20,
          }}
          class="p-2 flex bd-highlight"
        >
          <h1
            style={{
              fontFamily: "Limelight",
              marginTop: "5%",
            }}
          >
            Welcome {`${user.name}`}
          </h1>

          <h4>You have {myPatients.length} patients</h4>
        </div>
        <div class="p-2 flex bd-highlight" style={{ marginRight: 30 }}>
          <img
            src={user.image}
            class="rounded-circle"
            alt="patientImage"
            width="auto"
            height="300"
          />
          <br />
        </div>
      </div>
      <div class="d-flex bd-highlight">
        <div class="p-2 flex-fill bd-highlight"></div>
        <div
          style={{
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: "#cfe0d8",
          }}
          class="p-2 flex-fill bd-highlight"
        >
          <div
            style={{
              // backgroundColor: "#8cbaa3",
              borderRadius: 5,
              marginBottom: 10,
            }}
            class="p-2 flex-fill bd-highlight"
          >
            <div style={{ marginLeft: "15px" }}>search for patient:</div>
            <input
              style={{ marginLeft: "15px", borderRadius: 5, border: "white" }}
              value={searchText}
              onChange={(e) => set_searchText(e.target.value)}
            />{" "}
            <button
              type="submit"
              class="btn btn-light btn-sm"
              style={{ backgroundColor: "#cfe0d8" }}
            >
              Search
            </button>
          </div>
          {found.length < 1 ? (
            <p> Patients not found</p>
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
        <div class="p-2 flex-fill bd-highlight"></div>
      </div>
      <br />
      <footer class="bg-light text-center text-lg-start">
        <div class="text-center p-3" style={{ backgroundColor: "#c5dbd3" }}>
          ?? 2021 Copyright: AndressaMachado
        </div>
      </footer>
    </div>
  );
}
