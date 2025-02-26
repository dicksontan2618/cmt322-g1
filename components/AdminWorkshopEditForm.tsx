"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { adminEditWorkshopAction } from "@/app/actions"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import { faTrash, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

import { format } from "date-fns"
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"

import { deleteWorkshopAction } from "@/app/actions"

import WorkshopAnalyticsDialog from "@/components/WorkshopAnalyticsDialog";

const formSchema = z.object({
    workshopName: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    workshopDate: z.date().nullable().refine((date) => date !== null, {
        message: "Workshop date is required.",
    }),
    workshopStart:z.string(),
    workshopEnd:z.string(),
    workshopVenue: z.string().min(2, {
        message: "Venue must be at least 2 characters."
    }),
    workshopSpeaker: z.string().min(2, {
        message: "Speaker name must be at least 2 characters."
    }),
    speakerRole: z.string().min(2, {
        message: "Speaker role must be at least 2 characters."
    }),
    workshopDesc: z.string().min(10, {
        message: "Workshop description must be at least 10 characters."
    }),
    workshopThumbnailImg: z.instanceof(File).refine((file) => file.size < 7000000, {
        message: 'Your image must be less than 7MB.',
    }),
    workshopDetailImg: z.instanceof(File).refine((file) => file.size < 7000000, {
        message: 'Your image must be less than 7MB.',
    }),
    workshopTag: z.string().min(2, {
        message: "Tag must be at least 2 characters."
    }),
})

export default function AdminWorkshopEditForm({workshopData}: any) {

    const [isDeleting, setIsDeleting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { toast } = useToast();

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workshopName: workshopData?.name,
            workshopDate: workshopData?.date ? new Date(workshopData.date) : undefined,
            workshopStart:workshopData?.start_time,
            workshopEnd:workshopData?.end_time,
            workshopVenue:workshopData?.venue,
            workshopSpeaker:workshopData?.speaker_name,
            speakerRole:workshopData?.speaker_role,
            speakerLinkedIn:workshopData?.speaker_linkedin,
            workshopDesc:workshopData?.description,
            workshopThumbnailImg:workshopData?.thumbnail_img,
            workshopDetailImg: workshopData?.detail_img,
            workshopTag:workshopData?.tag
        },
    })

    const handleDeleteWorkshop = async () => {
        try {
            setIsDeleting(true)
            const result = await deleteWorkshopAction(workshopData.id)

            if (result.status === "success") {
                toast({
                    title: "Success",
                    description: "Workshop deleted successfully",
                })
                setIsDialogOpen(false)
                router.push("/profile/admin/workshops")
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete workshop",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    async function onSubmit(values: any) {
        // Create merged object with current data and new values
        const mergedObject = {
            ...values,
            id: workshopData?.id ?? null,
            currentThumbnailPath: workshopData.thumbnail_img,
            currentDetailPath: workshopData.detail_img
        };
    
        const result = await adminEditWorkshopAction(mergedObject);
    
        const status = result.status;
        const message = result.message;
    
        if(status === "success") {
            setTimeout(() => {
                router.push("/profile/admin/workshops");
            }, 2500);
        }
    
        toast({
            variant: status === "error" ? "destructive" : "default",
            title: status === "error" ? "Error" : "Success",
            description: message || "Something went wrong",
        });
    }

  return (
    <div className="px-8 mb-8 lg:px-16 lg:py-8 text-primary">
        <p className="font-bold text-xl lg:text-3xl mb-4">Edit Workshop</p>
        <div className="relative bottom-3 left-1">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-secondary">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="text-black flex flex-col items-center justify-center rounded-md bg-white shadow-xl fixed">
                        <DialogHeader>
                            <div className="text-yellow-500 text-7xl text-center mb-2">
                                <FontAwesomeIcon icon={faExclamationCircle} />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-center text-primary">
                                Delete Workshop?
                            </DialogTitle>
                            <p className="text-sm text-center text-gray-500">
                                Do you want to delete this workshop?
                            </p>
                        </DialogHeader>
                        <DialogFooter className="flex justify-center gap-4 mt-3">
                            <Button
                                onClick={handleDeleteWorkshop}
                                className="bg-primary text-white hover:bg-red-700"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Yes"}
                            </Button>
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-secondary text-white hover:bg-gray-400"
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <WorkshopAnalyticsDialog workshopData={workshopData}/>
            </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="workshopName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Workshop Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter workshop name..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-8">
                <FormField
                    control={form.control}
                    name="workshopDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Workshop Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={
                                            `bg-white flex justify-between items-center px-8 py-6 gap-x-8 ${!field.value && "text-muted-foreground"}`
                                        }
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <FontAwesomeIcon icon={faCalendar}/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    className="rounded-lg bg-gray-700 text-white"
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="workshopStart"
                    render={({ field }) => (
                        <FormItem className="w-[20%]">
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                                <Input className="w-[80%]" placeholder="Enter start time..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="workshopEnd"
                    render={({ field }) => (
                        <FormItem className="w-[40%]">
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                                <Input className="w-[80%]" placeholder="Enter end time..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="workshopVenue"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Workshop Venue</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter venue name..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-8">
                    <FormField
                    control={form.control}
                    name="workshopSpeaker"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workshop Speaker</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter speaker name..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="speakerRole"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role/Occupation</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter role..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="speakerLinkedIn"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn Profile</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter LinkedIn Profile Link..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="workshopDesc"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Workshop Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Tell us a little bit about the workshop..."
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-8">
                    <FormField
                    control={form.control}
                    name="workshopThumbnailImg"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                            <Input
                            {...fieldProps}
                            placeholder="Picture"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                onChange(event.target.files && event.target.files[0])
                            }
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="workshopDetailImg"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                        <FormLabel>Detail Image</FormLabel>
                        <FormControl>
                            <Input
                            {...fieldProps}
                            placeholder="Picture"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                onChange(event.target.files && event.target.files[0])
                            }
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                control={form.control}
                name="workshopTag"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter tag..." className="w-[30%]" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit" className="bg-secondary text-white mt-8" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <span>Updating...</span>
                    ) : (
                        <span>Update</span>
                    )}
                </Button>
            </form>
        </Form>
    </div>
  )
}