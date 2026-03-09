// "use client";

// import Image from "next/image";
// import { useMemo, useState } from "react";
// import {
//   ChevronDown,
//   MapPin,
//   Search,
//   SlidersHorizontal,
//   Share2,
//   Heart,
//   Mail,
//   BedDouble,
//   Bath,
//   Ruler,
// } from "lucide-react";

// type TabKey = "all" | "dubai" | "abudhabi" | "sharjah" | "ras";

// type Listing = {
//   id: number;
//   price: string;
//   location: string;
//   title: string;
//   image: string;
//   tag: "Off-Plan" | "Ready";
//   status: "Available" | "Sold";
//   beds: number;
//   baths: number;
//   builtUp: string;
//   plot: string;
// };

// function cn(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// /* ----------------------- Small UI pieces ----------------------- */

// function PillTab({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "h-12 rounded-lg px-3 text-[12px] font-medium transition",
//         active
//           ? "bg-[#0B1B33] text-white"
//           : "text-slate-600 hover:bg-slate-100"
//       )}
//       type="button"
//     >
//       {children}
//     </button>
//   );
// }

// function Chip({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={cn(
//         "h-12 rounded-lg border px-3 text-[12px] font-medium transition inline-flex items-center gap-2",
//         active
//           ? "border-[#0B1B33] bg-[#0B1B33] text-white"
//           : "border-slate-200 bg-[#0000000D] text-slate-700 hover:bg-slate-50"
//       )}
//     >
//       {children}
//       <ChevronDown className={cn("h-4 w-4", active ? "opacity-90" : "opacity-60")} />
//     </button>
//   );
// }

// function Toggle({
//   value,
//   onChange,
// }: {
//   value: boolean;
//   onChange: (v: boolean) => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={() => onChange(!value)}
//       className={cn(
//         "relative h-6 w-11 rounded-full border transition",
//         value ? "bg-[#0B1B33] border-[#0B1B33]" : "bg-white border-slate-200"
//       )}
//       aria-pressed={value}
//     >
//       <span
//         className={cn(
//           "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition",
//           value ? "left-5" : "left-1"
//         )}
//       />
//     </button>
//   );
// }

// /* ----------------------- Main components ----------------------- */

// function MapPlaceholder({ showPins }: { showPins: boolean }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
     

//       <div className="mt-4 relative h-[380px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden rounded-xl bg-slate-100">
//         {/* Fake map background */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,6,23,0.12),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(2,6,23,0.10),transparent_50%)]" />
//         <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(2,6,23,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />

//         {/* “Kenya” label */}
//         <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-[42px] font-black tracking-tight text-slate-700/70">
//           Kenya
//         </div>

//         {/* Pins */}
//         {showPins && (
//           <>
//             <div className="absolute left-[30%] top-[45%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
//             <div className="absolute left-[36%] top-[58%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
//             <div className="absolute left-[42%] top-[65%] h-4 w-4 rounded-full bg-sky-500 shadow-[0_10px_20px_rgba(14,165,233,0.25)] ring-4 ring-sky-200" />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function ListingCard({ item }: { item: Listing }) {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
//         {/* Image */}
//         <div className="relative h-[220px] md:h-full bg-slate-100">
//           <Image
//             src={item.image}
//             alt={item.title}
//             fill
//             className="object-cover"
//             sizes="(max-width: 768px) 100vw, 280px"
//           />
//           <span className="absolute left-3 top-3 rounded-full bg-[#0B1B33] px-3 py-1 text-[11px] font-semibold text-white">
//             {item.tag}
//           </span>
//         </div>

//         {/* Content */}
//         <div className="p-4 sm:p-5">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <div className="text-[24px] font-semibold text-[#1E1E1E]">{item.price}</div>
//               <div className="mt-1 text-[16px] text-[#7D7D7D] flex items-center gap-2">
//                 <span>
//                     <MapPin className="h-3.5 w-3.5" />
//                 </span>
//                 {item.location}</div>
//             </div>

