import { getSubjects } from "@/actions/practical-actions";
import { NewPracticalForm } from "@/components/NewPracticalForm";

export default async function Page() {
    const subjectsRes = await getSubjects();

    return (
        <NewPracticalForm
            subjects={subjectsRes.success && subjectsRes.data ? subjectsRes.data : []}
        />
    );
}
