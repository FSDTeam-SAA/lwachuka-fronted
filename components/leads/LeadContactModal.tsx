"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getLeadById, sendMessage, leadKeys } from "@/lib/queries/leads";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { X, MapPin, Mail, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadContactModalProps {
    leadId: string | null;
    onClose: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "New", className: "bg-blue-100 text-blue-700 hover:bg-blue-100 font-medium border-0" },
    viewed: { label: "Viewed", className: "bg-gray-100 text-gray-600 hover:bg-gray-100 font-medium border-0" },
    responded: { label: "Contacted", className: "bg-green-100 text-green-700 hover:bg-green-100 font-medium border-0" },
};

export function LeadContactModal({ leadId, onClose }: LeadContactModalProps) {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = session?.user?.accessToken;

    const [replyText, setReplyText] = useState("");

    const { data: leadData, isLoading } = useQuery({
        queryKey: leadKeys.detail(leadId!),
        queryFn: () => getLeadById(leadId!, token),
        enabled: !!leadId && !!token,
    });

    const lead = leadData?.data;

    const sendMutation = useMutation({
        mutationFn: () => sendMessage({ contactId: leadId!, message: replyText }, token),
        onSuccess: () => {
            toast.success("Message sent successfully");
            queryClient.invalidateQueries({ queryKey: leadKeys.list() });
            queryClient.invalidateQueries({ queryKey: leadKeys.stats() });
            setReplyText("");
            onClose();
        },
        onError: () => {
            toast.error("Failed to send message");
        },
    });

    const handleSend = () => {
        if (!replyText.trim()) {
            toast.error("Please enter a message to send.");
            return;
        }
        sendMutation.mutate();
    };

    if (!leadId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh] z-50 animate-in fade-in zoom-in-95 duration-200">

                {isLoading || !lead ? (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : (
                    <>
                        <div className="p-6 flex-1 overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                                        {lead.userId?.profileImage ? (
                                            <Image
                                                src={lead.userId.profileImage}
                                                alt={`${lead.userId.firstName} ${lead.userId.lastName}`}
                                                width={40}
                                                height={40}
                                                className="object-cover h-full w-full"
                                            />
                                        ) : (
                                            <span className="text-gray-500 font-semibold text-xs">
                                                {lead.userId?.firstName?.[0]}{lead.userId?.lastName?.[0]}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-semibold text-gray-900 text-sm">
                                                {lead.userId?.firstName} {lead.userId?.lastName}
                                            </h3>
                                            <Badge variant="secondary" className={statusConfig[lead.status]?.className || statusConfig.pending.className}>
                                                {statusConfig[lead.status]?.label || "New"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">Lead details and contact information</p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Interested Property */}
                            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 mb-6">
                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5 font-medium">
                                    <MapPin className="h-3 w-3" />
                                    Interested Property
                                </p>
                                <p className="text-sm font-medium text-gray-900 ml-4.5">
                                    {lead.propertyId?.title}
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3 mb-6">
                                <p className="text-sm font-medium text-gray-900 mb-2">Contact Information</p>

                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{lead.userId?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                        {/* WhatsApp Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">WhatsApp</p>
                                        <p className="text-sm font-medium text-gray-900">{lead.userId?.phoneNumber || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Inquiry Date</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {lead.createdAt ? format(new Date(lead.createdAt), "MMMM d, yyyy") : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        Message
                                    </p>
                                    {lead.messages?.length > 0 ? (
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-600 leading-relaxed max-h-[120px] overflow-y-auto">
                                            {lead.messages[0].message}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm text-gray-400 italic">
                                            No message provided.
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Textarea
                                        placeholder="Type your reply..."
                                        rows={3}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0 rounded-b-2xl">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={sendMutation.isPending}
                                className="bg-[#0D1B2A] text-white hover:bg-[#1A3A5C]"
                            >
                                {sendMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Mail className="mr-2 h-4 w-4" />
                                )}
                                Send Email
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
