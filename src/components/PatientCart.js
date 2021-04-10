import React from "react";

export default function PatientCart(patient) {
  return (
    <div
      style={{
        border: "solid",
        width: "200px",
        padding: 20,
        margin: 20,
      }}
    >
      {" "}
      {patient.patient.name}
    </div>
  );
}
