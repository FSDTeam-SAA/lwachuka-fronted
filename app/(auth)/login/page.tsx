"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: true, // Defaulting to true as requested
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError(result.error);
                toast.error(result.error);
                setIsLoading(false);
                return;
            }

            // Successful login
            toast.success("Login successful!");
            router.push(callbackUrl);
            router.refresh();

        } catch {
            setError("An unexpected error occurred. Please try again.");
            toast.error("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0B2341] mb-2">Hello!</h1>
                <p className="text-slate-500 text-sm">Access to manage your account.</p>
            </div>

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

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
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
                        <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            onCheckedChange={(checked) => form.setValue("rememberMe", checked as boolean)}
                            className="border-slate-300 data-[state=checked]:bg-[#0B2341] data-[state=checked]:border-[#0B2341]"
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer font-medium">
                            Remember Me
                        </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm font-semibold text-[#0B2341] hover:underline">
                        Forgot Password?
                    </Link>
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
                    Sign In
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-600">
                    Don&apos;t have an account? <Link href="/register" className="text-[#0B2341] font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-[#0B2341]" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
