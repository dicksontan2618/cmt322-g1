"use client"

import { z } from "zod"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faArrowLeft,
    faMoneyBill,
  } from "@fortawesome/free-solid-svg-icons";


import { Badge } from "@/components/ui/badge";

interface JobData {
  id: string;
  title: string;
  mode: string;
  category: string;
  salary: string;
  description: string;
  employer_id: string;
  employers: {
    id: string;
    name: string;
  };
}

interface UserData {
  id: string;
  role: string;
}

interface CareerApplySectionProps {
  jobData: JobData;
  userData: UserData | null;
  canApply: boolean;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    phoneNumber: z.coerce.number(),
    email: z.string().email(),
    resume: z
    .any()
    .refine(
        (file) => file && file.type === "application/pdf",
        { message: "Only PDF files are allowed." }
      )
    .refine(
      (file) => file && file.size <= 5 * 1024 * 1024,
      { message: "File size must not exceed 5 MB." }
    )
});

type FormValues = z.infer<typeof formSchema>;

export default function CareerApplySection({ jobData, userData, canApply }: CareerApplySectionProps) {

  return (
    <div className="px-8 mb-8 lg:px-16 lg:py-8 text-black">
        <div className="mt-32 lg:mt-8 flex flex-col">
        <div className="flex items-center gap-2">
          <button onClick={() => window.history.back()}
            className="text-lg text-gray-600 hover:text-blue-500 focus:outline-none"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-8 h-8" />
          </button>
            <p className="font-bold text-xl lg:text-3xl pb-2">{jobData.title}</p>
        </div>

        <div className="flex gap-2 mt-2">
          <Badge className="bg-primary text-white">{jobData.mode.charAt(0).toUpperCase() + jobData.mode.slice(1)}</Badge>
          <Badge className="bg-secondary text-white">{jobData.category.charAt(0).toUpperCase() + jobData.category.slice(1)}</Badge>
        </div>
          <p className="text-black font-semibold lg:text-lg pt-4">{jobData.employers?.name}</p>
        </div>
        <div className="flex flex-col gap-y-2 text-black font-semibold mt-4 lg:gap-y-6">
          <div className="flex gap-x-6 items-center">
            <FontAwesomeIcon
              icon={faMoneyBill}
              className="w-[5%] lg:w-[1%] lg:scale-150"
            />
            <p className="text-gray-600 text-sm w-[95%] -ml-2 lg:text-base">
              {jobData.salary}
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 font-medium lg:text-base">
          {jobData.description}
        </div>
    </div>
  );
}