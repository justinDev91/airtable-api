"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAirtableCategoryById } from "../api/category/airtable";
import { getAirtableProjects, searchProjectsByKeyword } from "../api/project/airtable";
import { getAirtableStudentById } from "../api/student/airtable";
import { Project } from "../types/Project";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Map<string, string>>(new Map());
  const [students, setStudents] = useState<Map<string, string>>(new Map());
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const getProjects = async () => {
    const projects = await getAirtableProjects();
    setProjects(projects as unknown as Project[]);
    fetchRelatedData(projects);
  };

  const fetchRelatedData = async (projects: Project[]) => {
    const categoryMap: Map<string, string> = new Map();
    const studentMap: Map<string, string> = new Map();

    for (const project of projects) {
      for (const categoryId of project.fields.Category) {
        if (!categoryMap.has(categoryId)) {
          const category = await getAirtableCategoryById(categoryId);
          if (category) {
            categoryMap.set(categoryId, category.fields.Name);
          }
        }
      }

      for (const studentId of project.fields.Students || []) {
        if (!studentMap.has(studentId)) {
          const student = await getAirtableStudentById(studentId);
          if (student) {
            studentMap.set(studentId, `${student.fields.FirstName} ${student.fields.LastName}`);
          }
        }
      }
    }

    setCategories(categoryMap);
    setStudents(studentMap);
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      getProjects();
    } else {
      const searchedProjects = await searchProjectsByKeyword(keyword);
      setProjects(searchedProjects);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Liste des projets</h1>
      <input
        type="text"
        placeholder="Search by keyword..."
        value={searchKeyword}
        onChange={handleSearch}
        style={{
          marginBottom: "2rem",
          padding: "10px 16px",
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {projects.length === 0 ? (
        <p style={{ textAlign: "center" }}>Aucun projet trouvé avec ce mot-clé.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              border: "1px solid #eee",
            }}
          >
            <h2 style={{ marginBottom: "0.5rem" }}>
              <Link
                href={`/projects/${project.id}`}
                style={{
                  color: "#0070f3",
                  textDecoration: "underline",
                  transition: "color 0.2s",
                }}
              >
                {project.fields.Name}
              </Link>
            </h2>
            <p><strong>Description:</strong> {project.fields.Description}</p>
            <p><strong>Technologies:</strong> {project.fields.Technologies.join(", ")}</p>
            <p>
              <strong>Link:</strong>{" "}
              <a href={project.fields.Link} target="_blank" rel="noopener noreferrer">
                {project.fields.Link}
              </a>
            </p>
            <p><strong>Visuels:</strong> {project.fields.Visuels?.join(", ")}</p>
            <p><strong>Promotion:</strong> {project.fields.Promotion}</p>
            <p><strong>Last Updated:</strong> {project.fields.UpdatedAt}</p>
            <p><strong>Published:</strong> {project.fields.Published ? "Yes" : "No"}</p>
            <p><strong>Publish Date:</strong> {project.fields.PublishDate}</p>
            <p><strong>Likes:</strong> {project.fields.Likes}</p>
            <p>
              <strong>Category:</strong>{" "}
              {project.fields.Category.map((categoryId) => categories.get(categoryId) || "Unknown").join(", ")}
            </p>
            <p>
              <strong>Students:</strong>{" "}
              {project.fields.Students?.map((studentId) => students.get(studentId) || "Unknown").join(", ")}
            </p>
            <p>
              <strong>Status:</strong> {project.fields.Active === "true" ? "Active" : "Deleted"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
