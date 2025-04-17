
export type UpdateProject = {
  id: string;
  fields: {
    Name: string;
    Description: string; 
    Technologies?: string[];
    Link?: string;
    Visuels?: string[];
    Promotion?: string;
    Published?: boolean;
    PublishDate?: string;
    Likes?: number;
    Category?: string[];
    Students?: string[];
    AdminComment?: string
  };
};
