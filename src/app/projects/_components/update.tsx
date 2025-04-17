"use client";

import { getAirtableCategories } from "airtable-api/app/api/category/airtable";
import { updateAirtableProject } from "airtable-api/app/api/project/airtable";
import { getAirtableStudents } from "airtable-api/app/api/student/airtable";
import { Category } from "airtable-api/app/types/category/Category";
import { Student } from "airtable-api/app/types/student/Student";
import { UpdateProject } from "airtable-api/app/types/UpdateProject";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Update({ project }: Readonly<{ project: UpdateProject }>) {
  const [currentProject, setCurrentProject] = useState<UpdateProject>(project);
  const [categories, setCategories] = useState<Category[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoriesAndStudents = async () => {
      const fetchedCategories = await getAirtableCategories();
      const fetchedStudents = await getAirtableStudents();
      setCategories(fetchedCategories as unknown as Category[]);
      setStudents(fetchedStudents as unknown as Student[]);
    };
    fetchCategoriesAndStudents();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { Name, Description } = currentProject.fields;
    if (!Name || !Description) {
      console.error("Tous les champs requis doivent être remplis");
      return;
    }

    const updated = await updateAirtableProject(currentProject);
    if (!updated.id) {
      console.error("Erreur lors de la mise à jour du projet");
    } else {
      router.push("/projects");
    }
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudents = Array.from(event.target.selectedOptions, (option) => option.value);
    setCurrentProject({
      ...currentProject,
      fields: {
        ...currentProject.fields,
        Students: selectedStudents,
      },
    });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategories = Array.from(event.target.selectedOptions, (option) => option.value);
    setCurrentProject({
      ...currentProject,
      fields: {
        ...currentProject.fields,
        Category: selectedCategories,
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "720px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#fefefe",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Mettre à jour un projet</h2>

      {[
        { label: "Name", type: "text", field: "Name", value: currentProject.fields.Name },
        { label: "Description", type: "text", field: "Description", value: currentProject.fields.Description || "" },
        {
          label: "Technologies",
          type: "text",
          field: "Technologies",
          value: currentProject.fields.Technologies?.join(", ") || "",
        },
        { label: "Link", type: "url", field: "Link", value: currentProject.fields.Link || "" },
        {
          label: "Visuels (URLs, comma separated)",
          type: "text",
          field: "Visuels",
          value: currentProject.fields.Visuels?.join(", ") || "",
        },
        { label: "Promotion", type: "text", field: "Promotion", value: currentProject.fields.Promotion || "" },
      ].map(({ label, type, field, value }) => (
        <div key={field} style={{ marginBottom: "1.5rem" }}>
          <label htmlFor={field} style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            {label}
          </label>
          <input
            type={type}
            id={field}
            value={value}
            onChange={(e) =>
              setCurrentProject((prev) => ({
                ...prev,
                fields: {
                  ...prev.fields,
                  [field]:
                    field === "Technologies" || field === "Visuels"
                      ? e.target.value.split(",").map((v) => v.trim())
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
        <label htmlFor="Published" style={{ fontWeight: 600, marginRight: "1rem" }}>
          Published
        </label>
        <input
          type="checkbox"
          id="Published"
          checked={currentProject.fields.Published || false}
          onChange={(e) =>
            setCurrentProject({
              ...currentProject,
              fields: { ...currentProject.fields, Published: e.target.checked },
            })
          }
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="PublishDate" style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          Publish Date
        </label>
        <input
          type="date"
          id="PublishDate"
          value={currentProject.fields.PublishDate || ""}
          onChange={(e) =>
            setCurrentProject({
              ...currentProject,
              fields: { ...currentProject.fields, PublishDate: e.target.value },
            })
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

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="Category" style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          Category
        </label>
        <select
          id="Category"
          multiple
          value={currentProject.fields.Category || []}
          onChange={handleCategoryChange}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.fields.Name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="Students" style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          Students
        </label>
        <select
          id="Students"
          multiple
          value={currentProject.fields.Students || []}
          onChange={handleStudentChange}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
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
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Mettre à jour le projet
      </button>
    </form>
  );
}
