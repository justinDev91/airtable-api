
export type Statistic = {
  id: string;
  fields: {
    Name: string;
    TotalProject: number; 
    TotalLike: number;
    TotalPublishedProject: number;
    TotalCategory: number;
    TotalStudent: number;
    Projects?: string[];
    Category?: string[];
    Students ?: string[];
  };
};
