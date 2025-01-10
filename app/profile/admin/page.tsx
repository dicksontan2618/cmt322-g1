import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {

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
        <p>Admin Page</p>
    );
}