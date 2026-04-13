'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import type { PropertyApiResponse } from '@/types/PropertyType';

async function fetchPropertyTypes(): Promise<string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_BACKEND_API_URL');
  }

  const res = await fetch(`${baseUrl}/property?status=approved`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch property types');
  }

  const json: PropertyApiResponse = await res.json();
  const deduped = new Map<string, string>();

  for (const item of json.data ?? []) {
    const raw = (item.propertyType || '').toString().trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, raw);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => a.localeCompare(b));
}

type SearchFilterValues = {
  transaction?: 'buy' | 'sell' | 'rent' | 'Buy' | 'Sell' | 'Rent' | string;
  listingType?: string;
  propertyType?: string;
  searchTerm?: string;
  type?: string;
  location?: string;
  price?: string;
  bedrooms?: string | number;
  bathrooms?: string | number;
  minLand?: string | number;
  maxLand?: string | number;
  parking?: string | boolean;
  gatedCommunity?: string | boolean;
  staffQuarters?: string | boolean;
};

type SearchFilterProps = {
  initialValues?: SearchFilterValues;
  submitPath?: string;
  autoSubmitOnListingTypeChange?: boolean;
};

export function SearchFilter({
  initialValues,
  submitPath,
  autoSubmitOnListingTypeChange,
}: SearchFilterProps) {
  const router = useRouter();
  const [listingType, setListingType] = useState<'Sell' | 'Rent'>('Sell');
  const [propertyType, setPropertyType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [minLand, setMinLand] = useState('');
  const [maxLand, setMaxLand] = useState('');
  const [parking, setParking] = useState('any');
  const [gatedCommunity, setGatedCommunity] = useState('any');
  const [staffQuarters, setStaffQuarters] = useState('any');
  const [hasUserSelectedType, setHasUserSelectedType] = useState(false);

  const initialListingType = (initialValues?.listingType ?? '').toString();
  const initialTransaction = (initialValues?.transaction ?? '').toString();
  const initialSearchTerm = (
    initialValues?.searchTerm ??
    initialValues?.type ??
    ''
  ).toString();
  const initialLocation = (initialValues?.location ?? '').toString();
  const initialPrice = (initialValues?.price ?? '').toString();
  const initialPropertyType = (initialValues?.propertyType ?? '').toString();
  const initialBedrooms = (initialValues?.bedrooms ?? '').toString();
  const initialBathrooms = (initialValues?.bathrooms ?? '').toString();
  const initialMinLand = (initialValues?.minLand ?? '').toString();
  const initialMaxLand = (initialValues?.maxLand ?? '').toString();
  const initialParking = (initialValues?.parking ?? '').toString();
  const initialGatedCommunity = (initialValues?.gatedCommunity ?? '').toString();
  const initialStaffQuarters = (initialValues?.staffQuarters ?? '').toString();

  const {
    data: propertyTypesData,
    isLoading: isPropertyTypesLoading,
    error: propertyTypesError,
  } = useQuery({
    queryKey: ['property-types'],
    queryFn: fetchPropertyTypes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const types = useMemo(
    () => ['All', ...(propertyTypesData ?? [])],
    [propertyTypesData]
  );

  useEffect(() => {
    const hasInitialValues = [
      initialListingType,
      initialTransaction,
      initialSearchTerm,
      initialLocation,
      initialPrice,
      initialBedrooms,
      initialBathrooms,
      initialMinLand,
      initialMaxLand,
      initialParking,
      initialGatedCommunity,
      initialStaffQuarters,
    ].some((value) => value);

    if (!hasInitialValues) {
      return;
    }

    const normalizedListing =
      initialListingType.toLowerCase() === 'for rent' ||
      initialTransaction.toLowerCase() === 'rent'
        ? 'Rent'
        : 'Sell';

    setListingType(normalizedListing);
    setSearchTerm(initialSearchTerm);
    setLocation(initialLocation);
    setPrice(initialPrice);
    setBedrooms(initialBedrooms);
    setBathrooms(initialBathrooms);
    setMinLand(initialMinLand);
    setMaxLand(initialMaxLand);
    setParking(
      initialParking === 'true' || initialParking === 'false'
        ? initialParking
        : 'any'
    );
    setGatedCommunity(
      initialGatedCommunity === 'true' || initialGatedCommunity === 'false'
        ? initialGatedCommunity
        : 'any'
    );
    setStaffQuarters(
      initialStaffQuarters === 'true' || initialStaffQuarters === 'false'
        ? initialStaffQuarters
        : 'any'
    );
  }, [
    initialListingType,
    initialTransaction,
    initialSearchTerm,
    initialLocation,
    initialPrice,
    initialBedrooms,
    initialBathrooms,
    initialMinLand,
    initialMaxLand,
    initialParking,
    initialGatedCommunity,
    initialStaffQuarters,
  ]);

  useEffect(() => {
    if (hasUserSelectedType) return;

    const matchedType =
      types.find(
        (type) => type.toLowerCase() === initialPropertyType.toLowerCase()
      ) ?? 'All';

    setPropertyType(matchedType);
  }, [initialPropertyType, types, hasUserSelectedType]);

  const handleFindProperties = (overrides?: {
    listingType?: 'Sell' | 'Rent';
    propertyType?: string;
    searchTerm?: string;
    location?: string;
    price?: string;
    bedrooms?: string;
    bathrooms?: string;
    minLand?: string;
    maxLand?: string;
    parking?: string;
    gatedCommunity?: string;
    staffQuarters?: string;
  }) => {
    const selectedListingType = overrides?.listingType ?? listingType;
    const selectedPropertyType = overrides?.propertyType ?? propertyType;
    const selectedSearchTerm = overrides?.searchTerm ?? searchTerm;
    const selectedLocation = overrides?.location ?? location;
    const selectedPrice = overrides?.price ?? price;
    const selectedBedrooms = overrides?.bedrooms ?? bedrooms;
    const selectedBathrooms = overrides?.bathrooms ?? bathrooms;
    const selectedMinLand = overrides?.minLand ?? minLand;
    const selectedMaxLand = overrides?.maxLand ?? maxLand;
    const selectedParking = overrides?.parking ?? parking;
    const selectedGatedCommunity = overrides?.gatedCommunity ?? gatedCommunity;
    const selectedStaffQuarters = overrides?.staffQuarters ?? staffQuarters;

    const params = new URLSearchParams();

    const searchTermValue = selectedSearchTerm.trim();
    const place = selectedLocation.trim();
    const priceValue = selectedPrice.trim();
    const bedroomsValue = selectedBedrooms.trim();
    const bathroomsValue = selectedBathrooms.trim();
    const minLandValue = selectedMinLand.trim();
    const maxLandValue = selectedMaxLand.trim();

    if (searchTermValue) params.set('searchTerm', searchTermValue);
    params.set('status', 'approved');
    if (place) params.set('location', place);
    if (priceValue) params.set('price', priceValue);
    if (bedroomsValue) params.set('bedrooms', bedroomsValue);
    if (bathroomsValue) params.set('bathrooms', bathroomsValue);
    if (minLandValue) params.set('minLand', minLandValue);
    if (maxLandValue) params.set('maxLand', maxLandValue);
    if (selectedParking === 'true' || selectedParking === 'false') {
      params.set('parking', selectedParking);
    }
    if (selectedGatedCommunity === 'true' || selectedGatedCommunity === 'false') {
      params.set('gatedCommunity', selectedGatedCommunity);
    }
    if (selectedStaffQuarters === 'true' || selectedStaffQuarters === 'false') {
      params.set('staffQuarters', selectedStaffQuarters);
    }

    params.set(
      'listingType',
      selectedListingType === 'Rent' ? 'For Rent' : 'For Sale'
    );
    if (selectedPropertyType !== 'All') {
      params.set('propertyType', selectedPropertyType);
    }

    const query = params.toString();
    const targetPath = submitPath || '/serach-result';
    router.push(`${targetPath}${query ? `?${query}` : ''}`);
  };

  return (
    <section>
      <div className="mx-auto container py-10 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)] md:p-8">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* Search Term */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Looking For
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Keyword or phrase"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white pl-10 placeholder:text-[#7D7D7D]"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Location
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Location"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white pl-10 placeholder:text-[#7D7D7D]"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
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
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Min Price
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="Min Price"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white pl-10 placeholder:text-[#7D7D7D]"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
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

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Bedrooms
              </label>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Bedrooms"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white placeholder:text-[#7D7D7D]"
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                />
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Bathrooms
              </label>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Bathrooms"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white placeholder:text-[#7D7D7D]"
                  value={bathrooms}
                  onChange={(event) => setBathrooms(event.target.value)}
                />
              </div>
            </div>

            {/* Land Size (Min) */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Land Size (Min)
              </label>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min land area"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white placeholder:text-[#7D7D7D]"
                  value={minLand}
                  onChange={(event) => setMinLand(event.target.value)}
                />
              </div>
            </div>

            {/* Land Size (Max) */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Land Size (Max)
              </label>
              <div className="mt-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Max land area"
                  className="h-11 rounded-xl border-[#D6D6D6] bg-white placeholder:text-[#7D7D7D]"
                  value={maxLand}
                  onChange={(event) => setMaxLand(event.target.value)}
                />
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Parking
              </label>
              <div className="mt-2">
                <Select value={parking} onValueChange={setParking}>
                  <SelectTrigger className="h-11 rounded-xl border-[#D6D6D6] bg-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gated Community */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Gated Community
              </label>
              <div className="mt-2">
                <Select value={gatedCommunity} onValueChange={setGatedCommunity}>
                  <SelectTrigger className="h-11 rounded-xl border-[#D6D6D6] bg-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Staff Quarters */}
            <div>
              <label className="block text-sm font-semibold text-[#1E1E1E]">
                Staff Quarters
              </label>
              <div className="mt-2">
                <Select value={staffQuarters} onValueChange={setStaffQuarters}>
                  <SelectTrigger className="h-11 rounded-xl border-[#D6D6D6] bg-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Filter Row */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sell/Rent Buttons */}
              <Button
                variant={listingType === 'Sell' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setListingType('Sell');
                  if (autoSubmitOnListingTypeChange) {
                    handleFindProperties({ listingType: 'Sell' });
                  }
                }}
                className={
                  listingType === 'Sell'
                    ? 'rounded-full bg-[#0B1B3B] px-6 text-white hover:bg-[#0B1B3B]/90'
                    : 'rounded-full border-[#E3E3E3] px-6 text-[#5E5E5E]'
                }
              >
                Sell
              </Button>
              <Button
                variant={listingType === 'Rent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setListingType('Rent');
                  if (autoSubmitOnListingTypeChange) {
                    handleFindProperties({ listingType: 'Rent' });
                  }
                }}
                className={
                  listingType === 'Rent'
                    ? 'rounded-full bg-[#0B1B3B] px-6 text-white hover:bg-[#0B1B3B]/90'
                    : 'rounded-full border-[#E3E3E3] px-6 text-[#5E5E5E]'
                }
              >
                Rent
              </Button>

            
            </div>

            {/* Property Type Tags */}
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={propertyType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setHasUserSelectedType(true);
                    setPropertyType(type);
                  }}
                  className={
                    propertyType === type
                      ? 'rounded-full bg-[#0B1B3B] px-5 text-white hover:bg-[#0B1B3B]/90'
                      : 'rounded-full border-[#E3E3E3] px-5 text-[#5E5E5E]'
                  }
                >
                  {type}
                </Button>
              ))}
              {isPropertyTypesLoading && types.length === 1 ? (
                <span className="self-center text-sm text-[#7D7D7D]">
                  Loading types...
                </span>
              ) : null}
              {propertyTypesError ? (
                <span className="self-center text-sm text-red-600">
                  Failed to load property types.
                </span>
              ) : null}
            </div>

            {/* Find Properties Button */}
            <Button
              onClick={() => handleFindProperties()}
              className="w-full rounded-full bg-[#0B1B3B] px-6 text-white hover:bg-[#0B1B3B]/90 md:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
