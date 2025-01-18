"use client"

import { useState, useEffect } from "react";
import WorkshopCard from "@/components/WorkshopCard";
import { createBrowserClient } from "@supabase/ssr"
import { any } from "zod";

export default function StudentProfile({
  children,
}: {
  children: React.ReactNode
}) {
    const [selectedOption, setSelectedOption] = useState("Profile");
    const [workshops, setWorkshops] = useState([]);
    const [userId, setUserId] = useState([]);
    const [loading, setLoading] = useState(false);

    // Create Supabase client for browser
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch workshops using useEffect
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

        if (selectedOption === "Registered Workshops") {
            fetchUserId();
        }
    }, [selectedOption]);

    // Fetch workshops after user ID is set
    useEffect(() => {
        async function fetchWorkshops() {
            if (!userId) return;

            try {
                setLoading(true);
                console.log("Fetching workshops for user ID:", userId);

                // First get the workshop IDs from registrations
                const { data: registrations, error: regError } = await supabase
                    .from("workshop_application")
                    .select("*")
                    .eq("student_id", userId);

                    console.log(registrations);
                if (regError) throw regError;

                if (registrations && registrations.length > 0) {
                    const workshopIds = registrations.map((reg: { workshop_id: any; }) => reg.workshop_id);
                    
                    // Then get the workshop details
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

        if (selectedOption === "Registered Workshops" && userId) {
            fetchWorkshops();
        }
    }, [userId, selectedOption]);

    // Render content based on selected option
    const renderContent = () => {
        switch (selectedOption) {
            case "Profile":
                return children;
            case "Saved Jobs":
                return (
                    <div className="p-4">
                        <div className="flex flex-col mb-6">
                            <p className="text-black font-bold text-lg lg:text-3xl">On Construction !</p>
                        </div>
                    </div>
                );
            case "Applied Jobs":
                return (
                    <div className="p-4">
                        <div className="flex flex-col mb-6">
                            <p className="text-black font-bold text-lg lg:text-3xl">On Construction !</p>
                        </div>
                    </div>
                );
            case "Registered Workshops":
                return (
                    <div className="p-4">
                        <div className="flex flex-col mb-6">
                                <div className="flex flex-col mb-6">
                                    <p className="text-black font-bold text-lg lg:text-3xl">Workshops Registered</p>
                                    <p className="text-gray-600 font-semibold lg:text-lg">See you there !</p>
                                </div>
                                <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-4">
                                    {workshops.map((workshop: { id: string; imageSrc: string; name: string; tag: string; date: string; venue: string; }) => (
                                        <WorkshopCard 
                                            key={workshop.id}
                                            slug={workshop.id}
                                            imageSrc={workshop.imageSrc}
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
            default:
                return <div className="p-4">Select an option from the left menu.</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Left Navigation Section */}
            <div className="w-1/5 min-h-full bg-slate-200 mt-4">
                <ul>
                    <li>
                        <button
                            className={`w-full p-4 text-left ${
                                selectedOption === "Profile"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-slate-200 text-black hover:bg-blue-100"
                            } border-b border-white`}
                            onClick={() => setSelectedOption("Profile")}
                        >
                            Profile
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full p-4 text-left ${
                                selectedOption === "Saved Jobs"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-slate-200 text-black hover:bg-blue-100"
                            } border-b border-white`}
                            onClick={() => setSelectedOption("Saved Jobs")}
                        >
                            Saved Jobs
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full p-4 text-left ${
                                selectedOption === "Applied Jobs"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-slate-200 text-black hover:bg-blue-100"
                            } border-b border-white`}
                            onClick={() => setSelectedOption("Applied Jobs")}
                        >
                            Applied Jobs
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full p-4 text-left ${
                                selectedOption === "Registered Workshops"
                                ? "bg-blue-100 text-blue-900"
                                : "bg-slate-200 text-black hover:bg-blue-100"
                            } border-b border-white`}
                            onClick={() => setSelectedOption("Registered Workshops")}
                        >
                            Registered Workshops
                        </button>
                    </li>
                </ul>
            </div>

            {/* Right Content Section */}
            <div className="w-4/5 min-h-full bg-slate-100 p-8">{renderContent()}</div>
        </div>
    );
}