//             <div className="inline-flex items-center gap-4 text-slate-500">
//               <button className="inline-flex items-center gap-2 text-[16px] hover:text-slate-700" type="button">
//                 <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share</span>
//               </button>
//               <button className="inline-flex items-center gap-2 text-[16px] hover:text-slate-700" type="button">
//                 <Heart className="h-4 w-4" /> <span className="hidden sm:inline">Favorite</span>
//               </button>
//             </div>
//           </div>

//           <div className="mt-3 flex flex-wrap items-center gap-2">
//             <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">
//               {item.status}
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
//               <BedDouble className="h-3.5 w-3.5 text-slate-500" /> {item.beds} Beds
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
//               <Bath className="h-3.5 w-3.5 text-slate-500" /> {item.baths} Baths
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
//               <Ruler className="h-3.5 w-3.5 text-slate-500" /> Built-up: {item.builtUp}
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
//               <Ruler className="h-3.5 w-3.5 text-slate-500" /> Plot: {item.plot}
//             </span>
//           </div>

//           <div className="mt-3 text-[16px] text-[#1E1E1E]">{item.title}</div>

//           <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <button
//               type="button"
//               className="h-10 w-full sm:w-[260px] rounded-lg border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
//             >
//               <Mail className="h-4 w-4" /> Email
//             </button>

//             <button
//               type="button"
//               className="h-10 w-full sm:w-[260px] rounded-lg bg-[#0B1B33] text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2"
//             >
//               <Image src={'/WhatsApp.png'} width={1000} height={1000} className="w-5 h-5" alt={""}/>
//               WhatsApp
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------------- Page ----------------------- */

// export default function PropertiesSearchClone() {
//   const [showPins, setShowPins] = useState(true);
//   const [activeTab, setActiveTab] = useState<TabKey>("all");
//   const [activeQuick, setActiveQuick] = useState<"all" | "ready" | "offplan">("offplan");

//   const listings: Listing[] = useMemo(
//     () => [
//       {
//         id: 1,
//         price: "KSH 45.0M",
//         location: "Westland’s, Nairobi",
//         title: "Genuine Resale | End Unit | Luxurious",
//         image: "/vendor.png",
//         tag: "Off-Plan",
//         status: "Available",
//         beds: 5,
//         baths: 6,
//         builtUp: "2,364 sqft",
//         plot: "1,550 sqft",
//       },
//       {
//         id: 2,
//         price: "KSH 45.0M",
//         location: "Westland’s, Nairobi",
//         title: "Genuine Resale | End Unit | Luxurious",
//         image: "/vendor.png",
//         tag: "Off-Plan",
//         status: "Available",
//         beds: 5,
//         baths: 6,
//         builtUp: "2,364 sqft",
//         plot: "1,550 sqft",
//       },
//       {
//         id: 3,
//         price: "KSH 45.0M",
//         location: "Westland’s, Nairobi",
//         title: "Genuine Resale | End Unit | Luxurious",
//         image: "/vendor.png",
//         tag: "Off-Plan",
//         status: "Available",
//         beds: 5,
//         baths: 6,
//         builtUp: "2,364 sqft",
//         plot: "1,550 sqft",
//       },
//     ],
//     []
//   );

//   return (
//     <div className="w-full bg-white">
//       <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Top filter bar */}
//         <div className="rounded-2xl bg-white shadow-sm p-3 sm:p-4">
//           <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-3">
//             {/* location */}
//             <div className="relative w-full min-w-[220px] flex-1">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <input
//                 placeholder="Enter location"
//                 className="h-12 w-full rounded-lg bg-[#0000000D] pl-9 pr-3 text-[14px] text-[#1E1E1E] placeholder:text-[#1E1E1E] outline-none focus:border-slate-300"
//               />
//             </div>

//             <Chip active>Buy</Chip>

//             <Chip>Property type</Chip>
//             <Chip>Bed and Bath</Chip>
//             <div className="flex items-center gap-2 bg-[#0000000D]">

