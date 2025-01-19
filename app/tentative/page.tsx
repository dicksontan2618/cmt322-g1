"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

// Define a type for the schedule event if needed
type EventItem = {
  time: string;
  description: string;
};

const TentativePage: React.FC = () => {
  const events: EventItem[] = [
    { time: "8:30 AM - 9:00 AM", description: "Arrival of Participants" },
    { time: "9:00 AM - 9:20 AM", description: "Opening Ceremony" },
    { time: "9:20 AM - 9:30 AM", description: "Best Intern Awards Ceremony" },
    { time: "9:30 AM - 4:30 PM", description: "Career Booth Showcase Starts\nInterview Session Opens" },
    { time: "11:30 AM - 12:30 PM", description: "Diamond Sponsor Workshop Session" },
    { time: "12:30 PM - 1:30 PM", description: "Lunch Break" },
    { time: "1:30 PM - 2:30 PM", description: "Gold Sponsor Workshop Session" },
    { time: "2:30 PM - 3:30 PM", description: "Gold Sponsor Workshop Session" },
    { time: "3:30 PM - 4:00 PM", description: "Gold Sponsor Workshop Session" },
    { time: "4:30 PM - 5:00 PM", description: "Closing Ceremony" },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-5">Event Tentative</h1>
          <div className="text-gray-700 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendar} className="text-primary w-5 h-5" />
              <span>13th January 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMapPin} className="text-primary w-5 h-5" />
              <span>USM Hamzah Sendut I Library</span>
            </div>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="border-solid border-gray-300 border-2 rounded-lg max-w-3xl w-full px-6">
          <ul className="divide-y divide-gray-200">
            {events.map((event, index) => (
              <li key={index} className="flex items-center py-5">
                <span className="bg-gray-200 px-3 py-1 rounded text-sm font-semibold text-primary w-48 text-center">
                  {event.time}
                </span>
                <span className="text-primary ml-16">{event.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TentativePage;
