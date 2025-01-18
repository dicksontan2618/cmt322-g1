import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import StudentProfile from "@/components/StudentProfile";
import StudentProfileForm from "@/components/StudentProfileForm";

export default async function StudentPage() {

    const supabase = await createClient();

    // get user details from Supabase "profiles" table
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    // if user not found(authenticated), redirect to sign-in page
    if (!user) {
        return redirect("/sign-in");
    }

    // if user is not a student, redirect to home page
    if (user.role !== "student") {
        return redirect("/");
    }

    return (
        <StudentProfile>
            <StudentProfileForm />
        </StudentProfile>
    );
}