"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";

import { createBrowserClient } from "@supabase/ssr";

export default function WorkshopAnalyticsDialog({ workshopData }: any) {
    const [open, setOpen] = useState(false);
    const [workshopStatistics, setWorkshopStatistics] = useState({
        statistics: [],
        averageFamiliarity: "N/A",
    });

    // Create Supabase client for browser
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchWorkshopStatistics() {
            try {
                // Fetch workshop statistics along with student details
                const { data: workshopStat, error: workshopError } = await supabase
                    .from("workshop_application")
                    .select(`
                        remarks, 
                        familiarity,
                        student_phonenum, 
                        student_email,
                        student_id (
                            name
                        )
                    `)
                    .eq("workshop_id", workshopData.id); // Assuming `workshopData.id` holds the ID of the current workshop

                if (workshopError) throw workshopError;

                console.log(workshopStat);

                if (workshopStat) {
                    // Process and display the remarks, familiarity, and student details
                    const statistics = workshopStat.map(record => ({
                        remark: record.remarks,
                        familiarity: record.familiarity,
                        name: record.student_id?.name || "N/A", // Name from `students` table
                        phoneNumber: record.student_phonenum || "N/A",
                        email: record.student_email || "N/A",
                    }));

                    // Calculate the average familiarity value
                    const familiarityValues = statistics.map(stat => stat.familiarity);
                    const totalFamiliarity = familiarityValues.reduce((sum, value) => sum + value, 0);
                    const averageFamiliarity = familiarityValues.length > 0
                        ? (totalFamiliarity / familiarityValues.length).toFixed(2)
                        : "N/A";

                    // Update state to display statistics
                    setWorkshopStatistics({
                        statistics,
                        averageFamiliarity,
                    });
                }
            } catch (error) {
                console.error("Error fetching workshop statistics:", error);
            }
        }

        if (open) {
            fetchWorkshopStatistics(); // Trigger the function when the dialog is opened
        }
    }, [open, supabase, workshopData.id]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white">
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            </DialogTrigger>
            <DialogContent className="text-black w-4/5 rounded-lg max-h-[50%] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        <p className="text-primary font-extrabold">Workshop Statistics</p>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col text-primary gap-y-4 lg:flex-row lg:justify-around">
                    <div>
                        <p className="font-semibold text-sm">Number of Participants</p>
                        <p className="font-extrabold text-2xl text-gray-500">{workshopStatistics.statistics.length}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Average Familiarity Rate</p>
                        <p className="font-extrabold text-2xl text-gray-500">{workshopStatistics.averageFamiliarity} / 5</p>
                    </div>
                </div>
                <div className="grid w-full items-center gap-1.5 mt-2">
                    <Label htmlFor="text"><p className="font-bold">Applicants Remarks and Details</p></Label>
                    {workshopStatistics.statistics.length > 0 ? (
                        <div>
                            {workshopStatistics.statistics.map((stat, index) => (
                                <div key={index} className="mb-4 text-black">
                                <Textarea
                                    value={`Name: ${stat.name || "N/A"}\nPhone: ${stat.phoneNumber || "N/A"}\nEmail: ${stat.email || "N/A"}\nRemark: ${stat.remark || "N/A"}`}
                                    className="resize-none placeholder:text-black mt-2 overflow-y-visible"
                                    disabled
                                />
                            </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No data available</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
