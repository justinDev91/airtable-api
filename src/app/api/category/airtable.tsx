"use server";

import { Category } from "airtable-api/app/types/category/Category";
import { base } from "../ConfigBaseAirtable";


export async function getAirtableCategories(): Promise<Category[]> {
  const records = await base<Category["fields"]>("tblRS0XAzWR6rvn6o")
    .select()
    .all();

  return records.map((record) => ({
    id: record.id,
    fields: {
      ...record.fields,
    },
  }));
}


export async function getAirtableCategoryById(id: string): Promise<Category | null> {
  try {
    const record = await base("tblRS0XAzWR6rvn6o").find(id);
    return {
      id: record.id,
      fields: record.fields as Category["fields"],
    };
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}

export async function insertAirtableCategory(category: Category) {
  const { Name, Description } = category.fields;

  const createCategory = await base.table("tblRS0XAzWR6rvn6o").create({
    Name,
    Description
  }, { typecast: true });

  if (!createCategory.id) return {};

  return { id: createCategory.id };
}

export async function updateAirtableCategory(category: Category) {
  const { Name, Description} = category.fields;

  const updateCategory = await base
    .table("tblRS0XAzWR6rvn6o")
    .update(category.id, {
      Name,
      Description
    }, { typecast: true });

  if (!updateCategory.id) {
    console.log(updateCategory);
    return {};
  } else {
    return { id: updateCategory.id };
  }
}

export async function deleteAirtableCategory(categoryId: string) {
  try {
    const deletedCategory = await base
      .table("tblRS0XAzWR6rvn6o")
      .destroy([categoryId]);

    if (deletedCategory) {
      return { success: true, id: categoryId };
    } else {
      return { success: false, message: "Category not found or could not be deleted" };
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error };
  }
}

