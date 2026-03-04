"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function VerifyOtpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timer, setTimer] = useState(59);

    // Focus management
    const handleChange = (index: number, value: string) => {
        // Only accept numbers
        if (value && !/^\d+$/.test(value)) return;

        if (value.length > 1) {
            // Handle paste over multiple fields
            const pastedData = value.substring(0, 4).split("");
            const newOtp = [...otp];
            pastedData.forEach((char, i) => {
                if (index + i < 4) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            // Focus the right-most filled input
            const nextFocus = Math.min(index + pastedData.length, 3);
            inputRefs.current[nextFocus]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // move to next input if filled
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
        }
    };

    // Timer logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async () => {
        const fullOtp = otp.join("");
        if (fullOtp.length < 4) {
            setError("Please enter the complete 4-digit OTP.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/verify", {
                email,
                otp: fullOtp
            });

            if (res.data.success || res.status === 200) {
                // Pass verification to reset password route via query param (or session token depending on backend)
                router.push(`/reset-password?email=${encodeURIComponent(email || "")}&code=${fullOtp}`);
            } else {
                setError(res.data.message || "Invalid OTP");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await api.post("/auth/forgot-password", { email });
            setTimer(59);
            setError("");
        } catch (err: any) {
            setError("Failed to resend code");
        }
    };

    if (!email) {
        return (
            <div className="w-full text-center space-y-4 pt-10 px-4">
                <p className="text-slate-500">Invalid request parameters.</p>
                <Button onClick={() => router.push("/login")} variant="outline">Back to Login</Button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0B2341] mb-2">Verify Email</h1>
                <p className="text-slate-500 text-sm">Enter OTP to verify your email address.</p>
            </div>

            <div className="space-y-8">
                <div className="flex justify-between space-x-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-16 h-16 text-center text-2xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2341] focus:border-transparent transition-all bg-white"
                        />
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm px-1">
                    <div className="flex items-center text-slate-500 font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        00:{timer.toString().padStart(2, '0')}
                    </div>
                    <div>
                        <span className="text-slate-500 mr-1">Don&apos;t get a code?</span>
                        {timer === 0 ? (
                            <button
                                onClick={handleResend}
                                className="text-[#0B2341] font-semibold hover:underline"
                            >
                                Resend
                            </button>
                        ) : (
                            <span className="text-slate-400 font-semibold cursor-not-allowed">Resend</span>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleVerify}
                    disabled={isLoading || otp.join("").length < 4}
                    className="w-full bg-[#0B2341] hover:bg-[#0B2341]/90 text-white rounded-full py-6 text-base"
                >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Verify
                </Button>
            </div>
        </div>
    );
}
