"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"

import { userRegisterWorkshopAction } from "@/app/actions"

const formSchema = z.object({
    workshopId: z.coerce.number(),
    phoneNumber: z.coerce.number(),
    email: z.string().email(),
    familliarity: z.coerce.number(),
    remarks: z.string().min(2, {
        message: "Remarks must be at least 2 characters."
    })
})

export default function WorkshopRegistrationDialog({ workshopData }: any) {
    const { toast } = useToast();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            workshopId: workshopData.id,
            phoneNumber: "",
            email: "",
            familliarity: "",
            remarks: "",
        },
    });

    async function onSubmit(values: any) {
        console.log("Submitted values:", values);
        const result = await userRegisterWorkshopAction(values);
        console.log("Action result:", result);

        const status = result.status;
        const message = result.message;

        if (status === "success") {
            setOpen(false); // Close dialog on successful submission
            setIsRegistered(true);
            router.push("/workshops");
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-secondary text-white mt-8 md:w-1/3 md:self-center lg:w-1/4"
                    disabled={isRegistered}
                >
                    Register
                </Button>
            </DialogTrigger>
            <DialogContent className="text-black w-4/5 rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        <p className="text-primary font-extrabold">Registration</p>
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
                            name="workshopId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input type="hidden" placeholder="Workshop Id" {...field} />
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
                            name="familliarity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Familliarity</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select familliarity" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-white text-primary">
                                            <SelectItem value="1">Not Familiar</SelectItem>
                                            <SelectItem value="2">Slightly Familiar</SelectItem>
                                            <SelectItem value="3">Familiar</SelectItem>
                                            <SelectItem value="4">Very Familiar</SelectItem>
                                            <SelectItem value="5">Expert</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Remarks</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about your expectation"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-secondary text-white mt-8" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <span>Registering...</span>
                            ) : (
                                <span>Register</span>
                            )}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
