import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import StudentProfile from "@/components/StudentProfile";

export default async function StudentPage() {

    const supabase = await createClient();

    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "student") {
        return redirect("/");
    }

    return (
        <StudentProfile/>
    );
}
