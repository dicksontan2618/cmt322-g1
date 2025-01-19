import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faMap, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import WorkshopRegistrationDialog from "@/components/WorkshopRegistrationDialog";

import { createClient } from "@/utils/supabase/server";

// interface Params {
//     slug: string;
// }

type Params = Promise<{ slug: string }>;

export default async function WorkshopPage({ params }: { params: Params }) {

    const param_details = await params;
    const slug = param_details.slug;

  const supabase = await createClient();
    
  const {
      data: user,
  } = await supabase.from("profiles").select("*").single();

  const {
    data: workshop,
    error
  } = await supabase.from("workshops").select("*").eq("id", slug).single();

  workshop.userrole = user.role;

  if (!workshop) {
    return (
      <div className="px-8 mb-8 lg:px-16 lg:py-8 text-black">
        <p className="text-red-500 font-bold text-xl">Workshop not found!</p>
      </div>
    );
  }

  return (
    <div className="px-8 mb-8 lg:px-16 lg:py-8 text-black">
      <div className="mt-32 lg:mt-8 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:mb-4 xl:mb-16">
          <div className="lg:w-1/2">
            <p className="font-bold text-xl lg:text-3xl">{workshop.name}</p>
            <Badge
              style={{ backgroundColor: workshop.colorCode }}
              className="my-2 text-gray-800 self-start"
            >
              {workshop.category}
            </Badge>
            <div className="flex flex-col gap-y-2 text-black font-semibold mt-4 lg:gap-y-6">
              <div className="flex gap-x-6 items-center">
                <FontAwesomeIcon icon={faCalendar} className="w-[5%] lg:w-[1.5%] lg:scale-150" />
                <p className="text-gray-600 text-sm w-[95%] -ml-2 lg:text-base">{workshop.date}</p>
              </div>
              <div className="flex gap-x-6 items-center">
                <FontAwesomeIcon icon={faClock} className="w-[5%] lg:w-[1.5%] lg:scale-150" />
                <p className="text-gray-600 text-sm w-[95%] -ml-2 lg:text-base">{workshop.start_time}</p>
              </div>
              <div className="flex gap-x-6 items-center">
                <FontAwesomeIcon icon={faMap} className="w-[5%] lg:w-[1.5%] lg:scale-150" />
                <p className="text-gray-600 text-sm w-[95%] -ml-2 lg:text-base">{workshop.venue}</p>
              </div>
              <div className="flex gap-x-6 items-center">
                <FontAwesomeIcon icon={faUser} className="w-[5%] lg:w-[1.5%] lg:scale-150" />
                <p className="flex items-center text-gray-600 text-sm w-[95%] -ml-2 lg:text-base">
                  {workshop.speaker_name} - {workshop.speaker_role}
                  <FontAwesomeIcon icon={faLinkedin} className="ml-2 lg:scale-125 lg:ml-4" />
                </p>
              </div>
            </div>
          </div>
          <Image
            src={workshop.detail_img}
            width={1800}
            height={1800}
            alt="Workshop Detail Image"
            className="mt-8 w-full h-56 rounded-xl object-cover lg:w-1/2"
          />
        </div>
        <p className="mt-4 text-sm text-gray-600 font-medium lg:text-base">{workshop.description}</p>

        {/* WorkshopRegistrationDialog Button */}
        <WorkshopRegistrationDialog workshopData={workshop}/>
        
      </div>
    </div>
  );
};
