import { getAirtableProjectById } from "airtable-api/app/api/project/airtable";
import Update from "../../_components/update";

type Props = {
  params: { id: string };
};

export default async function UpdateProjectRoute({ params }: Readonly<Props>) {
  const { id } = await params;

  const project = await getAirtableProjectById(id);

  if (!project) {
    return <div>Projet introuvable</div>;
  }

  return <Update project={project} />;
}