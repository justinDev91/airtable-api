"use client";

import { toggleDeleteAirtableProject } from "airtable-api/app/api/project/airtable";
import { Project } from "airtable-api/app/types/Project";
import { useRouter } from "next/navigation";

export default function DetailPage({ project }: Readonly<{ project: Project }>) {
  const router = useRouter();
  const { id, fields } = project;
  const {
    Name,
    Description,
    Technologies,
    Link,
    Promotion,
    Published,
    PublishDate,
    Likes,
    Visuels,
    Active = true,
  } = fields;

  const handleToggleDelete = async () => {
    const action = Active ? "delete" : "restore";
    const confirmed = window.confirm(`Are you sure you want to ${action} this project?`);
    if (!confirmed) return;

    try {
      const response = await toggleDeleteAirtableProject(id);
      if (response.success) {
        alert(response.message);
        router.push(`/projects`);
      } else {
        alert("Action failed: " + (response.message || ""));
      }
    } catch (error) {
      console.error("Toggle delete error:", error);
      alert("An error occurred while updating the project.");
    }
  };

  const handleUpdate = () => {
    router.push(`/projects/${id}/update`);
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>{Name}</h1>

      <p style={{ marginBottom: "1rem" }}>
        <strong>Description:</strong> <br /> {Description}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Technologies:</strong> {Technologies?.join(", ")}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Link:</strong>{" "}
        <a href={Link} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3" }}>
          {Link}
        </a>
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Visuels:</strong>{" "}
        {Visuels?.length ? (
          Visuels.map((visuel, i) => (
            <span key={i}>
              <a href={visuel} target="_blank" rel="noopener noreferrer" style={{ color: "#0070f3" }}>
                {`Image ${i + 1}`}
              </a>
              {i < Visuels.length - 1 && ", "}
            </span>
          ))
        ) : (
          "N/A"
        )}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Promotion:</strong> {Promotion}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Published:</strong> {Published ? "Yes" : "No"}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Publish Date:</strong> {PublishDate}
      </p>

      <p style={{ marginBottom: "0.75rem" }}>
        <strong>Likes:</strong> ❤️ {Likes}
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={handleToggleDelete}
          style={{
            padding: "12px 24px",
            backgroundColor: Active ? "#e63946" : "#2a9d8f",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {Active ? "Delete Project" : "Restore Project"}
        </button>

        <button
          onClick={handleUpdate}
          style={{
            padding: "12px 24px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Update Project
        </button>
      </div>
    </div>
  );
}
