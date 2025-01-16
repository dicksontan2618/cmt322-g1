"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { employerEditJobAction } from "@/app/actions"

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast"


const formSchema = z.object({
    jobTitle: z.string().min(2, {
        message: "Job title be at least 2 characters."
    }),
    workMode: z.string(),
    category: z.string(),
    minQualifications: z.string(),
    salaryRange: z.string(),
    jobDesc: z.string().min(5, {
        message: "Job description be at least 5 characters."
    }),
    requiredSkills: z.string().min(2, {
        message: "Job description be at least 2 characters."
    })
})

export default function EmployerJobEditForm({jobData}: any) {

    const { toast } = useToast();

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobTitle: jobData?.title,
            workMode: jobData?.mode,
            category: jobData?.category,
            minQualifications: jobData?.qualification,
            salaryRange: jobData?.salary,
            jobDesc: jobData?.description,
            requiredSkills: jobData?.skills
        },
    })

    async function onSubmit(values: any) {

        const mergedObject = { ...values, id: jobData?.id ?? null }
        const result = await employerEditJobAction(mergedObject);

        const status = result.status;
        const message = result.message;

        if(status === "success") {
            setTimeout(() => {
            router.push("/profile/employer/jobs");
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
        <p className="font-bold text-xl lg:text-3xl mb-4">Create Job</p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Job Title..." {...field} className="bg-white"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className="flex flex-col gap-y-4 md:flex-row md:gap-y-0 md:gap-x-8">
                    {/* Work Mode Dropdown */}
                    <FormField
                        control={form.control}
                        name="workMode"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Work Mode</FormLabel>
                            <FormControl>
                            <select
                                {...field}
                                className="bg-white px-4 py-2 rounded-lg border border-gray-300 w-full md:w-auto"
                            >
                                <option value="" disabled>
                                Please Select
                                </option>
                                <option value="remote">Remote</option>
                                <option value="onsite">Onsite</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Full Time Or Part Time Dropdown */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                            <select
                                {...field}
                                className="bg-white px-4 py-2 rounded-lg border border-gray-300 w-full md:w-auto"
                            >
                                <option value="" disabled>
                                    Please Select
                                </option>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                            </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Minimum Qualifications Dropdown */}
                    <FormField
                        control={form.control}
                        name="minQualifications"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Minimum Qualifications</FormLabel>
                            <FormControl>
                            <select
                                {...field}
                                className="bg-white px-4 py-2 rounded-lg border border-gray-300 w-full md:w-auto"
                            >
                                <option value="" disabled>
                                Please Select
                                </option>
                                <option value="highschool">Diploma</option>
                                <option value="bachelor">Bachelor's Degree</option>
                                <option value="master">Master's Degree</option>
                                <option value="phd">PhD</option>
                            </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    {/* Salary Range Dropdown */}
                    <FormField
                        control={form.control}
                        name="salaryRange"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                            <FormLabel>Salary Range</FormLabel>
                            <FormControl>
                            <select
                                {...field}
                                className="bg-white px-4 py-2 rounded-lg border border-gray-300 w-full md:w-auto"
                            >
                                <option value="" disabled>
                                Please Select
                                </option>
                                <option value="500-1000">500 - 1000</option>
                                <option value="1000-1500">1000 - 1500</option>
                                <option value="1500-2000">1500 - 2000</option>
                                <option value="2000-3000">2000 - 3000</option>
                            </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                control={form.control}
                name="jobDesc"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter Job Description..."
                                className="resize-none bg-white"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="requiredSkills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Required Skills / Preferred Skills</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter tag..." className="w-[30%] bg-white" {...field} />
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