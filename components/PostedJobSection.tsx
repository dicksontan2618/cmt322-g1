import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from "react";
import Link from "next/link";
import JobVacancyCard from "@/components/JobVacancyCard";
import { useRouter } from "next/navigation";

export default function PostedJobSection() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            // Create Supabase client for browser
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            
            const { data: userData } = await supabase.from("profiles").select("*").single();
            
            if (!userData) {
                router.push("/sign-in");
                return;
            }
            
            if (userData.role !== "employer") {
                router.push("/");
                return;
            }
            
            setUser(userData);
            
            const { data: jobData } = await supabase.from("jobs").select("*").eq("employer_id", userData.id);
            setJobs(jobData || []);
        };
        
        fetchData();
    }, [router]);

    return (
        <div className="px-8 mb-8 lg:px-16 lg:py-8">
            <div className="flex flex-col mb-6">
                <p className="text-black font-bold text-lg lg:text-3xl">Manage Job</p>
                <p className="text-gray-600 font-semibold lg:text-lg">Add new / Manage posted vacancy</p>
            </div>
            <Link href="/profile/employer/jobs/create">
                <Button variant="secondary" className="text-white">
                    Create New Job Posting <FontAwesomeIcon icon={faPlus} />
                </Button>
            </Link>
            <p className="text-gray-600 font-semibold my-4 lg:mt-8">Posted Job</p>
            <div className="flex flex-col gap-4">
                {jobs && jobs.map((job, index) => (
                    <JobVacancyCard key={index} slug={job.id} jobTitle={job.title} workMode={job.mode} category={job.category} />
                ))}
            </div>
        </div>
    );
}
