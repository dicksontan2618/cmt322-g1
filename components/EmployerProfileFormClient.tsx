'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"

import { employerUpdateProfileAction } from "@/app/actions"
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  companyName: z.string().min(2, {
      message: "Name must be at least 2 characters."
  }),
  companyDesc: z.string().min(10, {
      message: "Description must be at least 10 characters."
  }),
  companyLogo: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>;

export interface EmployerProfileFormProps {
  initialData: {
    id: string;
    name: string;
    description: string;
    logo_url?: string;
  };
}

export default function EmployerProfileFormClient({initialData}: EmployerProfileFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(initialData?.logo_url || null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: initialData?.name || '',
            companyDesc: initialData?.description || '',
        },
    })
    
    async function onSubmit(values: any) {
        const mergedObject = { ...values, id: initialData?.id ?? null }
        const result = await employerUpdateProfileAction(mergedObject);

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
        <div className="p-4 text-black">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {currentLogoUrl && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Current Logo:</p>
                            <Image
                                src={currentLogoUrl}
                                alt="Current company logo"
                                width={100}
                                height={100}
                                className="rounded-lg"
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="companyLogo"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Company Logo</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            if (file) {
                                                onChange(file);
                                                const url = URL.createObjectURL(file);
                                                setCurrentLogoUrl(url);
                                            }
                                        }}
                                        className="bg-white"
                                    />
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
                                    <Input 
                                        className="bg-white" 
                                        placeholder="Enter your name..." 
                                        {...field} 
                                    />
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
                                    <Input 
                                        className="bg-white" 
                                        placeholder="Enter company description..." 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button 
                        type="submit" 
                        className="bg-secondary text-white mt-8" 
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <span>Updating...</span>
                        ) : (
                            <span>Update</span>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}