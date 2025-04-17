"use client";

import { useEffect, useState } from "react";
import { getAirtableCategories } from "../api/category/airtable"; // Adjust path
import { Category } from "../types/category/Category";

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAirtableCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Liste des catégories</h1>
      {categories.length === 0 ? (
        <p>Aucune catégorie disponible.</p>
      ) : (
        categories.map((category) => (
          <div key={category.id}>
            <h2>{category.fields.Name}</h2>
            <p>{category.fields.Description}</p>
            <p>Projects: {category.fields.Project?.join(", ")}</p>
            <p>Statistics: {category.fields.Statistic?.join(", ")}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
