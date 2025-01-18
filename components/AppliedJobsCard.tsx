import { useState } from "react"; // Import useState for state management
import Link from "next/link"; // Import Link for navigation
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Import dialog components
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { createBrowserClient } from "@supabase/ssr"; // Import Supabase client

interface AppliedCareerCardProps {
    slug: string;
    imageSrc: string;
    category: string;
    jobTitle: string;
    workMode: string;
    applicationId: string;
}

export default function AppliedJobsCard({ 
    slug, 
    imageSrc, 
    category, 
    jobTitle, 
    workMode, 
    applicationId,
}: AppliedCareerCardProps) {
    const [isVisible, setIsVisible] = useState(true); // State to control card visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
    const { toast } = useToast(); // Toast hook

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDelete = async () => {
        try {
            // Call the backend to delete the job application
            const { error } = await supabase
                .from("job_application")
                .delete()
                .eq("id", applicationId);

            if (error) throw error;

            // Update UI state after successful deletion
            setIsVisible(false); // Hide the card
            toast({
                title: "Successfully Deleted.",
                description: "Your application has been deleted.",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error deleting job application:", error);
            toast({
                title: "Deletion Failed.",
                description: "There was an error deleting your application. Please try again.",
                duration: 5000,
            });
        } finally {
            setIsDialogOpen(false); // Close the dialog
        }
    };

    if (!isVisible) return null; // Do not render the card if it's not visible

    return (
        <Card className="flex items-center justify-between bg-white shadow-lg rounded-lg p-1 mt-4">
            {/* Left Section: Job Details */}
            <div>
                {/* Job Title */}
                <CardHeader className="text-xl text-black font-semibold">
                    <div className="flex flex-col">
                        <Image
                            src={imageSrc}
                            alt={jobTitle}
                            width={150}
                            height={100}
                            className="object-cover"
                            priority
                        />
                        {jobTitle}
                    </div>
                </CardHeader>

                {/* Badges */}
                <CardContent className="flex gap-2 mt-2">
                    <Badge className="bg-primary text-white">{workMode}</Badge>
                    <Badge className="bg-secondary text-white">{category}</Badge>
                    <Link href={`/careers/${slug}`}>
                        <p className="text-slate-500 text-xs underline mt-2">See Details</p>
                    </Link>
                </CardContent>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex gap-4">
                {/* Delete Button */}
                <button
                    onClick={() => setIsDialogOpen(true)} // Open the confirmation dialog
                    className="flex items-center gap-1 mr-8 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-red-700"
                    title="Delete"
                >
                    <FontAwesomeIcon icon={faTrash} /> Remove Application
                </button>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="text-black flex flex-col items-center justify-center rounded-md bg-white shadow-xl fixed">
                    <DialogHeader>
                        {/* Warning Icon */}
                        <div className="text-yellow-500 text-7xl text-center mb-2">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-center text-primary">
                            Are you sure?
                        </DialogTitle>
                        <p className="text-sm text-center text-gray-500">
                            You won't be able to revert this!
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex justify-center gap-4 mt-3">
                        <Button
                            onClick={handleDelete}
                            className="bg-primary text-white hover:bg-red-700"
                        >
                            Yes, delete it!
                        </Button>
                        <Button
                            onClick={() => setIsDialogOpen(false)}
                            className="bg-secondary text-white hover:bg-gray-400"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
