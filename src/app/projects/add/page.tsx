"use client";

import { insertAirtableProject } from "airtable-api/app/api/project/airtable";
import { getAirtableStudents } from "airtable-api/app/api/student/airtable";
import { Project } from "airtable-api/app/types/Project";
import { Student } from "airtable-api/app/types/student/Student";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Projects() {
  const [Project, setProject] = useState<Project>({
    id: "",
    fields: {
      Name: "",
      Description: "",
      Technologies: [],
      Published: false,
      Promotion: "",
      Category: [],
      Students: [],
    },
  });

  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const fetchedStudents = await getAirtableStudents();
      setStudents(fetchedStudents as unknown as Student[]);
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !Project.fields.Name ||
      !Project.fields.Description ||
      !Project.fields.Promotion ||
      Project.fields.Technologies.length === 0 ||
      Project.fields.Category.length === 0
    ) {
      console.error("Tous les champs requis doivent être remplis");
      return;
    }

    const add = await insertAirtableProject(Project);
    if (!add.id) {
      console.error("Erreur lors de l'ajout du projet");
    } else {
      router.push("/projects");
    }
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudents = Array.from(event.target.selectedOptions, (option) => option.value);
    setProject({
      ...Project,
      fields: {
        ...Project.fields,
        Students: selectedStudents,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Ajouter un projet</h2>

      {[
        { label: "Name", type: "text", value: Project.fields.Name, field: "Name" },
        { label: "Description", type: "text", value: Project.fields.Description, field: "Description" },
        {
          label: "Technologies",
          type: "text",
          value: Project.fields.Technologies.join(", "),
          field: "Technologies",
        },
        { label: "Promotion", type: "text", value: Project.fields.Promotion, field: "Promotion" },
        { label: "Category", type: "text", value: Project.fields.Category.join(", "), field: "Category" },
      ].map(({ label, type, value, field }) => (
        <div key={field} style={{ marginBottom: "1.5rem" }}>
          <label htmlFor={field} style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            {label}
          </label>
          <input
            type={type}
            id={field}
            value={value}
            onChange={(e) =>
              setProject((prev) => ({
                ...prev,
                fields: {
                  ...prev.fields,
                  [field]:
                    field === "Technologies" || field === "Category"
                      ? e.target.value.split(",").map((item) => item.trim())
                      : e.target.value,
                },
              }))
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </div>
      ))}

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="Students" style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          Students
        </label>
        <select
          id="Students"
          multiple
          value={Project.fields.Students}
          onChange={handleStudentChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            height: "120px",
          }}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.fields.FirstName} {student.fields.LastName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Ajouter le projet
      </button>
    </form>
  );
}
