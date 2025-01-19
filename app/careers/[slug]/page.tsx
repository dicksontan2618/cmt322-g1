import { createClient } from "@/utils/supabase/server";
import CareerApplySection from "@/components/CareerApplySection";

// interface Params {
//     slug: string;
// }

type Params = Promise<{ slug: string }>;

export default async function CareerInfoPage({ params }: { params: Params }) {

    const param_details = await params;
    const slug = param_details.slug;

    console.log(slug);

    let canApply = false;
    let userData = null;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if(user) {
        const {
            data: userDetails,
            error: userError
        } = await supabase.from("profiles").select("*").single();

        if (userDetails.role === "student") {
            canApply = true;
            userData = userDetails;
        }
    }

    const {
        data: jobData,
        error: jobError
    } = await supabase
        .from("jobs")
        .select(`
            *,
            employers (
                id,
                name,
                description
            )
        `)
        .eq("id", slug)
        .single();

    if (jobError) {
        console.error('Error fetching job:', jobError);
        return (
            <div className="px-8 mb-8 lg:px-16 lg:py-8">
                <p className="text-red-500 font-bold text-xl">Job not found!</p>
            </div>
        );
    }

    console.log(userData);

    return (
        <CareerApplySection 
            jobData={jobData} 
            userData={userData} 
            canApply={canApply}
        />
    );
}