//             <button
//               type="button"
//               onClick={() => setActiveQuick("all")}
//               className={cn(
//                 "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
//                 activeQuick === "all"
//                   ? "bg-slate-900 text-white border-slate-900"
//                   : " text-slate-700"
//               )}
//             >
//               All
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveQuick("ready")}
//               className={cn(
//                 "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
//                 activeQuick === "ready"
//                   ? "bg-slate-900 text-white border-slate-900"
//                   : " text-slate-700 "
//               )}
//             >
//               Ready
//             </button>

//             <button
//               type="button"
//               onClick={() => setActiveQuick("offplan")}
//               className={cn(
//                 "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
//                 activeQuick === "offplan"
//                   ? "bg-[#0B1B33] text-white border-[#0B1B33]"
//                   : " text-slate-700 "
//               )}
//             >
//               Off-Plan
//             </button>
//             </div>

//             {/* advanced filters + search */}
//             <div className="flex w-full items-center gap-2 sm:w-auto lg:ml-auto">
//               <button
//                 type="button"
//                 className="h-12 rounded-lg bg-[#D3920E] px-4 text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2 whitespace-nowrap"
//               >
//                 <SlidersHorizontal className="h-4 w-4" />
//                 Show advanced filters
//               </button>

//               <button
//                 type="button"
//                 className="h-12 rounded-lg bg-[#0B1B33] px-4 text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2 whitespace-nowrap"
//               >
//                 <Search className="h-4 w-4" /> Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Title */}
//         <div className="mt-8">
//           <h1 className="text-[24px] sm:text-[40px] font-bold text-[#061F3D]">
//             Properties For Sale – <span className="text-[#0B1B33]">68</span> listings found
//           </h1>
//         </div>

//         {/* Tabs row */}
//         <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2">
//           <div className="flex flex-wrap gap-2">
//             <PillTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
//               All (68)
//             </PillTab>
//             <PillTab active={activeTab === "dubai"} onClick={() => setActiveTab("dubai")}>
//               Dubai (25)
//             </PillTab>
//             <PillTab active={activeTab === "abudhabi"} onClick={() => setActiveTab("abudhabi")}>
//               Abu Dhabi (15)
//             </PillTab>
//             <PillTab active={activeTab === "sharjah"} onClick={() => setActiveTab("sharjah")}>
//               Sharjah (15)
//             </PillTab>
//             <PillTab active={activeTab === "ras"} onClick={() => setActiveTab("ras")}>
//               Ras Al Khaimah (13)
//             </PillTab>
//           </div>
//         </div>

//         <div className="mt-7">
//              <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-700 shadow-sm">
//               <span className="font-medium">Show Pins</span>
//               <Toggle value={showPins} onChange={setShowPins} />
//             </div>
//         </div>
//         {/* Map + List */}
//         <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
//           {/* Left Map */}
//           <div className="lg:col-span-5">
           

//             <MapPlaceholder showPins={showPins} />
//           </div>

//           {/* Right list */}
//           <div className="space-y-5 lg:col-span-7">
//             {listings.map((item) => (
//               <ListingCard key={item.id} item={item} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Share2,
  Heart,
  Mail,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import EmailModal from "./_components/EmailModal";


type TabKey = "all" | "dubai" | "abudhabi" | "sharjah" | "ras";

type Listing = {
  id: number;
  price: string;
  location: string;
  title: string;
  image: string;
  tag: "Off-Plan" | "Ready";
  status: "Available" | "Sold";
  beds: number;
  baths: number;
  builtUp: string;
  plot: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ----------------------- Small UI pieces ----------------------- */

function PillTab({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-12 rounded-lg px-3 text-[12px] font-medium transition",
        active
          ? "bg-[#0B1B33] text-white"
          : "text-slate-600 hover:bg-slate-100"
      )}
      type="button"
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 rounded-lg border px-3 text-[12px] font-medium transition inline-flex items-center gap-2",
        active
          ? "border-[#0B1B33] bg-[#0B1B33] text-white"
          : "border-slate-200 bg-[#0000000D] text-slate-700 hover:bg-slate-50"
      )}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4", active ? "opacity-90" : "opacity-60")} />
    </button>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-6 w-11 rounded-full border transition",
        value ? "bg-[#0B1B33] border-[#0B1B33]" : "bg-white border-slate-200"
      )}
      aria-pressed={value}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow transition",
          value ? "left-5" : "left-1"
        )}
      />
    </button>
  );
}

