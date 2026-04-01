"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

interface FaqResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: FaqItem[];
  responseTime: string;
}

// Fetch function
const fetchFaqs = async (): Promise<FaqResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/faq`);
  if (!res.ok) {
    throw new Error("Failed to fetch FAQs");
  }
  return res.json();
};

export function FaqSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: fetchFaqs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const faqs = data?.data || [];

  // Skeleton Loader (matches your design)
  const FaqSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="py-2">
          <div className="flex items-center justify-between py-4">
            <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse" />
            <div className="h-7 w-7 rounded-full border border-gray-300 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-1 animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-red-500">Failed to load FAQs. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1C39]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#8A8A8A]">
            Find quick answers to the most common questions about our facilities and services.
          </p>
        </div>

        {/* Accordion with Loading State */}
        <Accordion type="single" collapsible className="w-full">
          {isLoading ? (
            <FaqSkeleton />
          ) : (
            faqs.map((item, idx) => (
              <AccordionItem
                key={item._id || idx}
                value={`item-${idx}`}
                className="border-b-0 py-2"
              >
                <AccordionTrigger
                  className="
                    group flex w-full items-center
                    py-4 text-left text-[18px] font-semibold text-[#1E1E1E]
                    hover:no-underline [&>svg]:hidden
                  "
                >
                  <span>{item.question}</span>
                  <span
                    className="
                      ml-4 grid h-7 w-7 place-items-center rounded-full
                      border border-[#0B1C39] text-[#0B1C39]
                    "
                  >
                    <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                    <Minus className="h-4 w-4 hidden group-data-[state=open]:block" />
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-4 pr-10 text-base font-normal leading-6 text-[#7D7D7D]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>

        {!isLoading && faqs.length === 0 && (
          <div className="text-center py-12 text-[#8A8A8A]">
            No FAQs available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}