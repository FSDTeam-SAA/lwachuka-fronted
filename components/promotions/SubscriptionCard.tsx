"use client";

import { Subscription } from "@/types/promotions";
import { Button } from "@/components/ui/button";
import { Megaphone, Star, Crown } from "lucide-react";

interface SubscriptionCardProps {
  subscription: Subscription;
  index: number;
  onBuyNow: (subscription: Subscription) => void;
}

export function SubscriptionCard({
  subscription,
  index,
  onBuyNow,
}: SubscriptionCardProps) {
  const isPopular = index === 1;

  const getDurationLabel = (days: number): string => {
    if (days <= 7) return `${days} days`;
    if (days === 14) return "2 weeks";
    if (days === 30) return "1 month";
    if (days === 365) return "1 year";
    return `${days} days`;
  };

  const icons = [
    <div
      key="0"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
    >
      <Megaphone className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
    </div>,
    <div
      key="1"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[#0D1B2A] sm:h-11 sm:w-11 lg:h-12 lg:w-12"
    >
      <Star className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
    </div>,
    <div
      key="2"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
    >
      <Crown className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
    </div>,
  ];

  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border bg-white p-4 transition-all sm:rounded-2xl sm:p-6 lg:p-8 ${
        isPopular
          ? "border-[#0D1B2A] shadow-xl sm:scale-[1.02] lg:scale-105 lg:shadow-2xl lg:z-10"
          : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0D1B2A] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap sm:-top-4 sm:px-3.5 sm:py-1 sm:text-[10px]">
          Most Popular
        </div>
      )}

      <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4 lg:mb-8">
        {icons[index % 3]}
        <h3 className="text-base font-bold text-[#0D1B2A] sm:text-lg">
          {subscription.name}
        </h3>
      </div>

      <div className="mb-5 sm:mb-6 lg:mb-8">
        <div className="flex flex-wrap items-end gap-x-1 gap-y-1 text-[#0D1B2A]">
          <span className="text-2xl font-black sm:text-3xl">
            KSH {subscription.price.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-gray-400 sm:text-sm">
            /{getDurationLabel(subscription.days)}
          </span>
        </div>
      </div>

      <ul className="mb-6 flex-1 space-y-3 sm:mb-8 sm:space-y-4 lg:mb-10">
        {subscription.features.map((feature, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-gray-600 sm:gap-3"
          >
            <span className="mt-0.5 shrink-0 text-[#0D1B2A]">✦</span>
            <span className="leading-6">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onBuyNow(subscription)}
        variant={isPopular ? "default" : "outline"}
        className={`h-11 w-full rounded-lg text-sm font-bold transition-all sm:h-12 sm:text-base ${
          isPopular
            ? "bg-[#0D1B2A] text-white hover:bg-[#1A3A5C]"
            : "border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
        }`}
      >
        Buy Now
      </Button>
    </div>
  );
}