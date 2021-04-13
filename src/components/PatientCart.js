import React from "react";

export default function PatientCart(patient) {
  return (
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
  );
}
