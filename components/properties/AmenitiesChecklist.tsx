"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PREDEFINED_AMENITIES = [
    "Furnished",
    "Concierge",
    "Pet-Friendly",
    "Meal Preparation And Service",
    "Faith Based",
    "Community-Sponsored Activities",
    "Move-In Coordination",
    "Special Dietary Restrictions",
    "Emergency Alert System",
    "Transportation & Parking",
];

interface AmenitiesChecklistProps {
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function AmenitiesChecklist({ selected, onChange }: AmenitiesChecklistProps) {
    const [customAmenity, setCustomAmenity] = useState("");

    const toggleAmenity = (amenity: string) => {
        if (selected.includes(amenity)) {
            onChange(selected.filter((a) => a !== amenity));
        } else {
            onChange([...selected, amenity]);
        }
    };

    const handleAddCustom = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && customAmenity.trim()) {
            e.preventDefault();
            if (!selected.includes(customAmenity.trim())) {
                onChange([...selected, customAmenity.trim()]);
            }
            setCustomAmenity("");
        }
    };

    // Combine predefined and any extra in selected
    const allToDisplay = Array.from(new Set([...PREDEFINED_AMENITIES, ...selected]));

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {allToDisplay.map((amenity) => (
                    <div
                        key={amenity}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                            {amenity}
                        </Label>
                        <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selected.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                            className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#0B2B4B] data-[state=checked]:border-[#0B2B4B]"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                    Add Custom Amenity
                </Label>
                <Input
                    placeholder="Type amenities and press Enter"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyDown={handleAddCustom}
                    className="h-10 rounded-lg border-gray-200 focus:ring-[#0B2B4B]"
                />
            </div>
        </div>
    );
}
