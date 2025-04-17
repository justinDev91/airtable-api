export type Student = {
  id: string;
  fields: {
    FirstName: string;
    LastName: string;
    Email: string;
    Projects?: string[];
  };
};