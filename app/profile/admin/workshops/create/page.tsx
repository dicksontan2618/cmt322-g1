import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import AdminWorkshopCreateForm from "@/components/AdminWorkshopCreateForm";

export default async function AdminWorkshopCreatePage() {

    const supabase = await createClient();
    
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "admin") {
        return redirect("/");
    }

    return (
        <AdminWorkshopCreateForm/>
    )
}