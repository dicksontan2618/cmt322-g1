"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { createBrowserClient } from "@supabase/ssr"

import {
    faArrowLeft,
    faMoneyBill,
  } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

import { userApplyJobAction } from "@/app/actions"

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
    job_id: z.string(),
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

  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [user, setUser] = useState<any>(null);

    // Create Supabase client for browser
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

     // Move auth check to useEffect
     useEffect(() => {
      const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
            }
        };
        getUser();
    }, []);

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
          student_id: user?.id || "",
          job_id: jobData?.id || "",
          name: "",
          phoneNumber: "",
          email: "",
          resume: "",
          remarks: ""
      },
  });

    async function onSubmit(values: any) {
      console.log("Submitted values:", values);
      const result = await userApplyJobAction(values);
      console.log("Action result:", result);

      const status = result.status;
      const message = result.message;

      if (status === "success") {
          setOpen(false); // Close dialog on successful submission
          setIsApplied(true);
          router.push("/careers");
      } else {
          console.error("Error:", message);
      }

      toast({
          variant: status === "error" ? "destructive" : "default",
          title: status === "error" ? "Error" : "Success",
          description: message || "Something went wrong",
      });
  }


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
        <div className="flex justify-center w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="bg-secondary text-white mt-8 w-1/3"
                        disabled={isApplied}
                    >
                        Apply
                    </Button>
                </DialogTrigger>
                <DialogContent className="text-black w-4/5 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>
                            <p className="text-primary font-extrabold">Application Form</p>
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            console.log("Form submitted"); // Should log on submit
                            form.handleSubmit(onSubmit)(e);
                        }} className="space-y-8">
                            {/* Hidden Fields */}
                            <FormField
                                control={form.control}
                                name="student_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" placeholder="Student Id" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="job_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" placeholder="Job Id" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="x.@gmail.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                            control={form.control}
                            name="resume"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Resume (PDF only, max 5MB)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    onChange(file);
                                                }
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                            <Button type="submit" className="bg-secondary text-white mt-8" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <span>Submitting...</span>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}