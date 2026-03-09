"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarGridProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    bookedDates: string[]; // array of "yyyy-MM-dd" strings
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ selectedDate, onSelectDate, bookedDates }: CalendarGridProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Calendar logic
    const startOfMonth = new Date(year, month, 1);
    const startDay = startOfMonth.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Navigation
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    };

    // Generate the days array (42 cells: 6 rows * 7 cols)
    const days: { date: Date; type: "prev" | "current" | "next" }[] = [];

    // Previous month overflow
    for (let i = startDay - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonthDays - i),
            type: "prev",
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: new Date(year, month, i),
            type: "current",
        });
    }

    // Next month overflow
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            type: "next",
        });
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_-3px_rgba(6,81,237,0.05)] border border-gray-100 p-6 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-[#0D1B2A] mb-1">Calendar</h2>
                    <p className="text-sm text-gray-500">Select a date to view visits</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-[#0D1B2A]">
                        {format(currentMonth, "MMMM yyyy")}
                    </span>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-gray-500 hover:text-[#0D1B2A] hover:bg-white hover:shadow-sm"
                            onClick={handlePrevMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md text-gray-500 hover:text-[#0D1B2A] hover:bg-white hover:shadow-sm"
                            onClick={handleNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-4">
                {/* Day Headers */}
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 pb-4"
                    >
                        {day}
                    </div>
                ))}

                {/* Date Cells */}
                {days.map((cell, index) => {
                    const isBooked = bookedDates.includes(format(cell.date, "yyyy-MM-dd"));
                    const today = isToday(cell.date);
                    const selected = isSelected(cell.date);

                    return (
                        <div
                            key={index}
                            className="flex justify-center"
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    if (cell.type === "current") {
                                        onSelectDate(cell.date);
                                    } else if (cell.type === "prev") {
                                        handlePrevMonth();
                                        onSelectDate(cell.date);
                                    } else {
                                        handleNextMonth();
                                        onSelectDate(cell.date);
                                    }
                                }}
                                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-lg text-sm transition-all
                  ${cell.type !== "current" ? "text-gray-300 hover:bg-transparent" : "text-gray-700 hover:bg-gray-50 cursor-pointer"}
                  ${today && cell.type === "current" && !selected ? "bg-[#F3F6FA] font-bold text-[#0D1B2A]" : ""}
                  ${selected ? "bg-[#0D1B2A] text-white font-semibold hover:bg-[#0D1B2A]" : ""}
                `}
                            >
                                {cell.date.getDate()}

                                {/* Booking Indicator dot */}
                                {isBooked && (
                                    <span
                                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${selected ? "bg-white" : "bg-[#0D1B2A]"
                                            }`}
                                    />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
