"use client";

import { insertAirtableStudent } from "airtable-api/app/api/student/airtable";
import { Student } from "airtable-api/app/types/student/Student";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AddStudent() {
  const [student, setStudent] = useState<Student>({
    id: "",
    fields: {
      FirstName: "",
      LastName: "",
      Email: "",
    },
  });

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { FirstName, LastName, Email } = student.fields;

    if (!FirstName || !LastName || !Email) {
      console.error("Tous les champs sont requis");
      return;
    }

    const added = await insertAirtableStudent(student);

    if (!added.id) {
      console.error("Erreur lors de l'ajout de l'étudiant");
    } else {
      router.push("/students");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem", textAlign: "center" }}>
        Ajouter un étudiant
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label htmlFor="FirstName" style={{ display: "block", marginBottom: "0.25rem" }}>Prénom</label>
          <input
            type="text"
            id="FirstName"
            value={student.fields.FirstName}
            onChange={(e) =>
              setStudent({
                ...student,
                fields: { ...student.fields, FirstName: e.target.value },
              })
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label htmlFor="LastName" style={{ display: "block", marginBottom: "0.25rem" }}>Nom</label>
          <input
            type="text"
            id="LastName"
            value={student.fields.LastName}
            onChange={(e) =>
              setStudent({
                ...student,
                fields: { ...student.fields, LastName: e.target.value },
              })
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label htmlFor="Email" style={{ display: "block", marginBottom: "0.25rem" }}>Email</label>
          <input
            type="email"
            id="Email"
            value={student.fields.Email}
            onChange={(e) =>
              setStudent({
                ...student,
                fields: { ...student.fields, Email: e.target.value },
              })
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            backgroundColor: "#0070f3",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0059c1")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
