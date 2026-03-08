"use client";

import { Subscription } from "@/types/promotions";
import { Button } from "@/components/ui/button";
import { Megaphone, Star, Crown } from "lucide-react";

interface SubscriptionCardProps {
    subscription: Subscription;
    index: number;
    onBuyNow: (subscription: Subscription) => void;
}

export function SubscriptionCard({ subscription, index, onBuyNow }: SubscriptionCardProps) {
    const isPopular = index === 1;

    const getDurationLabel = (days: number): string => {
        if (days <= 7) return `${days} days`;
        if (days === 14) return "2 weeks";
        if (days === 30) return "1 month";
        if (days === 365) return "1 year";
        return `${days} days`;
    };

    const icons = [
        <div key="0" className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Megaphone className="h-6 w-6" />
        </div>,
        <div key="1" className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-[#0D1B2A]">
            <Star className="h-6 w-6" />
        </div>,
        <div key="2" className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Crown className="h-6 w-6" />
        </div>,
    ];

    return (
        <div
            className={`relative bg-white rounded-2xl border p-8 transition-all flex flex-col h-full ${isPopular
                    ? "scale-105 border-[#0D1B2A] shadow-2xl z-10"
                    : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0D1B2A] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                </div>
            )}

            <div className="flex items-center gap-4 mb-8">
                {icons[index % 3]}
                <h3 className="text-lg font-bold text-[#0D1B2A]">{subscription.name}</h3>
            </div>

            <div className="mb-8">
                <div className="text-3xl font-black text-[#0D1B2A] flex items-baseline gap-1">
                    KSH {subscription.price.toLocaleString()}
                    <span className="text-sm font-medium text-gray-400">/{getDurationLabel(subscription.days)}</span>
                </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
                {subscription.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="mt-1 text-[#0D1B2A]">✦</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                onClick={() => onBuyNow(subscription)}
                variant={isPopular ? "default" : "outline"}
                className={`w-full h-12 rounded-lg font-bold transition-all ${isPopular
                        ? "bg-[#0D1B2A] text-white hover:bg-[#1A3A5C]"
                        : "border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                    }`}
            >
                Buy Now
            </Button>
        </div>
    );
}
