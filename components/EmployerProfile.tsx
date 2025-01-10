'use client';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const formSchema = z.object({
  companyName: z.string().min(2, {
      message: "Company name must be at least 2 characters."
  }),
  companyDesc: z.string().min(2, {
      message: "Company description must be at least 2 characters."
  }),
})

function EmployerProfile() {
  
  const [selectedOption, setSelectedOption] = useState("Profile"); // State to track the selected option

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        companyImage: "/mockImages/keysight_logo.png",
        companyName: "Keysight Technologies",
        companyDesc: "Keysight Technologies, Bayan Lepas Free Industrial Zone Phase 3, 11900 Bayan Lepas, Pulau Pinang",
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
                        name="companyImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Logo</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        {/* Image Preview */}
                                        {field.value && (
                                            <Image
                                            src={"/mockImages/keysight_logo.png"}
                                            alt="Company Logo"
                                            width={150}
                                            height={100}
                                            className="object-cover"
                                            priority
                                            />
                                        )}

                                        {/* File Input - Show only if no image is available */}
                                        {!field.value || typeof field.value === "object" ? (
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="bg-white"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(file || field.value); // Update with file if present
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                                <Input className="bg-white" placeholder="Enter your name..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="companyDesc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                                <Input className="bg-white" placeholder="Enter company description..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="bg-secondary text-white mt-8">Save</Button>
                </form>
              </Form></div>;
      case "Posted Jobs":
        return 
            <div className="p-4">
                <div className="flex flex-col mb-6">
                    <p className="text-black font-bold text-lg lg:text-3xl">Manage Job</p>
                    <p className="text-gray-600 font-semibold lg:text-lg">Add new / Manage posted vacancy</p>
                </div>
            </div>;
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
                selectedOption === "Posted Jobs"
                ? "bg-blue-100 text-blue-900"
                : "bg-slate-200 text-black hover:bg-blue-100"
            } border-b border-white`}
            onClick={() => setSelectedOption("Posted Jobs")}
            >
            Posted Jobs
            </button>
        </li>
        </ul>
    </div>

    {/* Right Content Section */}
    <div className="w-4/5 min-h-full bg-slate-100 p-8">{renderContent()}</div>
    </div>

  );
}

export default EmployerProfile;