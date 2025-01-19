import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import EmployerJobEditForm from "@/components/EmployerJobEditForm";

// interface Params {
//     slug: string;
// }

type Params = Promise<{ slug: string }>;

export default async function EditJobPage({ params }: { params: Params }) {

    const param_details = await params;
    const slug = param_details.slug;

    const supabase = await createClient();
        
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "employer") {
        return redirect("/");
    }

    const {
        data: jobData,
        error
    } = await supabase.from("jobs").select("*").eq("id", slug).single();

    return (
        <EmployerJobEditForm jobData={jobData}/>
    )
}