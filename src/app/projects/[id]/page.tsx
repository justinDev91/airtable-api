import { getAirtableProjectById } from "airtable-api/app/api/project/airtable";
import { notFound } from "next/navigation";
import DetailPage from "../_components/detail";

type Props = {
  params: { id: string };
};

export default async function ProjectDetailPage({ params }: Readonly<Props>) {
  const { id } = await params;
  const project = await getAirtableProjectById(id);

  if (!project) return notFound();

  return <DetailPage project={project} />;
}