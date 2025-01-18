// AppliedJobSection.tsx
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import AppliedJobsCard from "./AppliedJobsCard";

interface Job {
    id: string;
    logo: string;
    category: string;
    title: string;
    mode: string;
    employer_id: string;
    employers?: {
        logo: string;
    };
}

export default function AppliedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchUserId() {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;
                if (!user) {
                    console.error("No authenticated user found");
                    return;
                }

                const { data, error } = await supabase
                    .from("students")
                    .select("id")
                    .eq("id", user.id)
                    .single();
                
                if (error) throw error;
                if (data) {
                    console.log("Found student ID:", data.id);
                    setUserId(data.id);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        }

        fetchUserId();
    }, []);

    useEffect(() => {
        async function fetchJobs() {
            if (!userId) return;
    
            try {
                setLoading(true);
                console.log("Fetching jobs for user ID:", userId);
    
                // Fetch job applications for the user
                const { data: application, error: regError } = await supabase
                    .from("job_application")
                    .select("id, job_id") // Include `job_application` ID
                    .eq("student_id", userId);
    
                if (regError) throw regError;
    
                if (application && application.length > 0) {
                    const jobIds = application.map((reg: { job_id: string }) => reg.job_id);
    
                    // Fetch jobs based on the job IDs from applications
                    const { data: jobData, error: jobError } = await supabase
                        .from("jobs")
                        .select(`
                            id,
                            category,
                            title,
                            mode,
                            employer_id,
                            employers (
                                logo
                            )
                        `)
                        .in("id", jobIds);
    
                    if (jobError) throw jobError;
    
                    // Combine `job_application` ID with job data
                    const jobsWithApplicationId = jobData?.map((job) => {
                        const applicationEntry = application.find(
                            (app: { job_id: string }) => app.job_id === job.id
                        );
                        return {
                            ...job,
                            applicationId: applicationEntry?.id, // Add `job_application` ID
                        };
                    });
    
                    setJobs(jobsWithApplicationId || []);
                } else {
                    console.log("No registered jobs found");
                    setJobs([]);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        }
    
        if (userId) {
            fetchJobs();
        }
    }, [userId]);
    

    return (
        <div className="p-4">
            <div className="flex flex-col mb-6">
                <div className="flex flex-col mb-6">
                    <p className="text-black font-bold text-lg lg:text-3xl">Job Applications</p>
                    <p className="text-gray-600 font-semibold lg:text-lg">Manage Applied Jobs</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Applied Jobs Count Card */}
                    <div className="flex items-center justify-center bg-white shadow-md rounded-md p-6 border">
                      <div>
                        <p className="text-gray-600 font-medium text-md">Jobs Applied</p>
                        <p className="text-primary font-bold text-3xl">{jobs.length}</p>
                      </div>
                    </div>
              
                    {/* Career Page Button Card */}
                    <div className="flex items-center justify-between bg-red-50 shadow-md rounded-md p-6 w-full">
                      <div className="flex items-center gap-4">
                        {/* Icon/Image */}
                        <img
                          src="/mockImages/career_icon.png" // Replace with the correct path to the image
                          alt="Career Icon"
                          className="w-16 h-16"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold text-lg">Look for more jobs!</p>
                          <p className="text-gray-600 text-sm">
                            Unlock your potential! Join us for a rewarding career—growth, innovation, and success await.
                          </p>
                        </div>
                      </div>
                      {/* Button */}
                      <a
                        href="/careers"
                        className="bg-red-400 text-white px-3 py-2 rounded-md font-medium hover:bg-red-600"
                      >
                        Explore Career
                      </a>
                    </div>
                  </div>
                {jobs && jobs.length > 0 ? (
                    jobs.map((career, index) => (
                        <AppliedJobsCard 
                        key={index} 
                        slug={career.id} 
                        imageSrc={career.employers?.logo || "/defaultLogo.png"} 
                        category={career.category} 
                        jobTitle={career.title}
                        workMode={career.mode} 
                        applicationId={career.applicationId}
                        />
                    ))
                    ) : (
                    <p className="text-gray-500 text-center col-span-full">No jobs found.</p>
                    )}
            </div>
        </div>
    );
}