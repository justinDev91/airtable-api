"use server";

import { Statistic } from "airtable-api/app/types/Statistic";
import { base } from "../ConfigBaseAirtable";


export async function getAirtableStatistic(): Promise<Statistic[]> {
  const records = await base<Statistic["fields"]>("tblvFDDgpNfXwV9dt")
    .select()
    .all();

  return records.map((record) => ({
    id: record.id,
    fields: {
      ...record.fields,
    },
  }));
}