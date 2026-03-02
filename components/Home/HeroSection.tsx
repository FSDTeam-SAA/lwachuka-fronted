'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const pages = useMemo(() => [1, 2, 3, 4, 5, 6, 7], []);
  const [active, setActive] = useState(2);
  const mainImage = '/house.png';
  const thumbs = ['/galary.png', '/galary2.png', '/galary3.png', '/galary.png'];

  const avatars = ['/avater2.png', '/avater2.png', '/avater3.png', '/avater4.png'];


  return (
    <section className="bg-white">
      <div className="mx-auto container px-4 py-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div className="max-w-7xl">
            <h1 className=" text-nowrap text-[48px] font-bold tracking-tight text-[#1E1E1E] ">
              Find Homes That Truly <br />
              <span className="inline-flex translate-y-1 gap-6 items-center">
                <span>Fit Your Life</span>
                <Image
                  src="/smallhero.png"
                  alt=""
                  width={1000}
                  height={1000}
                  className="h-[60px] w-auto rounded-md"
                  priority
                />
              </span>
            </h1>

            <p className="mt-5 text-base leading-6 text-[#7D7D7D] sm:text-base">
              From cozy apartments to luxury villas, discover hand-picked listings tailored to your
              lifestyle, schedule visits with ease, and make secure payments—everything designed to
              bring you closer to your perfect place.
            </p>

            <div className="mt-7">
              <Button className="h-11 rounded-full bg-[#061F3D] px-6 text-white shadow-sm hover:bg-[#061F3D]/90">
                Start Exploring Properties <span className="ml-2">→</span>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 ">
              <div className="flex -space-x-2">
                {avatars.map((src, idx) => (
                  <div
                    key={src + idx}
                    className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-6 text-base text-slate-600">
                <span className="text-amber-500">★</span>
                <span className="font-medium text-slate-900">4.8</span>
                <span className="text-[#68706A]">(10k+ Reviews)</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="mx-auto max-w-[800px]">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
                <div className="relative h-[400px]  w-full">
                  <Image src={mainImage} alt="Property" width={1000} height={1000} className="object-cover h-full "  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {thumbs.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => setActive((prev) => (prev === 7 ? 1 : prev + 1))}
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={src} alt="" fill className="object-cover" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 opacity-0 ring-2 ring-blue-500 transition group-hover:opacity-100" />
                  </button>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  {pages.map((p) => {
                    const isActive = p === active;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setActive(p)}
                        className={[
                          'h-10 w-full rounded-xl text-sm font-medium transition',
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* soft background */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-slate-50 to-white" />
          </div>
        </div>
      </div>
    </section>
  );
}