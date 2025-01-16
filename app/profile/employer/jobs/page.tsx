import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import Link from "next/link"
import JobVacancyCard from "@/components/JobVacancyCard";

export default async function EmployerJobPage() {

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
        data: jobs,
        error
    } = await supabase.from("jobs").select("*").eq("employer_id", user.id);

    return (
        <div className="px-8 mb-8 lg:px-16 lg:py-8">
            <div className="flex flex-col mb-6">
                <p className="text-black font-bold text-lg lg:text-3xl">Manage Job</p>
                <p className="text-gray-600 font-semibold lg:text-lg">Add new / Manage posted vacancy</p>
                
            </div>
            <Link href="/profile/employer/jobs/create">
                <Button variant="secondary" className="text-white">
                    Create New Job Posting <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </Link>
            <p className="text-gray-600 font-semibold my-4 lg:mt-8">Posted Job</p>
            <div className="flex flex-col gap-4">
                {jobs && jobs.map((job, index) => (
                    <JobVacancyCard key={index} slug={job.id} jobTitle={job.title} workMode={job.mode} category={job.category}/>
                ))}
            </div>
        </div>
    )
}