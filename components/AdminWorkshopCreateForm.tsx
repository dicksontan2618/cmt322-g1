"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { adminCreateWorkshopAction } from "@/app/actions"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"

import { format } from "date-fns"
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"


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
    // workshopThumbnailImg: z.instanceof(File).refine((file) => file.size < 7000000, {
    //     message: 'Your image must be less than 7MB.',
    // }),
    // workshopDetailImg: z.instanceof(File).refine((file) => file.size < 7000000, {
    //     message: 'Your image must be less than 7MB.',
    // }),
    workshopTag: z.string().min(2, {
        message: "Tag must be at least 2 characters."
    }),
})

export default function AdminWorkshopCreateForm() {

    const { toast } = useToast();

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workshopName: "",
            workshopDate: undefined,
            workshopStart:"",
            workshopEnd:"",
            workshopVenue:"",
            workshopSpeaker:"",
            speakerRole:"",
            speakerLinkedIn:"",
            workshopDesc:"",
            workshopTag:""
        },
    })

    async function onSubmit(values: any) {
        const result = await adminCreateWorkshopAction(values);
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
        <p className="font-bold text-xl lg:text-3xl mb-4">Create Workshop</p>
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
                {/* <div className="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-8">
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
                </div> */}
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
                        <span>Creating...</span>
                    ) : (
                        <span>Create</span>
                    )}
                </Button>
            </form>
        </Form>
    </div>
  )
}