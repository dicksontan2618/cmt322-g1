import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr"; // Import the Supabase client
import CareerCard from "./CareerCard"; // Assuming CareerCard is already imported

interface Job {
  id: string;
  category: string;
  title: string;
  mode: string;
  employer_id: string;
  employers?: Array<{
    logo: string;
    name: string;
  }>;
}

export default function SavedJobs() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]); // State to track bookmarked jobs
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Create the Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      const savedJobSlugs = localStorage.getItem("bookmarkedJobs");

      if (savedJobSlugs) {
        const jobSlugs: string[] = JSON.parse(savedJobSlugs); // Array of job slugs (IDs)

        // Log the jobSlugs to ensure it's correct
        console.log("Fetched job slugs:", jobSlugs);

        setLoading(true); // Set loading to true while fetching jobs

        try {
          // Query Supabase to fetch job details using the slugs
          const { data, error } = await supabase
            .from("jobs") // Assuming the job data is stored in the 'jobs' table
            .select("id, title, category, mode, employer_id, employers ( logo, name )") // Select relevant job details
            .in("id", jobSlugs); // Filter jobs based on the slugs (IDs)

          if (error) {
            throw error; // Handle error if any occurs
          }

          if (data) {
            const transformedJobs = data.map(job => ({
              id: job.id,
              category: job.category,
              title: job.title,
              mode: job.mode,
              employer_id: job.employer_id,
              employers: job.employers
            }));
            setBookmarkedJobs(transformedJobs);
          }
        } catch (err) {
          // Log the error to the console for better debugging
          console.error("Error fetching bookmarked jobs:", err);
          setError("Error fetching bookmarked jobs. Please try again later.");
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      } else {
        setError("No bookmarked jobs found.");
      }
    };

    fetchBookmarkedJobs();
  }, []); // Run only once on mount

  if (loading) {
    return <div>Loading bookmarked jobs...</div>; // You can replace this with a spinner or loading component
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  return (
    <div className="p-4">
      <div className="flex flex-col mb-6">
        <div className="flex flex-col mb-6">
          <p className="text-black font-bold text-lg lg:text-3xl">Saved Jobs</p>
          <p className="text-gray-600 font-semibold lg:text-lg">Manage Bookmarked Jobs</p>
        </div>

        {bookmarkedJobs && bookmarkedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-3 lg:grid-cols-2 lg:gap-x-4">
            {bookmarkedJobs.map((job, index) => (
              <CareerCard
                key={index}
                slug={job.id}
                imageSrc={job.employers?.[0]?.logo || "/defaultLogo.png"} // Default logo if none exists
                category={job.category}
                jobTitle={job.title}
                workMode={job.mode}
                company={job.employers?.[0]?.name || "Unknown Company"} // Fallback for missing employer name
                canBookmark={true} // Can't bookmark again since it's already bookmarked
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center col-span-full">No bookmarked jobs found.</p>
        )}
      </div>
    </div>
  );
}
