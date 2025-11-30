import { getPracticalById } from "@/actions/practical-actions";
import { PracticalDetail } from "@/components/PracticalDetail";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getPracticalById(id);

    if (!res.success || !res.data) {
        notFound();
    }

    return <PracticalDetail practical={res.data} />;
}
