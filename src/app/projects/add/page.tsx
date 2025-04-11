"use client";

import { insertAirtableProject } from "airtable-api/app/api/project/airtable";
import { Project } from "airtable-api/app/types/Project";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    },
  });
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!Project.fields.Name || !Project.fields.Description || !Project.fields.Promotion || Project.fields.Technologies.length === 0 || Project.fields.Category.length === 0) {
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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="Name">Name</label>
      <input
        type="text"
        id="Name"
        value={Project.fields.Name}
        onChange={(e) =>
          setProject({
            ...Project,
            fields: { ...Project.fields, Name: e.target.value },
          })
        }
      />
      <br />
      
      <label htmlFor="Description">Description</label>
      <input
        type="text"
        id="Description"
        value={Project.fields.Description}
        onChange={(e) =>
          setProject({
            ...Project,
            fields: { ...Project.fields, Description: e.target.value },
          })
        }
      />
      <br />

      <label htmlFor="Technologies">Technologies</label>
      <input
        type="text"
        id="Technologies"
        value={Project.fields.Technologies.join(", ")}
        onChange={(e) => 
          setProject({
            ...Project,
            fields: {
              ...Project.fields,
              Technologies: e.target.value.split(",").map((tech) => tech.trim()), 
            },
          })
        }
      />
      <br />

      <label htmlFor="Promotion">Promotion</label>
      <input
        type="text"
        id="Promotion"
        value={Project.fields.Promotion}
        onChange={(e) =>
          setProject({
            ...Project,
            fields: { ...Project.fields, Promotion: e.target.value },
          })
        }
      />
      <br />

      <label htmlFor="Category">Category</label>
      <input
        type="text"
        id="Category"
        value={Project.fields.Category.join(", ")} 
        onChange={(e) =>
          setProject({
            ...Project,
            fields: {
              ...Project.fields,
              Category: e.target.value.split(",").map((cat) => cat.trim()), 
            },
          })
        }
      />
      <br />

      <button type="submit">Ajouter</button>
    </form>
  );
}
