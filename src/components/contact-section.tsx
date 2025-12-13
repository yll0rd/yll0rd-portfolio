"use client";
import React, { useState } from 'react'
import * as z from "zod";
import emailjs from '@emailjs/browser';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Leapfrog } from 'ldrs/react';
// @ts-ignore
import 'ldrs/react/Leapfrog.css';


// Zod validation schema
const contactFormSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(50, { message: "Name must be less than 50 characters" }),
    email: z.email({ message: "Please enter a valid email address" }),
    message: z.string()
        .max(1000, { message: "Message must be less than 1000 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = ({ className = "" }: { className?: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { theme } = useTheme()
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            // Replace these with your EmailJS credentials
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                message: data.message,
                date: new Date().toLocaleString(),
                to_name: 'Youmbi Leo',
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            setSubmitSuccess(true);
            form.reset();

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setSubmitError('Failed to send message. Please try again or contact me directly via email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id='contact' className={`animate-fade-in ${className}`}>
            {/* Header */}
            <div className="text-center mb-12 space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold">Get In Touch</h2>
                <p className="text-lg max-w-xl text-muted-foreground mx-auto">
                    Have a project in mind or just want to chat? Drop me a message and I&apos;ll get back to you as soon as possible.
                </p>
            </div>

            <div className="animate-fade-in delay-300">
                <div className="border border-border rounded-2xl p-8 md:p-10 transition-shadow bg-card">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name Field */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Your full name"
                                                {...field}
                                                disabled={isSubmitting}
                                                className="h-12"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="your.email@example.com"
                                                {...field}
                                                disabled={isSubmitting}
                                                className="h-12"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Message Field */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell me about your project or just say hi..."
                                                className="min-h-[160px] resize-none"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Success Message */}
                            {submitSuccess && (
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 animate-fade-in">
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">
                                        Message sent successfully! I&apos;ll get back to you soon.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitError && (
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-fade-in">
                                    <p className="text-sm">{submitError}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="w-full h-12 text-base font-medium hover-lift shadow-lg hover:shadow-xl transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Leapfrog
                                            size="20"
                                            speed={2}
                                            color={theme === "dark" ? "black" : "white"}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    )
}

export default ContactSection;