'use client';

import { useState } from "react";
import PostedJobSection from "@/components/PostedJobSection";

function EmployerProfile({
  children,
}: {
  children: React.ReactNode
}){
  
  const [selectedOption, setSelectedOption] = useState("Profile"); // State to track the selected option

  // Render content based on selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "Profile":
        return children;
      case "Posted Jobs":
        return <PostedJobSection/>
      default:
        return <div className="p-4">Select an option from the left menu.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
    {/* Left Navigation Section */}
    <div className="w-1/5 min-h-full mt-4 bg-slate-200">
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
                selectedOption === "Posted Jobs"
                ? "bg-blue-100 text-blue-900"
                : "bg-slate-200 text-black hover:bg-blue-100"
            } border-b border-white`}
            onClick={() => setSelectedOption("Posted Jobs")}
            >
            Posted Jobs
            </button>
        </li>
        </ul>
    </div>

    {/* Right Content Section */}
    <div className="w-4/5 min-h-full bg-slate-100 p-8">{renderContent()}</div>
    </div>

  );
}

export default EmployerProfile;