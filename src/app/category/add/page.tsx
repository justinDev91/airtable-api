"use client";

import { insertAirtableCategory } from "airtable-api/app/api/category/airtable";
import { Category } from "airtable-api/app/types/category/Category";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AddCategory() {
  const [category, setCategory] = useState<Category>({
    id: "",
    fields: {
      Name: "",
      Description: "",
      Project: [],
      Statistic: [],
    },
  });

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { Name, Description } = category.fields;

    if (!Name || !Description) {
      console.error("Le nom et la description de la catégorie sont requis");
      return;
    }

    const added = await insertAirtableCategory(category);

    if (!added.id) {
      console.error("Erreur lors de l'ajout de la catégorie");
    } else {
      router.push("/categories");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une catégorie</h2>

      <label htmlFor="Name">Nom</label>
      <input
        type="text"
        id="Name"
        value={category.fields.Name}
        onChange={(e) =>
          setCategory({
            ...category,
            fields: { ...category.fields, Name: e.target.value },
          })
        }
      />
      <br />

      <label htmlFor="Description">Description</label>
      <input
        type="text"
        id="Description"
        value={category.fields.Description}
        onChange={(e) =>
          setCategory({
            ...category,
            fields: { ...category.fields, Description: e.target.value },
          })
        }
      />
      <br />

      <button type="submit">Ajouter</button>
    </form>
  );
}
