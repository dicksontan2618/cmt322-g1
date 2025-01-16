'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

import { studentUpdateProfileAction } from "@/app/actions"
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast"

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

type FormValues = z.infer<typeof formSchema>;

export interface StudentProfileFormProps {
  initialData: {
    id: string;
    name: string;
    year: number;
    specialization: string;
  };
}

export default function StudentProfileFormClient({initialData}: StudentProfileFormProps) {

    const { toast } = useToast();

    const router = useRouter();

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: initialData?.name,
            studyYear: initialData?.year,
            specialization: initialData?.specialization
        },
    });
    
    async function onSubmit(values: any) {

        const mergedObject = { ...values, id: initialData?.id ?? null }
        const result = await studentUpdateProfileAction(mergedObject);

        const status = result.status;
        const message = result.message;

        if(status === "success") {
            router.refresh();
        }

        toast({
            variant: status === "error" ? "destructive" : "default",
            title: status === "error" ? "Error" : "Success",
            description: message || "Something went wrong",
        });
    }

    return (
        <div className="p-4 text-black"><Form {...form}>
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
                <Button type="submit" className="bg-secondary text-white mt-8" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <span>Updating...</span>
                    ) : (
                        <span>Update</span>
                    )}
                </Button>
            </form>
        </Form></div>
    );
}