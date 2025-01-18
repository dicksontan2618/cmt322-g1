// RegisteredWorkshops.tsx
import { useState, useEffect } from "react";
import WorkshopCard from "@/components/WorkshopCard";
import { createBrowserClient } from "@supabase/ssr";

interface Workshop {
    id: string;
    thumbnail_img: string;
    name: string;
    tag: string;
    date: string;
    venue: string;
}

export default function RegisteredWorkshops() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
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
        async function fetchWorkshops() {
            if (!userId) return;

            try {
                setLoading(true);
                console.log("Fetching workshops for user ID:", userId);

                const { data: registrations, error: regError } = await supabase
                    .from("workshop_application")
                    .select("*")
                    .eq("student_id", userId);

                console.log(registrations);
                if (regError) throw regError;

                if (registrations && registrations.length > 0) {
                    const workshopIds = registrations.map((reg: { workshop_id: any; }) => reg.workshop_id);
                    
                    const { data: workshopData, error: workshopError } = await supabase
                        .from("workshops")
                        .select("*")
                        .in("id", workshopIds);

                    if (workshopError) throw workshopError;

                    console.log("Found workshops:", workshopData);
                    setWorkshops(workshopData || []);
                } else {
                    console.log("No registered workshops found");
                    setWorkshops([]);
                }
            } catch (error) {
                console.error("Error fetching workshops:", error);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchWorkshops();
        }
    }, [userId]);

    return (
        <div className="p-4">
            <div className="flex flex-col mb-6">
                <div className="flex flex-col mb-6">
                    <p className="text-black font-bold text-lg lg:text-3xl">Workshops Registered</p>
                    <p className="text-gray-600 font-semibold lg:text-lg">See you there !</p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-4">
                    {workshops.map((workshop) => (
                        <WorkshopCard 
                            key={workshop.id}
                            slug={workshop.id}
                            imageSrc={workshop.thumbnail_img}
                            title={workshop.name}
                            category={workshop.tag}
                            date={workshop.date}
                            venue={workshop.venue}
                            colorCode="#ED4989"
                            canEdit={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}