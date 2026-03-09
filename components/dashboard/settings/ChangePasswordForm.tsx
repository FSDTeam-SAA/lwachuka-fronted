"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/lib/queries/user";
import { ChangePasswordPayload } from "@/types/user";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordChecks = [
    {
        label: "Minimum 8–12 characters (recommend 12+ for stronger security)",
        test: (p: string) => p.length >= 8,
    },
    {
        label: "At least one uppercase letter must",
        test: (p: string) => /[A-Z]/.test(p),
    },
    {
        label: "At least one lowercase letter must",
        test: (p: string) => /[a-z]/.test(p),
    },
    {
        label: "At least one number must (0–9)",
        test: (p: string) => /[0-9]/.test(p),
    },
    {
        label: "At least special character (@ # $ % ^ & * etc.)",
        test: (p: string) => /[^A-Za-z0-9]/.test(p),
    },
    {
        label: "No spaces allowed",
        test: (p: string) => !/\s/.test(p),
    },
];

function PasswordField({
    id,
    label,
    value,
    onChange,
    placeholder,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <Label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1.5 block">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? "••••••••"}
                    className="pr-10"
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShow((p) => !p)}
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );
}

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch = newPassword && newPassword === confirmPassword;
    const allChecksPassed = passwordChecks.every((c) => c.test(newPassword));
    const canSubmit = currentPassword && passwordsMatch && allChecksPassed;

    const mutation = useMutation({
        mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
        onSuccess: () => {
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        },
        onError: () => {
            toast.error("Current password is incorrect");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        mutation.mutate({ currentPassword, newPassword });
    };

    const handleDiscard = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0D1B2A]">Changes Password</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account preferences, security settings, and privacy options.
                </p>
            </div>

            {/* Current + New Password in a row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <PasswordField
                    id="currentPassword"
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                />
                <PasswordField
                    id="newPassword"
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                />
            </div>

            {/* Confirm New Password */}
            <div className="mb-4">
                <PasswordField
                    id="confirmPassword"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />
            </div>

            {/* Live Validation Checklist */}
            {(newPassword || confirmPassword) && (
                <div className="mb-6 space-y-1.5">
                    {passwordChecks.map((check) => {
                        const passes = check.test(newPassword);
                        return (
                            <div key={check.label} className="flex items-center gap-2 text-xs">
                                {passes ? (
                                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                ) : (
                                    <X className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                )}
                                <span className={cn(passes ? "text-green-700" : "text-red-600")}>
                                    {check.label}
                                </span>
                            </div>
                        );
                    })}
                    {confirmPassword && !passwordsMatch && (
                        <div className="flex items-center gap-2 text-xs">
                            <X className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span className="text-red-600">Passwords do not match</span>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleDiscard}>
                    Discard Changes
                </Button>
                <Button
                    type="submit"
                    disabled={!canSubmit || mutation.isPending}
                    className="bg-[#0D1B2A] text-white hover:bg-[#1A3A5C] disabled:opacity-50"
                >
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
