"use server";

import { Project } from "../../types/Project";
import { UpdateProject } from "../../types/UpdateProject";
import { base } from "../ConfigBaseAirtable";


export async function getAirtableProjects(): Promise<Project[]> {
  const records = await base<Project["fields"]>("tblRS0XAzWR6rvn6o")
    .select()
    .all();

  return records.map((record) => ({
    id: record.id,
    fields: {
      ...record.fields,
    },
  }));
}

export async function insertAirtableProject(project: Project) {

  const {Name, Description,Technologies, Promotion, Category } = project.fields

  const createProject = await base.table("tblRS0XAzWR6rvn6o").create({
    Name,
    Description,
    Technologies,
    Promotion,
    Category,
  }, {typecast: true});

  if (!createProject.id) return {};

  return { id: createProject.id };
}


export async function updateAirtableProject(project: UpdateProject) {
  const {
    Name, 
    Description,
    Technologies, 
    Link, Visuels, 
    Promotion, 
    Published, 
    PublishDate, 
    Likes, 
    Category, 
    Students } = project.fields


  const updateProject = await base
  .table("tblRS0XAzWR6rvn6o")
  .update(project.id, {
    Name,
    Description,
    Technologies,
    Link,
    Visuels,
    Promotion,
    Published,  
    PublishDate,
    Likes,
    Category,  
    Students,
    
  }, {typecast: true});
 
  if (!updateProject.id) {
    console.log(updateProject);
    return {};
  } else {
    return { id: updateProject.id };
  }
}

export async function deleteAirtableProject(projectId: string) {
  try {
    const deletedProject = await base
      .table("tblRS0XAzWR6rvn6o")
      .destroy([projectId]);

    if (deletedProject) {
      return { success: true, id: projectId };
    } else {
      return { success: false, message: "Project not found or could not be deleted" };
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false,  error};
  }
}
