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

export async function getAirtableProjectById(id: string): Promise<Project | null> {
  try {
    const record = await base("tblRS0XAzWR6rvn6o").find(id);
    return {
      id: record.id,
      fields: record.fields as Project["fields"],
    };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
}

export async function insertAirtableProject(project: Project) {

  const {Name, Description,Technologies, Promotion, Category, Students} = project.fields

  const createProject = await base.table("tblRS0XAzWR6rvn6o").create({
    Name,
    Description,
    Technologies,
    Promotion,
    Category,
    Students,
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
    Students,
    AdminComment,
   } = project.fields


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
    AdminComment
  }, {typecast: true});
 
  if (!updateProject.id) {
    console.log(updateProject);
    return {};
  } else {
    return { id: updateProject.id };
  }
}

export async function toggleDeleteAirtableProject(projectId: string) {
  try {
    const project = await base.table("tblRS0XAzWR6rvn6o").find(projectId);

    if (!project) {
      return { success: false, message: "Project not found" };
    }

    const currentStatus = typeof project.fields.active === "string" 
      ? project.fields.active.toLowerCase() === "true" 
      : true;

    const newStatus = !currentStatus;

    const updatedProject = await base.table("tblRS0XAzWR6rvn6o").update(projectId, {
      Active: newStatus.toString(),
    }, {typecast: true});

    if (updatedProject) {
      return {
        success: true,
        id: projectId,
        newStatus: newStatus.toString(),
        message: newStatus ? "Project restored" : "Project deleted",
      };
    } else {
      return { success: false, message: "Project update failed" };
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error };
  }
}



export async function searchProjectsByKeyword(keyword: string): Promise<Project[]> {
  try {
    const formula = `SEARCH("${keyword}", {Keywords})`;

    const records = await base<Project["fields"]>("tblRS0XAzWR6rvn6o")
      .select({
        filterByFormula: formula,
      })
      .all();

    return records.map((record) => ({
      id: record.id,
      fields: {
        ...record.fields,
      },
    }));
  } catch (error) {
    console.error("Error searching projects by keyword:", error);
    return [];
  }
}