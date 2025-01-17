import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import AdminWorkshopEditForm from "@/components/AdminWorkshopEditForm";

interface Params {
    slug: string;
}

export default async function AdminEditWorkshopPage({ params }: { params: Params }) {

    const param_details = await params;
    const slug = param_details.slug;

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

    const {
        data: workshopData,
        error
    } = await supabase.from("workshops").select("*").eq("id", slug).single();
    
    return (
        <AdminWorkshopEditForm workshopData={workshopData}/>
    )
}