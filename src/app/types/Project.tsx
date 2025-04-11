
export type Project = {
  id: string;
  fields: {
    Name: string;
    Description: string; 
    Technologies: string[];
    Link ?: string;
    Visuels ?: string[];
    Promotion: string;
    UpdatedAt ?: string;
    Published ?: boolean;
    PublishDate ?: string;
    Likes ?: number;
    Keywords ?: string[];
    Category: string[];
    Students ?: string[];
  };
};
