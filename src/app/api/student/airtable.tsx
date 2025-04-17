"use server";

import { Student } from "airtable-api/app/types/student/Student";
import { UpdateStudent } from "airtable-api/app/types/student/UpdateStudent";
import { base } from "../ConfigBaseAirtable";

export async function getAirtableStudents(): Promise<Student[]> {
  const records = await base<Student["fields"]>("tblXDgwMSOKmL9d1h")
    .select()
    .all();

  return records.map((record) => ({
    id: record.id,
    fields: {
      ...record.fields,
    },
  }));
}


export async function getAirtableStudentById(id: string): Promise<Student | null> {
  try {
    const record = await base("tblXDgwMSOKmL9d1h").find(id);
    return {
      id: record.id,
      fields: record.fields as Student["fields"],
    };
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    return null;
  }
}


export async function insertAirtableStudent(student: Student) {
  const { FirstName, LastName, Email } = student.fields;

  const createStudent = await base
    .table("tblXDgwMSOKmL9d1h")
    .create(
      {
        FirstName,
        LastName,
        Email,
      },
    );

  if (!createStudent.id) return {};

  return { id: createStudent.id };
}

export async function updateAirtableStudent(student: UpdateStudent) {
  const { FirstName, LastName, Email } = student.fields;

  const updateStudent = await base
    .table("tblXDgwMSOKmL9d1h")
    .update(student.id, {
      FirstName,
      LastName,
      Email,
    });

  if (!updateStudent.id) {
    console.log(updateStudent);
    return {};
  } else {
    return { id: updateStudent.id };
  }
}

export async function deleteAirtableProject(studentId: string) {
  try {
    const deletedStudent = await base
      .table("tblXDgwMSOKmL9d1h")
      .destroy([studentId]);

    if (deletedStudent) {
      return { success: true, id: studentId };
    } else {
      return { success: false, message: "Student not found or could not be deleted" };
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    return { success: false,  error};
  }
}
