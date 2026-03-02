'use client';

import { useState } from 'react';
import { Search, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchFilter() {
  const [activeType, setActiveType] = useState('All');

  const types = ['All', 'House', 'Residential', 'Apartment'];

  return (
    <section className="">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Looking For */}
            <div>
              <label className="block text-xl font-semibold text-[#1E1E1E]">
                Looking For
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Enter Type"
                  className="pl-10 h-[40px] bg-[#F7F7F7] border-[#CECECE] placeholder:text-[#7D7D7D]"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="bblock text-xl font-semibold text-[#1E1E1E]">
                Location
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Location"
                  className="pl-10 h-[40px] bg-[#F7F7F7] border-[#CECECE] placeholder:text-[#7D7D7D]"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xl font-semibold text-[#1E1E1E]">
                Price
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Price"
                  className="pl-10 h-[40px] bg-[#F7F7F7] border-[#CECECE] placeholder:text-[#7D7D7D]"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Row */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Buy/Sell Buttons */}
            <div className="flex gap-2">
              <Button
                variant={activeType === 'Buy' ? 'default' : 'outline'}
                size="sm"
                className={activeType === 'Buy' ? 'bg-primary' : ''}
              >
                Buy
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                Sell
              </Button>
            </div>

            {/* Property Type Tags */}
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={activeType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveType(type)}
                  className={activeType === type ? 'bg-primary' : ''}
                >
                  {type}
                </Button>
              ))}
              <Button variant="ghost" size="sm">
                <Sliders className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Find Properties Button */}
            <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Find Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
