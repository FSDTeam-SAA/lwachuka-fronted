"use client";

import React, { useEffect, useState } from "react";
import { useForm, type Resolver, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Property, PropertyFormData } from "@/types/properties";
import {
    createProperty,
    updateProperty,
    propertyKeys,
    buildPropertyFormData
} from "@/lib/queries/properties";
import { PropertyImageUpload } from "./PropertyImageUpload";
import { AmenitiesChecklist } from "./AmenitiesChecklist";

const trimToUndefined = (val: unknown) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    return trimmed === "" ? undefined : trimmed;
};

const optionalString = z.preprocess(trimToUndefined, z.string().optional());
const optionalNumber = z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (typeof val === "number" && Number.isNaN(val)) return undefined;
    return val;
}, z.number().optional());

const propertyTypeOptions = [
    "Apartment",
    "Studio",
    "Penthouse",
    "Duplex",
    "Condo",
    "Bungalow",
    "Land",
] as const;

const optionalListingType = z.preprocess(
    trimToUndefined,
    z.enum(["For Sale", "For Rent"]).optional()
);

const optionalPropertyType = z.preprocess(
    trimToUndefined,
    z.enum(propertyTypeOptions).optional()
);

const optionalBoolean = z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
}, z.boolean().optional());

const schema = z.object({
    title: optionalString,
    listingType: optionalListingType,
    propertyType: optionalPropertyType,
    bedrooms: optionalNumber,
    bathrooms: optionalNumber,
    area: optionalNumber,
    landArea: optionalNumber,
    description: optionalString,
    location: optionalString,
    lat: optionalNumber,
    lng: optionalNumber,
    price: optionalNumber,
    // Optional detailed fields
    builtUp: optionalNumber,
    plot: optionalNumber,
    acres: optionalNumber,
    keyBedRooms: optionalString,
    keyBathrooms: optionalString,
    keyBuiltUp: optionalNumber,
    keyKitchenType: optionalString,
    keyParking: optionalString,
    keyFinishes: optionalString,
    keyBalconyType: optionalString,
    keyStorage: optionalString,
    keyCoolingSystem: optionalString,
    keyMoveInStatus: optionalString,
    purpose: optionalString,
    referenceNumber: optionalString,
    furnishing: optionalString,
    addedOn: optionalString,
    originalPrice: optionalNumber,
    handoverDate: optionalString,
    parking: optionalBoolean,
    gatedCommunity: optionalBoolean,
    staffQuarters: optionalBoolean,
}).partial();

type FormValues = z.infer<typeof schema>;

interface PropertyFormProps {
    mode: "create" | "edit";
    propertyId?: string;
    initialData?: Property;
    onSuccess?: () => void;
}

