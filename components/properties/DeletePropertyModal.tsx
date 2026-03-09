"use client";

import { AlertTriangle } from "lucide-react";

interface DeletePropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title?: string;
}

export function DeletePropertyModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    title = "this property",
}: DeletePropertyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => !isDeleting && onClose()}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                </div>

                {/* Text */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Property?</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-medium text-gray-700 italic">{title}</span>? This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full mt-1">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#0B2B4B] text-white text-sm font-medium hover:bg-[#0B2B4B]/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            "Yes, Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
