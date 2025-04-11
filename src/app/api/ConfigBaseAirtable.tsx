import Airtable from "airtable";

export const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY!,
}).base("appvwu62787en4nVT");

