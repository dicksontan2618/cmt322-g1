"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { createBrowserClient } from "@supabase/ssr";

interface Applicant {
    id: number;
    student_name: string;
    student_phonenum: string;
    student_email: string;
    resume: string;
}

export default function JobApplicantsDialog({ jobId }: any) {
    const [open, setOpen] = useState(false);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchApplicants() {
            try {
                // Fetch the current user's employer ID
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError) throw userError;

                // Fetch job applications for the employer's jobs
                const { data: jobApplications, error: applicationsError } = await supabase
                    .from("job_application")
                    .select(`
                        id,
                        student_name,
                        student_phonenum,
                        student_email,
                        resume
                    `)
                    .eq("job_id", jobId);

                if (applicationsError) throw applicationsError;

                setApplicants(jobApplications || []);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        }

        if (open) {
            fetchApplicants();
        }
    }, [open, supabase]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
          <FontAwesomeIcon icon={faChartLine} /> Analytics
        </Button>
            </DialogTrigger>
            <DialogContent className="text-black w-4/5 rounded-lg max-h-[70%] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        <p className="text-primary font-extrabold">Job Applications</p>
                    </DialogTitle>
                </DialogHeader>
                        <p className="font-semibold text-sm">Number of Applicants</p>
                        <p className="font-extrabold text-2xl text-gray-500">{applicants.length}</p>
                <div className="text-primary gap-y-4">
                    {applicants.length > 0 ? (
                        applicants.map((applicant, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-4 bg-gray-100 rounded-md mb-2"
                            >
                                <div>
                                    <p className="font-bold">{applicant.student_name}</p>
                                    <Button
                                        onClick={() => setCurrentApplicant(applicant)}
                                        className="text-white mt-2"
                                    >
                                        View Application
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No applicants found.</p>
                    )}
                </div>
            </DialogContent>

            {/* Dialog for Viewing Application Details */}
            {currentApplicant && (
                <Dialog open={!!currentApplicant} onOpenChange={() => setCurrentApplicant(null)}>
                    <DialogContent className="text-black w-4/5 rounded-lg max-h-[70%] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>
                                <p className="text-primary font-extrabold">Applicants Details</p>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="text-primary space-y-4">
                            <p>
                                <span className="font-bold">Name:</span> {currentApplicant.student_name}
                            </p>
                            <p>
                                <span className="font-bold">Phone Number:</span> {currentApplicant.student_phonenum}
                            </p>
                            <p>
                                <span className="font-bold">Email:</span> {currentApplicant.student_email}
                            </p>
                            <p>
                                <span className="font-bold">Resume:</span>
                                <a
                                    href={currentApplicant.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    View Resume
                                </a>
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </Dialog>
    );
}
