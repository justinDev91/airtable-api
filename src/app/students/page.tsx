"use client";

import { useEffect, useState } from "react";
import { getAirtableStudents } from "../api/student/airtable";
import { Student } from "../types/student/Student";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getAirtableStudents();
      setStudents(students);
    };
    fetchStudents();
  }, []);

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "2rem auto",
        padding: "2rem",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
        Liste des étudiants
      </h1>

      {students.length === 0 ? (
        <p style={{ textAlign: "center" }}>Chargement des étudiants...</p>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              {student.fields.FirstName} {student.fields.LastName}
            </h2>

            {student.fields.Email && (
              <p style={{ margin: "0.25rem 0", color: "#555" }}>
                <strong>Email :</strong> {student.fields.Email}
              </p>
            )}

            {student.fields.Projects && student.fields.Projects.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 600 }}>Projets associés :</p>
                <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
                  {student.fields.Projects.map((projectId: string) => (
                    <li key={projectId} style={{ color: "#333" }}>
                      {projectId}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
