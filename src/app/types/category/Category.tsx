
export type Category = {
  id: string;
  fields: {
    Name: string;
    Description: string; 
    Project?: string[];
    Statistic ?: string[];
  };
};
