"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
    role: z.enum(["user", "agent", "vendor"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
        },
    });

    const selectedRole = form.watch("role");

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/register", {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                role: data.role,
            });

            if (res.data.success) {
                router.push("/login?registered=true");
            } else {
                setError(res.data.message || "Registration failed");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Role Selection */}
            <Label className="text-sm font-medium text-slate-700 block mb-2">I am a...</Label>
            <div className="mb-8 border border-slate-100 p-1 rounded-xl flex items-center bg-slate-50 w-full text-sm shadow-inner">
                <button
                    type="button"
                    onClick={() => form.setValue("role", "user")}
                    className={`flex-1 py-3 px-2 rounded-lg font-semibold transition-all duration-200 ${selectedRole === "user" ? "bg-[#d89a42] text-white shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                >
                    User
                </button>
                <button
                    type="button"
                    onClick={() => form.setValue("role", "agent")}
                    className={`flex-1 py-3 px-2 rounded-lg font-semibold transition-all duration-200 ${selectedRole === "agent" ? "bg-[#d89a42] text-white shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                >
                    Agent or Owners
                </button>
                <button
                    type="button"
                    onClick={() => form.setValue("role", "vendor")}
                    className={`flex-1 py-3 px-2 rounded-lg font-semibold transition-all duration-200 ${selectedRole === "vendor" ? "bg-[#d89a42] text-white shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                >
                    Service Vendor
                </button>
            </div>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#0B2341] mb-2">Create Your Account</h1>
                <p className="text-slate-500 text-sm">Connect families with trusted care today.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">Your Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="Write here..."
                        className="w-full rounded-lg border-slate-200 focus-visible:ring-[#0B2341] h-12"
                        {...form.register("fullName")}
                    />
                    {form.formState.errors.fullName && (
                        <p className="text-red-500 text-xs">{form.formState.errors.fullName.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full rounded-lg border-slate-200 focus-visible:ring-[#0B2341] h-12"
                        {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                        <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
                    )}
                </div>

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
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter Password..."
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
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0B2341] hover:bg-[#0B2341]/90 text-white rounded-full py-6 text-base mt-4"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Sign up
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                    Already have an account? <Link href="/login" className="text-[#0B2341] font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}
