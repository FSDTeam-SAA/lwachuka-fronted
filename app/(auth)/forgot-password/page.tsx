"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const form = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotFormValues) => {
        setIsLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/forgot-password", { email: data.email });
            if (res.data.success || res.status === 200 || res.status === 201) {
                setSuccess(true);
                // Automatically redirect to OTP page after a short delay
                setTimeout(() => {
                    router.push(`/verify?email=${encodeURIComponent(data.email)}`);
                }, 2000);
            } else {
                setError(res.data.message || "Failed to send OTP");
            }

        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0B2341] mb-2">Forgot Password!</h1>
                <p className="text-slate-500 text-sm">Enter your email to recover your password.</p>
            </div>

            {!success ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email..."
                            className="w-full rounded-lg border-slate-200 focus-visible:ring-[#0B2341] h-12"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0B2341] hover:bg-[#0B2341]/90 text-white rounded-full py-6 text-base mt-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                        Send OTP
                    </Button>
                </form>
            ) : (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="font-semibold text-lg">OTP Sent Successfully!</p>
                    <p className="text-sm opacity-90 max-w-xs">We&apos;ve sent a verification code to {form.getValues("email")}.</p>
                    <div className="flex items-center text-sm opacity-70 pt-2">
                        <Loader2 className="animate-spin mr-2 w-4 h-4" /> Redirecting...
                    </div>
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-600">
                    Remember your password? <Link href="/login" className="text-[#0B2341] font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}
