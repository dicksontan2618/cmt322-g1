import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import EmployerProfile from "@/components/EmployerProfile";
import EmployerProfileForm from "@/components/EmployerProfileForm";

export default async function EmployerPage() {

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
        <EmployerProfile>
            <EmployerProfileForm/>
        </EmployerProfile>
    );
}