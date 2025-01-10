'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
      message: "Name must be at least 2 characters."
  }),
  studyYear: z.coerce.number().min(1, {
      message: "Study year should be 1-4."
  }).max(4, {
      message: "Study year should be 1-4."
  }),
  specialization: z.string(),
})

export default function StudentProfile() {

    const [selectedOption, setSelectedOption] = useState("Profile");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {  
        username: "Ong Chu Jun",
        studyYear: 4,
        specialization: "ic",
        password: "test123"
        },
    })

    function onSubmit(values: any) {
        console.log(values);
    }

    // Render content based on selected option
    const renderContent = () => {
        switch (selectedOption) {
        case "Profile":
            return <div className="p-4 text-black"><Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student Name</FormLabel>
                                <FormControl>
                                    <Input className="bg-white" placeholder="Enter your name..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="studyYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student Year</FormLabel>
                                <FormControl>
                                    <Input placeholder="Year" {...field} className="md:w-1/4 bg-white" />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Major Specialization</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className="bg-white">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white text-primary">
                                    <SelectItem value="se">Software Engineering</SelectItem>
                                    <SelectItem value="ic">Intelligent Computing</SelectItem>
                                    <SelectItem value="ci">Computing Infrastructure</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="bg-secondary text-white mt-8">Save</Button>
                    </form>
                </Form></div>;
        case "Saved Jobs":
            return (
            <div className="p-4">
                <div className="flex flex-col mb-6">
                <p className="text-black font-bold text-lg lg:text-3xl">On Construction !</p>
                </div>
            </div>
            );
        case "Applied Jobs":
            return (
                    <div className="p-4">
                    <div className="flex flex-col mb-6">
                        <p className="text-black font-bold text-lg lg:text-3xl">On Construction !</p>
                    </div>
                    </div>
                );
        case "Registered Workshops":
            return (
            <div className="p-4">
                <div className="flex flex-col mb-6">
                    <p className="text-black font-bold text-lg lg:text-3xl">On Construction !</p>
                </div>
            </div>
            );
        default:
            return <div className="p-4">Select an option from the left menu.</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
        {/* Left Navigation Section */}
        <div className="w-1/5 min-h-full bg-slate-200">
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
                    selectedOption === "Saved Jobs"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-slate-200 text-black hover:bg-blue-100"
                } border-b border-white`}
                onClick={() => setSelectedOption("Saved Jobs")}
                >
                Saved Jobs
                </button>
            </li>
            <li>
                <button
                className={`w-full p-4 text-left ${
                    selectedOption === "Applied Jobs"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-slate-200 text-black hover:bg-blue-100"
                } border-b border-white`}
                onClick={() => setSelectedOption("Applied Jobs")}
                >
                Applied Jobs
                </button>
            </li>
            <li>
                <button
                className={`w-full p-4 text-left ${
                    selectedOption === "Registered Workshops"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-slate-200 text-black hover:bg-blue-100"
                } border-b border-white`}
                onClick={() => setSelectedOption("Registered Workshops")}
                >
                Registered Workshops
                </button>
            </li>
            </ul>
        </div>

        {/* Right Content Section */}
        <div className="w-4/5 min-h-full bg-slate-100 p-8">{renderContent()}</div>
        </div>

    );
}