/* ----------------------- Main components ----------------------- */

function MapPlaceholder({ showPins }: { showPins: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-4 relative h-[380px] sm:h-[440px] lg:h-[520px] w-full overflow-hidden rounded-xl bg-slate-100">
        {/* Fake map background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(2,6,23,0.12),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(2,6,23,0.10),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(2,6,23,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />

        {/* “Kenya” label */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-[42px] font-black tracking-tight text-slate-700/70">
          Kenya
        </div>

        {/* Pins */}
        {showPins && (
          <>
            <div className="absolute left-[30%] top-[45%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
            <div className="absolute left-[36%] top-[58%] h-4 w-4 rounded-full bg-rose-500 shadow-[0_10px_20px_rgba(244,63,94,0.35)] ring-4 ring-rose-200" />
            <div className="absolute left-[42%] top-[65%] h-4 w-4 rounded-full bg-sky-500 shadow-[0_10px_20px_rgba(14,165,233,0.25)] ring-4 ring-sky-200" />
          </>
        )}
      </div>
    </div>
  );
}

function ListingCard({
  item,
  onEmailClick,
}: {
  item: Listing;
  onEmailClick: (listing: Listing) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Image */}
        <div className="relative h-[220px] md:h-full bg-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#0B1B33] px-3 py-1 text-[11px] font-semibold text-white">
            {item.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[24px] font-semibold text-[#1E1E1E]">
                {item.price}
              </div>
              <div className="mt-1 text-[16px] text-[#7D7D7D] flex items-center gap-2">
                <span>
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                {item.location}
              </div>
            </div>

            <div className="inline-flex items-center gap-4 text-slate-500">
              <button
                className="inline-flex items-center gap-2 text-[16px] hover:text-slate-700"
                type="button"
              >
                <Share2 className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                className="inline-flex items-center gap-2 text-[16px] hover:text-slate-700"
                type="button"
              >
                <Heart className="h-4 w-4" />{" "}
                <span className="hidden sm:inline">Favorite</span>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">
              {item.status}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <BedDouble className="h-3.5 w-3.5 text-slate-500" /> {item.beds} Beds
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Bath className="h-3.5 w-3.5 text-slate-500" /> {item.baths} Baths
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Ruler className="h-3.5 w-3.5 text-slate-500" /> Built-up:{" "}
              {item.builtUp}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-700">
              <Ruler className="h-3.5 w-3.5 text-slate-500" /> Plot: {item.plot}
            </span>
          </div>

          <div className="mt-3 text-[16px] text-[#1E1E1E]">{item.title}</div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => onEmailClick(item)}
              className="h-10 w-full sm:w-[260px] rounded-lg border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" /> Email
            </button>

            <button
              type="button"
              className="h-10 w-full sm:w-[260px] rounded-lg bg-[#0B1B33] text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2"
            >
              <Image
                src={"/WhatsApp.png"}
                width={1000}
                height={1000}
                className="w-5 h-5"
                alt=""
              />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Page ----------------------- */

export default function PropertiesSearchClone() {
  const [showPins, setShowPins] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [activeQuick, setActiveQuick] = useState<"all" | "ready" | "offplan">(
    "offplan"
  );

  // ✅ email modal state
  const [emailOpen, setEmailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const openEmailModal = (listing: Listing) => {
    setSelectedListing(listing);
    setEmailOpen(true);
  };

  const listings: Listing[] = useMemo(
    () => [
      {
        id: 1,
        price: "KSH 45.0M",
        location: "Westland’s, Nairobi",
        title: "Genuine Resale | End Unit | Luxurious",
        image: "/vendor.png",
        tag: "Off-Plan",
        status: "Available",
        beds: 5,
        baths: 6,
        builtUp: "2,364 sqft",
        plot: "1,550 sqft",
      },
      {
        id: 2,
        price: "KSH 45.0M",
        location: "Westland’s, Nairobi",
        title: "Genuine Resale | End Unit | Luxurious",
        image: "/vendor.png",
        tag: "Off-Plan",
        status: "Available",
        beds: 5,
        baths: 6,
        builtUp: "2,364 sqft",
        plot: "1,550 sqft",
      },
      {
        id: 3,
        price: "KSH 45.0M",
        location: "Westland’s, Nairobi",
        title: "Genuine Resale | End Unit | Luxurious",
        image: "/vendor.png",
        tag: "Off-Plan",
        status: "Available",
        beds: 5,
        baths: 6,
        builtUp: "2,364 sqft",
        plot: "1,550 sqft",
      },
    ],
    []
  );

  return (
    <div className="w-full bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Top filter bar */}
        <div className="rounded-2xl bg-white shadow-sm p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-3">
            {/* location */}
            <div className="relative w-full min-w-[220px] flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Enter location"
                className="h-12 w-full rounded-lg bg-[#0000000D] pl-9 pr-3 text-[14px] text-[#1E1E1E] placeholder:text-[#1E1E1E] outline-none focus:border-slate-300"
              />
            </div>

            <Chip active>Buy</Chip>
            <Chip>Property type</Chip>
            <Chip>Bed and Bath</Chip>

            <div className="flex items-center gap-2 bg-[#0000000D] rounded-lg px-2">
              <button
                type="button"
                onClick={() => setActiveQuick("all")}
                className={cn(
                  "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
                  activeQuick === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "text-slate-700 border-transparent"
                )}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setActiveQuick("ready")}
                className={cn(
                  "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
                  activeQuick === "ready"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "text-slate-700 border-transparent"
                )}
              >
                Ready
              </button>

              <button
                type="button"
                onClick={() => setActiveQuick("offplan")}
                className={cn(
                  "h-12 rounded-lg border px-3 text-[12px] font-medium transition",
                  activeQuick === "offplan"
                    ? "bg-[#0B1B33] text-white border-[#0B1B33]"
                    : "text-slate-700 border-transparent"
                )}
              >
                Off-Plan
              </button>
            </div>

            {/* advanced filters + search */}
            <div className="flex w-full items-center gap-2 sm:w-auto lg:ml-auto">
              <button
                type="button"
                className="h-12 rounded-lg bg-[#D3920E] px-4 text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Show advanced filters
              </button>

              <button
                type="button"
                className="h-12 rounded-lg bg-[#0B1B33] px-4 text-[13px] font-semibold text-white hover:opacity-95 inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-8">
          <h1 className="text-[24px] sm:text-[40px] font-bold text-[#061F3D]">
            Properties For Sale –{" "}
            <span className="text-[#0B1B33]">68</span> listings found
          </h1>
        </div>

        {/* Tabs row */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2">
          <div className="flex flex-wrap gap-2">
            <PillTab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
              All (68)
            </PillTab>
            <PillTab active={activeTab === "dubai"} onClick={() => setActiveTab("dubai")}>
              Dubai (25)
            </PillTab>
            <PillTab
              active={activeTab === "abudhabi"}
              onClick={() => setActiveTab("abudhabi")}
            >
              Abu Dhabi (15)
            </PillTab>
            <PillTab
              active={activeTab === "sharjah"}
              onClick={() => setActiveTab("sharjah")}
            >
              Sharjah (15)
            </PillTab>
            <PillTab active={activeTab === "ras"} onClick={() => setActiveTab("ras")}>
              Ras Al Khaimah (13)
            </PillTab>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] text-slate-700 shadow-sm">
            <span className="font-medium">Show Pins</span>
            <Toggle value={showPins} onChange={setShowPins} />
          </div>
        </div>

        {/* Map + List */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Map */}
          <div className="lg:col-span-5">
            <MapPlaceholder showPins={showPins} />
          </div>

          {/* Right list */}
          <div className="space-y-5 lg:col-span-7">
            {listings.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                onEmailClick={openEmailModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Email Modal (separate component) */}
      <EmailModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        listing={
          selectedListing
            ? {
                id: selectedListing.id,
                price: selectedListing.price,
                location: selectedListing.location,
                title: selectedListing.title,
              }
            : null
        }
      />
    </div>
  );
}