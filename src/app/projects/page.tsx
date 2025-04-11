"use client";
 

import { useEffect, useState } from "react";
import { getAirtableProjects } from "../api/project/airtable";
import { Project } from "../types/Project";
 
export default function Projects() {
  const [Projects, setProjects] = useState<Project[]>([]);
 
  const getProjects = async () => {
    // Appel de l'API
    const Projects = await getAirtableProjects();
    setProjects(Projects as unknown as Project[]);
  };
 
  useEffect(() => {
    getProjects();
  }, []);
 
  return (
    <>
      <h1>Liste des projects</h1>
      {Projects.map((Project) => (
        <div key={Project.id}>
          <h2>{Project.fields.Name}</h2>
          <p>{Project.fields.Description}</p>
          <hr />
        </div>
      ))}
    </>
  );
}