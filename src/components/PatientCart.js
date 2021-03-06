import React from "react";
import Container from "react-bootstrap/Container";

export default function PatientCart(patient) {
  return (
    <div
      style={{
        border: "solid  #8cbaa3 2px",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: "black",
        backgroundColor: "white",
      }}
    >
      {" "}
      <h5>
        {" "}
        <img
          src={patient.patient.image}
          class="rounded-circle"
          alt="patientImage"
          width="auto"
          height="100"
        />{" "}
        {patient.patient.name}
      </h5>
    </div>
  );
}
