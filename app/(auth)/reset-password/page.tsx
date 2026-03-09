"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordValues) => {
        setIsLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/reset-password", {
                email,
                code,
                password: data.password // Assuming the backend takes 'password' for the new password
            });

            if (res.data.success || res.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/login?reset=success");
                }, 3000);
            } else {
                setError(res.data.message || "Failed to reset password");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-[#0B2341]">Password Changed!</h2>
                <p className="text-slate-500 text-base max-w-sm mx-auto">Your password has been successfully updated. You will be redirected to Log In shortly.</p>
                <div className="flex items-center justify-center text-sm opacity-70 pt-4">
                    <Loader2 className="animate-spin mr-2 w-4 h-4" /> Redirecting...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0B2341] mb-2">Change Password</h1>
                <p className="text-slate-500 text-sm">Enter your new password to secure your account.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Create New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password..."
                            className="w-full rounded-lg border-slate-200 focus-visible:ring-[#0B2341] h-12 pr-10"
                            {...form.register("password")}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re - Enter Password..."
                            className="w-full rounded-lg border-slate-200 focus-visible:ring-[#0B2341] h-12 pr-10"
                            {...form.register("confirmPassword")}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {form.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0B2341] hover:bg-[#0B2341]/90 text-white rounded-full py-6 text-base mt-4"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Verify
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#0B2341]" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
