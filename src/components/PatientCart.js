import React from "react";
import Container from "react-bootstrap/Container";

export default function PatientCart(patient) {
  return (
    <div
      style={{
        border: "solid  #8cbaa3 1px",
        padding: 10,
        margin: 5,
        color: "black",
      }}
    >
      {" "}
      <h3>
        {" "}
        <img
          src={patient.patient.image}
          class="rounded-circle"
          alt="patientImage"
          width="auto"
          height="100"
        />{" "}
        {patient.patient.name}
      </h3>
    </div>
  );
}
