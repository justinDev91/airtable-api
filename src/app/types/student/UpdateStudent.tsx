export type UpdateStudent = {
  id: string;
  fields: {
    FirstName ?: string;
    LastName ?: string;
    Email?: string;
    Projects?: string[]; 
  };
};