export function PropertyForm({ mode, propertyId, initialData, onSuccess }: PropertyFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as Resolver<FormValues>,
        defaultValues: {
            listingType: "For Sale",
        },
    });

    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = form;

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                listingType: initialData.listingType,
                propertyType: initialData.propertyType,
                bedrooms: initialData.bedrooms,
                bathrooms: initialData.bathrooms,
                area: initialData.area,
                landArea: initialData.landArea,
                description: initialData.description || "",
                location: initialData.location,
                lat: initialData.lat,
                lng: initialData.lng,
                price: initialData.price,
                builtUp: initialData.builtUp,
                plot: initialData.plot,
                acres: initialData.acres,
                keyBedRooms: initialData.keyBedRooms,
                keyBathrooms: initialData.keyBathrooms,
                keyBuiltUp: initialData.keyBuiltUp,
                keyKitchenType: initialData.keyKitchenType,
                keyParking: initialData.keyParking,
                keyFinishes: initialData.keyFinishes,
                keyBalconyType: initialData.keyBalconyType,
                keyStorage: initialData.keyStorage,
                keyCoolingSystem: initialData.keyCoolingSystem,
                keyMoveInStatus: initialData.keyMoveInStatus,
                purpose: initialData.purpose,
                referenceNumber: initialData.referenceNumber,
                furnishing: initialData.furnishing,
                addedOn: initialData.addedOn,
                originalPrice: initialData.originalPrice,
                handoverDate: initialData.handoverDate,
                parking: initialData.parking,
                gatedCommunity: initialData.gatedCommunity,
                staffQuarters: initialData.staffQuarters,
            });
            setExistingImages(initialData.images || []);
            setSelectedAmenities(initialData.propertyCommunityAmenities || []);
        }
    }, [initialData, reset]);

    const createMutation = useMutation({
        mutationFn: (fd: FormData) => createProperty(fd),
        onSuccess: () => {
            toast.success("Property created successfully");
            queryClient.invalidateQueries({ queryKey: propertyKeys.myList() });
            onSuccess?.();
        },
        onError: () => toast.error("Failed to create property"),
    });

    const updateMutation = useMutation({
        mutationFn: (fd: FormData) => updateProperty(propertyId!, fd),
        onSuccess: () => {
            toast.success("Property updated successfully");
            queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId!) });
            queryClient.invalidateQueries({ queryKey: propertyKeys.myList() });
            onSuccess?.();
        },
        onError: () => toast.error("Failed to update property"),
    });

    const onSubmit = (data: FormValues) => {
        // Sanitize numeric fields: handle NaN from valueAsNumber: true for empty optional fields
        const sanitizedData = { ...data };
        const numericFields: (keyof FormValues)[] = [
            "bedrooms", "bathrooms", "area", "price",
            "builtUp", "plot", "acres", "landArea", "keyBuiltUp", "originalPrice",
            "lat", "lng"
        ];

        numericFields.forEach(field => {
            if (typeof sanitizedData[field] === 'number' && isNaN(sanitizedData[field] as number)) {
                delete sanitizedData[field];
            }
        });

        const isLand = sanitizedData.propertyType === "Land";
        if (isLand) {
            delete sanitizedData.bedrooms;
            delete sanitizedData.bathrooms;
            delete sanitizedData.builtUp;
            delete sanitizedData.plot;
        } else {
            delete sanitizedData.acres;
            delete sanitizedData.landArea;
        }

        // Backend currently rejects these fields via DTO whitelist
        delete sanitizedData.parking;
        delete sanitizedData.gatedCommunity;
        delete sanitizedData.staffQuarters;

        const formDataObj: PropertyFormData = {
            ...sanitizedData,
            images: newImages,
            propertyCommunityAmenities: selectedAmenities,
        } as PropertyFormData;

        const fd = buildPropertyFormData(formDataObj);

        // Add existing images to formData if in edit mode
        if (mode === "edit") {
            existingImages.forEach(img => fd.append("images", img));
        }

        if (mode === "create") {
            createMutation.mutate(fd);
        } else {
            updateMutation.mutate(fd);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;
    const selectedPropertyType = watch("propertyType");
    const isLand = selectedPropertyType === "Land";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 pb-20">
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Basic Information</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Property Title</Label>
                        <Input {...register("title")} placeholder="Modern 3-Bedroom Apartment in Westland's" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Property Type</Label>
                        <Select
                            onValueChange={(val) => setValue("propertyType", val as FormValues["propertyType"])}
                            value={watch("propertyType")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {propertyTypeOptions.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.propertyType && <p className="text-xs text-red-500">{errors.propertyType.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Listing Type</Label>
                        <Select
                            onValueChange={(val) => setValue("listingType", val as "For Sale" | "For Rent")}
                            value={watch("listingType")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Listing Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="For Sale">For Sale</SelectItem>
                                <SelectItem value="For Rent">For Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section 2: Property Details */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {isLand ? (
                        <>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Acres</Label>
                                <Input type="number" {...register("acres", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Land Area (sq ft)</Label>
                                <Input type="number" {...register("landArea", { valueAsNumber: true })} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label>Bedrooms</Label>
                                <Input type="number" {...register("bedrooms", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Bathrooms</Label>
                                <Input type="number" {...register("bathrooms", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Built-up (sq ft)</Label>
                                <Input type="number" {...register("builtUp", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Plot (sq ft)</Label>
                                <Input type="number" {...register("plot", { valueAsNumber: true })} />
                            </div>
                        </>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        {...register("description")}
                        placeholder="Describe the property features, amenities, and unique selling points..."
                        className="min-h-[150px]"
                    />
                </div>
            </div>

            {/* Section 3: Key Property Highlights */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Key Property Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label>Bedrooms</Label>
                        <Input {...register("keyBedRooms")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Input {...register("keyBathrooms")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Built-up (sq ft)</Label>
                        <Input type="number" {...register("keyBuiltUp", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Kitchen Type</Label>
                        <Input {...register("keyKitchenType")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Parking</Label>
                        <Input {...register("keyParking")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Finishes</Label>
                        <Input {...register("keyFinishes")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Balcony Type</Label>
                        <Input {...register("keyBalconyType")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Storage</Label>
                        <Input {...register("keyStorage")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Cooling System</Label>
                        <Input {...register("keyCoolingSystem")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Move-in Status</Label>
                        <Input {...register("keyMoveInStatus")} />
                    </div>
                </div>
            </div>

            {/* Section 4: Property & Community Amenities */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Property & Community Amenities</h3>
                <AmenitiesChecklist
                    selected={selectedAmenities}
                    onChange={setSelectedAmenities}
                />
            </div>

            {/* Section 5: Property Features */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Controller
                        control={control}
                        name="parking"
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Label>Parking</Label>
                                <Select
                                    value={
                                        field.value === true
                                            ? "true"
                                            : field.value === false
                                            ? "false"
                                            : ""
                                    }
                                    onValueChange={(val) => field.onChange(val === "true")}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Yes</SelectItem>
                                        <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="gatedCommunity"
                        render={({ field }) => (
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="gatedCommunity"
                                    checked={field.value ?? false}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                                <Label htmlFor="gatedCommunity" className="cursor-pointer">
                                    Gated Community
                                </Label>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="staffQuarters"
                        render={({ field }) => (
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="staffQuarters"
                                    checked={field.value ?? false}
                                    onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                                <Label htmlFor="staffQuarters" className="cursor-pointer">
                                    Staff Quarters
                                </Label>
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Section 6: Property Information */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label>Purpose</Label>
                        <Input {...register("purpose")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Reference Number</Label>
                        <Input {...register("referenceNumber")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Furnishing</Label>
                        <Input {...register("furnishing")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Added On</Label>
                        <Input {...register("addedOn")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Original Price</Label>
                        <Input type="number" {...register("originalPrice", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Handover Date</Label>
                        <Input {...register("handoverDate")} />
                    </div>
                </div>
            </div>

            {/* Section 7: Location & Price */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Location & Price</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input {...register("location")} placeholder="Nairobi, Westlands, Riverside Drive" />
                        {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Latitude</Label>
                            <Input type="number" step="any" {...register("lat", { valueAsNumber: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Longitude</Label>
                            <Input type="number" step="any" {...register("lng", { valueAsNumber: true })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Price (KSh)</Label>
                        <Input type="number" {...register("price", { valueAsNumber: true })} />
                        {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                    </div>
                    {/* Technical Area for API consistency */}
                    <div className="space-y-2">
                        <Label>Area (sq ft)</Label>
                        <Input type="number" {...register("area", { valueAsNumber: true })} />
                        {errors.area && <p className="text-xs text-red-500">{errors.area.message}</p>}
                    </div>
                </div>
            </div>

            {/* Section 8: Property Images */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-base font-semibold leading-[150%] text-gray-900 border-b border-gray-100 pb-4">Property Images</h3>
                <PropertyImageUpload
                    existingImages={existingImages}
                    newImages={newImages}
                    onExistingRemove={(url) => setExistingImages(prev => prev.filter(i => i !== url))}
                    onNewRemove={(idx) => setNewImages(prev => prev.filter((_, i) => i !== idx))}
                    onNewAdd={(files) => setNewImages(prev => [...prev, ...files])}
                />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="px-10 h-12 rounded-lg border-red-500 text-red-500 hover:bg-red-50"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 h-12 rounded-lg bg-[#0B2B4B] text-white hover:bg-[#0B2B4B]/90"
                >
                    {isSubmitting ? "Processing..." : mode === "create" ? "Create Property" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
