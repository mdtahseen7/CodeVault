import { getPracticals, getSubjects } from "@/actions/practical-actions";
import { Dashboard } from "@/components/Dashboard";

export default async function Page() {
  const practicalsRes = await getPracticals();
  const subjectsRes = await getSubjects();

  return (
    <Dashboard
      initialPracticals={practicalsRes.success && practicalsRes.data ? practicalsRes.data : []}
      subjects={subjectsRes.success && subjectsRes.data ? subjectsRes.data : []}
    />
  );
}
