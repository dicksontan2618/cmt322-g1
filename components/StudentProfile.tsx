"use client"

import { useState } from "react";
import RegisteredWorkshops from "@/components/RegisteredWorkshopSection";
import AppliedJobs from "@/components/AppliedJobsSection";
import SavedJobs from "@/components/SavedJobsSection";

export default function StudentProfile({
  children,
}: {
  children: React.ReactNode
}) {
    const [selectedOption, setSelectedOption] = useState("Profile");

    const renderContent = () => {
        switch (selectedOption) {
            case "Profile":
                return children;
            case "Saved Jobs":
                return <SavedJobs />;
            case "Applied Jobs":
                return <AppliedJobs />;
            case "Registered Workshops":
                return <RegisteredWorkshops />;
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