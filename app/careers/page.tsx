import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CareerCard from "@/components/CareerCard";

async function CareerHomePage(){

    let canBookmark = false;

    const supabase = await createClient();

    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    // if user not found(authenticated), redirect to sign-in page
    if (!user) {
        canBookmark = false;
    }

    if (user?.role === "student") {
        canBookmark = true;
    }
    
    const {
        data: jobs,
        error
    } = await supabase.from("jobs").select(`
        *,
        employers (
            id,
            name,
            logo
        )
    `);

    console.log(jobs);

    return (
        <div className="px-8 mb-8 lg:px-16 lg:py-8">
        {/* Header */}
        <div className="flex flex-col mb-6">
            <p className="text-black font-bold text-lg lg:text-3xl">Career</p>
            <p className="text-gray-600 font-semibold lg:text-lg">Discover jobs available!</p>
        </div>

        {/* Job Vacancy List */}
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-4">
            {jobs && jobs.length > 0 ? (
            jobs.map((career, index) => (
                <CareerCard 
                key={index} 
                slug={career.id} 
                imageSrc={career.employers.logo} 
                category={career.category} 
                jobTitle={career.title}
                workMode={career.mode} 
                company={career.employers.name}
                canBookmark={canBookmark}
                />
            ))
            ) : (
            <p className="text-gray-500 text-center col-span-full">No jobs found.</p>
            )}
        </div>
        </div>
    );
}

export default CareerHomePage;