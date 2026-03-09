/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Zap, Star, Crown, Phone, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Plan {
  _id: string;
  name: string;
  price: number;
  days: number;
  features: string[];
}

// ─── STK Push response shape ───────────────────────────────────────────────
interface StkPushResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    merchantRequestId: string;
    checkoutRequestId: string;
    message: string;
  };
}

function BillingPaymentsPlan() {
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phone, setPhone] = useState("");

  const { data: subscription } = useQuery({
    queryKey: ["subscription", TOKEN],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const data = await res.json();
      return data?.data || [];
    },
  });

  const icons = [
    <Zap key="zap" className="h-5 w-5 text-yellow-500" />,
    <Star key="star" className="h-5 w-5 text-gray-800" />,
    <Crown key="crown" className="h-5 w-5 text-yellow-500" />,
  ];

  const handleBuyNow = (plan: Plan) => {
    setSelectedPlan(plan);
    setPhone("");
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setPhone("");
  };

  // ─── 2nd Mutation: M-Pesa Callback ────────────────────────────────────────
  // Sends callback body built from STK push response data
  const callbackMutation = useMutation({
    mutationFn: async (stkData: StkPushResponse["data"]) => {
      const body = {
        Body: {
          stkCallback: {
            MerchantRequestID: stkData.merchantRequestId,
            CheckoutRequestID: stkData.checkoutRequestId,
            ResultCode: 0,
            ResultDesc: "The service request is processed successfully.",
            CallbackMetadata: {
              Item: [
                { Name: "Amount", Value: selectedPlan?.price },
                { Name: "MpesaReceiptNumber", Value: stkData.paymentId },
                { Name: "TransactionDate", Value: Date.now() },
                { Name: "PhoneNumber", Value: Number(phone) },
              ],
            },
          },
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/mpesa/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) throw new Error("Callback failed. Please try again.");
      return res.json();
    },
    onSuccess: () => {
      alert("Payment confirmed successfully!");
      handleCloseModal();
    },
    onError: (err: any) => {
      alert(err.message || "Callback error. Please try again.");
    },
  });

  // ─── 1st Mutation: STK Push ───────────────────────────────────────────────
  // On success → immediately fires callbackMutation with response data
  const payNumberMutation = useMutation({
    mutationFn: async (): Promise<StkPushResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subscriber/pad-listing-mpesa/${selectedPlan?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ phoneNumber: phone }),
        },
      );
      if (!res.ok) throw new Error("Payment initiation failed. Please try again.");
      return res.json();
    },
    onSuccess: (response: StkPushResponse) => {
      // ✅ Fire callback mutation immediately with STK push response data
      callbackMutation.mutate(response.data);
    },
    onError: (err: any) => {
      alert(err.message || "Something went wrong!");
    },
  });

  const handleSubmit = () => {
    if (!phone.trim() || !selectedPlan) return;
    payNumberMutation.mutate();
  };

  // Either mutation running = loading
  const isProcessing =
    payNumberMutation.isPending || callbackMutation.isPending;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Subscription Plans</h2>
      <p className="text-sm text-muted-foreground mb-8">
        Upgrade or downgrade your plan anytime
      </p>

      <div className="grid grid-cols-3 gap-4 items-center py-4">
        {subscription?.map((plan: any, index: number) => (
          <Card
            key={plan._id}
            className={`relative rounded-2xl border transition-all ${
              index === 1
                ? "bg-[#0F172A] border-[#0F172A] scale-105 shadow-xl z-10"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <Badge className="bg-[#1E293B] text-white text-xs px-3 py-1 rounded-full border border-gray-600 whitespace-nowrap">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardContent className="p-6 space-y-5">
              {/* Icon + Name */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 1 ? "bg-white/10" : "bg-yellow-50"
                  }`}
                >
                  {icons[index] || icons[0]}
                </div>
                <span
                  className={`font-semibold text-base ${
                    index === 1 ? "text-white" : "text-gray-800"
                  }`}
                >
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div>
                <span
                  className={`text-3xl font-bold ${
                    index === 1 ? "text-white" : "text-gray-900"
                  }`}
                >
                  KSH {plan.price}
                </span>
                <span
                  className={`text-sm ${
                    index === 1 ? "text-gray-400" : "text-muted-foreground"
                  }`}
                >
                  /{plan.days} days
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features?.map((f: string) => (
                  <li key={f} className="flex items-start gap-2">
                    <Zap
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        index === 1 ? "text-blue-400" : "text-blue-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        index === 1 ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                onClick={() => handleBuyNow(plan)}
                className={`w-full rounded-xl font-semibold mt-2 ${
                  index === 1
                    ? "bg-white text-[#0F172A] hover:bg-gray-100 border-0"
                    : "bg-transparent border border-yellow-400 text-yellow-500 hover:bg-yellow-50"
                }`}
                variant="outline"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Phone Number Modal ─────────────────────────────────────── */}
      <Dialog
        open={!!selectedPlan}
        onOpenChange={(o) => !o && handleCloseModal()}
      >
        <DialogContent className="sm:max-w-sm rounded-2xl p-0 shadow-xl border border-gray-100 [&>button]:hidden overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-base font-semibold text-[#1a2341]">
                Complete Your Purchase
              </h2>
              {selectedPlan && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedPlan.name} — KSH {selectedPlan.price} /{" "}
                  {selectedPlan.days} days
                </p>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              disabled={isProcessing}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Phone icon */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Enter your M-Pesa phone number to proceed with payment.
              </p>
            </div>

            {/* Processing status */}
            {isProcessing && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-center">
                <p className="text-xs text-blue-600 font-medium">
                  {payNumberMutation.isPending
                    ? "⏳ Initiating M-Pesa STK push..."
                    : "✅ STK sent! Confirming payment..."}
                </p>
              </div>
            )}

            {/* Phone input */}
            <div className="space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-xs font-semibold text-[#1a2341] uppercase tracking-wide"
              >
                Phone Number *
              </Label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="254700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isProcessing}
                  className="h-[46px] pl-9 rounded-xl border-gray-200 focus:border-blue-400 text-sm disabled:opacity-60"
                />
              </div>
              <p className="text-xs text-gray-400">
                Format: 254XXXXXXXXX — You will receive an M-Pesa prompt.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 h-[46px]"
                onClick={handleCloseModal}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white h-[46px] font-semibold"
                onClick={handleSubmit}
                disabled={!phone.trim() || isProcessing}
              >
                {payNumberMutation.isPending
                  ? "Sending STK..."
                  : callbackMutation.isPending
                    ? "Confirming..."
                    : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BillingPaymentsPlan;