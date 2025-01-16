import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import EmployerJobCreateForm from "@/components/EmployerJobCreateForm";

export default async function EmployerJobCreatePage() {

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

    return (
        <EmployerJobCreateForm/>
    )
}