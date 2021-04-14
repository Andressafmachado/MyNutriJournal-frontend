import React from "react";
import Container from "react-bootstrap/Container";

export default function PatientCart(patient) {
  return (
    <Container>
      <div
        style={{
          border: "solid",
          width: "300px",
          padding: 20,
          margin: 20,
        }}
      >
        {" "}
        <img
          src={patient.patient.image}
          class="rounded-circle"
          alt="patientImage"
          width="75"
          height="75"
        />{" "}
        {patient.patient.name}
      </div>
    </Container>
  );
}
