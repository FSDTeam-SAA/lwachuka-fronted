/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "../../_components/Header";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// ─── Schema ────────────────────────────────────────────────────────────────

const formSchema = z.object({
  campaignName: z.string().min(3, "Campaign name is required"),
  adType: z.string().min(1, "Please select ad type"),
  ctaUrl: z.string().url().optional(),
  media: z.array(z.instanceof(File)).min(1, "Upload at least one media file"),
  regions: z.array(z.string()).min(1, "Select at least one region"),
  audience: z.array(z.string()).min(1, "Select at least one audience group"),
  budget: z.string().min(1, "Budget is required"),
  duration: z.string().min(1, "Select duration"),
  startDate: z.string().min(1, "Start date is required"),
  paymentMethod: z.string().min(1, "Select payment method"),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 1, name: "Campaign Details" },
  { id: 2, name: "Upload Media" },
  { id: 3, name: "Target Audience & Region" },
  { id: 4, name: "Budget & Duration" },
  { id: 5, name: "Review & Submit" },
];

// ─── Main Component ────────────────────────────────────────────────────────

export default function AddAdvrtisements() {
  const [step, setStep] = useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignName: "",
      adType: "",
      ctaUrl: "",
      media: [],
      regions: [],
      audience: [],
      budget: "",
      duration: "",
      startDate: "",
      paymentMethod: "card",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  const currentValues = watch();

  const goNext = async () => {
    const isValidStep = await form.trigger(getFieldsForStep(step));
    if (isValidStep) {
      if (step < 5) setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  // ─── Add Advertisement Mutation ─────────────────────────────────────────────
  const addADVmutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();

      // ✅ API field names
      formData.append("companyName", data.campaignName);
      formData.append("advertisementType", data.adType);
      if (data.ctaUrl) formData.append("callToActionURL", data.ctaUrl);
      formData.append("compaingBudget", data.budget);

      // ✅ duration as plain number string e.g. "30"
      formData.append("compaingDuration", data.duration);

      // ✅ startDate as ISO string
      formData.append("startDate", new Date(data.startDate).toISOString());

      // ✅ endDate calculated from startDate + duration days
      const end = new Date(data.startDate);
      end.setDate(end.getDate() + parseInt(data.duration));
      formData.append("endDate", end.toISOString());

      // ✅ Payment Status
      formData.append("paymentStatus", "Paid");

      // ✅ targetRegions & targetAudience as JSON array string
      // e.g. '["Nairobi","Nakuru"]'
      formData.append("targetRegions", JSON.stringify(data.regions));
      formData.append("targetAudience", JSON.stringify(data.audience));

      // ✅ media files
      data.media.forEach((file) => formData.append("uploadMedia", file));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/advertisement`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to create advertisement");
      }

      return res.json();
    },
    onSuccess: (res) => {
      toast.success("Campaign successfully submitted!");
      console.log("API Response:", res);
    },
    onError: (err: any) => {
      toast.error(err.message || "Something went wrong!");
      console.error(err);
    },
  });

  const onSubmit = (data: FormValues) => {
    addADVmutation.mutate(data);
  };

  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return ["campaignName", "adType", "ctaUrl"];
      case 2:
        return ["media"];
      case 3:
        return ["regions", "audience"];
      case 4:
        return ["budget", "duration", "startDate", "paymentMethod"];
      default:
        return [];
    }
  };

  const isLastStep = step === 5;

  return (
    <div>
      <Header
        title="Create New Advertisement"
        subtitle="Launch a new campaign to reach real estate professionals"
      />
      <div className="mt-6 sm:mt-10">
        {/* Progress Bar */}
        <div className="mb-8 max-w-6xl mx-auto px-2 sm:px-0">
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center min-w-[700px] sm:min-w-0">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                {/* Step Circle + Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all",
                      step >= s.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-[#E9EAEB] text-muted-foreground",
                    )}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : `0${s.id}`}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-[11px] sm:text-xs text-center whitespace-nowrap px-1",
                      step >= s.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mx-2 sm:mx-3 self-start mt-5 sm:mt-6 transition-all"
                    style={{
                      background:
                        step > s.id ? "hsl(var(--primary))" : "#E9EAEB",
                    }}
                  />
                )}
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>
                Step {step}: {steps[step - 1].name}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Enter basic information about your campaign"}
                {step === 2 && "Upload high-quality images or videos"}
                {step === 3 && "Define who and where to show your ad"}
                {step === 4 && "Set your budget and campaign duration"}
                {step === 5 && "Review everything before publishing"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* ─── STEP 1 ──────────────────────────────────────── */}
                {step === 1 && (
                  <div className="space-y-7">
                    <div>
                      <Label className="" htmlFor="campaignName">
                        Campaign Name *
                      </Label>
                      <Input
                        id="campaignName"
                        className="h-[48px] mt-2"
                        placeholder="e.g. Spring Moving Services Promotion"
                        {...register("campaignName")}
                      />
                      {errors.campaignName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.campaignName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Advertisement Type *</Label>
                      <Select
                        onValueChange={(val: string) =>
                          setValue("adType", val, { shouldValidate: true })
                        }
                        value={currentValues.adType}
                      >
                        <SelectTrigger className="h-[48px] mt-2">
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property_listing">
                            Property Listing
                          </SelectItem>
                          <SelectItem value="agent_promo">
                            Agent Promotion
                          </SelectItem>
                          <SelectItem value="open_house">Open House</SelectItem>
                          <SelectItem value="lead_gen">
                            Lead Generation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.adType && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.adType.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="ctaUrl">Call-to-Action URL</Label>
                      <Input
                        id="ctaUrl"
                        className="h-[48px] mt-2"
                        placeholder="https://yourwebsite.com"
                        {...register("ctaUrl")}
                      />
                    </div>
                  </div>
                )}

                {/* ─── STEP 2 ──────────────────────────────────────── */}
                {step === 2 && (
                  <div className="space-y-4">
                    <input
                      type="file"
                      id="mediaInput"
                      multiple
                      accept="image/png,image/jpeg,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setValue("media", files, { shouldValidate: true });
                      }}
                    />

                    <div
                      className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() =>
                        document.getElementById("mediaInput")?.click()
                      }
                    >
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">
                        Upload images or videos
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PNG, JPG up to 10MB each (max 10 files) • Recommended
                        1200×628
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        className="mt-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("mediaInput")?.click();
                        }}
                      >
                        Choose Files
                      </Button>
                    </div>

                    {/* Image Preview Grid */}
                    {currentValues.media.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from(currentValues.media).map(
                          (file: File, index: number) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border bg-muted aspect-square"
                            >
                              {file.type.startsWith("image/") ? (
                                <Image
                                  width={300}
                                  height={300}
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                                  <Upload className="h-6 w-6" />
                                  <span className="text-xs text-center px-1 truncate w-full">
                                    {file.name}
                                  </span>
                                </div>
                              )}

                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = Array.from(
                                    currentValues.media,
                                  ).filter((_: File, i: number) => i !== index);
                                  setValue("media", updated, {
                                    shouldValidate: true,
                                  });
                                }}
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ✕
                              </button>

                              {/* File name tooltip */}
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {file.name}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                      <p className="text-sm font-semibold text-blue-800 mb-3">
                        Media Guidelines
                      </p>
                      <ul className="space-y-1.5">
                        {[
                          "Recommended image size: 1200x628 pixels",
                          "Use high-quality images that represent your brand",
                          "Videos should be under 60 seconds",
                          "Ensure all text is readable and professional",
                        ].map((tip) => (
                          <li
                            key={tip}
                            className="flex items-start gap-2 text-sm text-blue-700"
                          >
                            <span className="mt-0.5 text-blue-400">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3 ──────────────────────────────────────── */}
                {step === 3 && (
                  <div className="space-y-8">
                    {/* Target Regions */}
                    <div>
                      <Label className="text-base font-semibold">
                        Target Regions *
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Select the regions where your ad will be shown
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          "Nairobi",
                          "Nakuru",
                          "Mombasa",
                          "Kisumu",
                          "Eldoret",
                          "Thika",
                        ].map((r) => {
                          const isChecked = currentValues.regions.includes(r);
                          return (
                            <div
                              key={r}
                              onClick={() => {
                                const newRegions = isChecked
                                  ? currentValues.regions.filter((v) => v !== r)
                                  : [...currentValues.regions, r];
                                setValue("regions", newRegions, {
                                  shouldValidate: true,
                                });
                              }}
                              className={`cursor-pointer rounded-lg border-2 px-4 py-3 flex items-center gap-3 transition-all select-none
                ${isChecked ? "border-primary bg-primary/5" : "border-muted hover:border-primary/40 bg-white"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isChecked ? "bg-primary border-primary" : "border-gray-300"}`}
                              >
                                {isChecked && (
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-medium">{r}</span>
                            </div>
                          );
                        })}
                      </div>
                      {errors.regions && (
                        <p className="text-destructive text-sm mt-2">
                          {errors.regions.message}
                        </p>
                      )}
                    </div>

                    {/* Target Audience */}
                    <div>
                      <Label className="text-base font-semibold">
                        Target Audience *
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">
                        Choose the audience groups you want to reach
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          "Buyers",
                          "Families",
                          "Investors",
                          "Renters",
                          "Agents",
                          "Sellers",
                        ].map((a) => {
                          const isChecked = currentValues.audience.includes(a);
                          return (
                            <div
                              key={a}
                              onClick={() => {
                                const newAudience = isChecked
                                  ? currentValues.audience.filter(
                                      (v) => v !== a,
                                    )
                                  : [...currentValues.audience, a];
                                setValue("audience", newAudience, {
                                  shouldValidate: true,
                                });
                              }}
                              className={`cursor-pointer rounded-lg border-2 px-4 py-3 flex items-center gap-3 transition-all select-none
                ${isChecked ? "border-primary bg-primary/5" : "border-muted hover:border-primary/40 bg-white"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isChecked ? "bg-primary border-primary" : "border-gray-300"}`}
                              >
                                {isChecked && (
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-medium">{a}</span>
                            </div>
                          );
                        })}
                      </div>
                      {errors.audience && (
                        <p className="text-destructive text-sm mt-2">
                          {errors.audience.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── STEP 4 ──────────────────────────────────────── */}
                {step === 4 && (
                  <div className="space-y-6">
                    {/* Campaign Budget */}
                    <div>
                      <Label htmlFor="budget" className="font-medium">
                        Campaign Budget *
                      </Label>
                      <Input
                        id="budget"
                        className="h-[48px] mt-2"
                        placeholder="KES 85.0M"
                        {...register("budget")}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Set your total advertising budget for this campaign
                      </p>
                      {errors.budget && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.budget.message}
                        </p>
                      )}
                    </div>

                    {/* Campaign Duration */}
                    <div>
                      <Label className="font-medium">Campaign Duration *</Label>
                      <Select
                        onValueChange={(val: string) =>
                          setValue("duration", val, { shouldValidate: true })
                        }
                        value={currentValues.duration}
                      >
                        <SelectTrigger className="h-[48px] mt-2">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="60">60 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.duration && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.duration.message}
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div>
                      <Label htmlFor="startDate" className="font-medium">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        className="h-[48px] mt-2"
                        {...register("startDate")}
                      />
                      {errors.startDate && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label className="font-medium">Payment Method *</Label>
                      <div className="mt-2 space-y-2">
                        {[
                          { value: "card", label: "Credit/Debit Card" },
                          {
                            value: "existing",
                            label: "Use Existing Payment Method",
                          },
                          { value: "invoice", label: "Request Invoice" },
                        ].map((method) => {
                          const isSelected =
                            currentValues.paymentMethod === method.value;
                          return (
                            <div
                              key={method.value}
                              onClick={() => {
                                setValue("paymentMethod", method.value, {
                                  shouldValidate: true,
                                });
                              }}
                              className={`cursor-pointer rounded-lg border px-4 h-[48px] flex items-center gap-3 transition-all select-none
                ${isSelected ? "border-primary bg-primary/5" : "border-muted hover:border-primary/40 bg-white"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected ? "border-primary" : "border-gray-300"}`}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <span className="text-sm font-medium">
                                {method.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {errors.paymentMethod && (
                        <p className="text-destructive text-sm mt-1">
                          {errors.paymentMethod.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── STEP 5 ──────────────────────────────────────── */}
                {step === 5 && (
                  <div className="space-y-6">
                    {/* Campaign Summary Card */}
                    <div className="border rounded-lg p-6 bg-blue-50/50">
                      <p className="font-semibold text-base mb-4">
                        Campaign Summary
                      </p>
                      <div className="space-y-3">
                        {[
                          {
                            label: "Campaign Name:",
                            value: currentValues.campaignName || "Not set",
                          },
                          {
                            label: "Ad Type:",
                            value: currentValues.adType || "Not selected",
                          },
                          { label: "Headline:", value: "Not set" },
                          {
                            label: "Target Regions:",
                            value: `${currentValues.regions.length} regions`,
                          },
                          {
                            label: "Target Audience:",
                            value: `${currentValues.audience.length} groups`,
                          },
                          {
                            label: "Budget:",
                            value: currentValues.budget
                              ? `KES ${currentValues.budget}`
                              : "$0",
                          },
                          {
                            label: "Duration:",
                            value: currentValues.duration
                              ? `${currentValues.duration} Days`
                              : "Not selected",
                          },
                          {
                            label: "Uploaded Files:",
                            value: `${currentValues.media.length} files`,
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3"
                          >
                            <span className="text-sm text-muted-foreground">
                              {item.label}
                            </span>
                            <span className="text-sm font-medium break-all sm:text-right">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="border rounded-lg px-4 py-3 flex items-start gap-3">
                      <Checkbox id="terms" className="mt-0.5" />
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal leading-relaxed cursor-pointer"
                      >
                        I agree to the Terms of Service and confirm that all
                        information provided is accurate. I understand that my
                        ad will be reviewed before going live.
                      </Label>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>

            <CardFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-0 justify-between">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={step === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {!isLastStep ? (
                <Button onClick={goNext} className="w-full sm:w-auto">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || addADVmutation.isPending}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  {addADVmutation.isPending ? "Publishing..." : "Publish Campaign"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
