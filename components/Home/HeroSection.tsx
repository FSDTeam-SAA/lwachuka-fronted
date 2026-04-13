/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  const thumbs = ['/c11.png', '/c22.jpg', '/c33.jpg', '/c44.jpg']
  const pages = thumbs.map((_, idx) => idx + 1)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-white">
      <div className="mx-auto container px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT */}
          <div className="max-w-7xl text-center lg:text-left">
            <h1 className="text-[30px] font-bold leading-tight tracking-tight text-[#1E1E1E] sm:text-[38px] md:text-[44px] lg:text-[48px]">
              Find Homes That Truly <br className="hidden sm:block" />
              <span className="mt-2 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
                <span>Fit Your Life</span>
                <Image
                  src="/smallhero.png"
                  alt="Hero highlight"
                  width={1000}
                  height={1000}
                  className="h-10 w-auto rounded-md sm:h-12 md:h-14 lg:h-[60px]"
                  priority
                />
              </span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#7D7D7D] sm:mt-5 sm:text-base sm:leading-7">
              From cozy apartments to luxury villas, discover hand-picked
              listings tailored to your lifestyle, schedule visits with ease,
              and make secure payments—everything designed to bring you closer
              to your perfect place.
            </p>

            <div className="mt-6 sm:mt-7">
              <Link href="/properties" className="block sm:inline-block">
                <Button className="h-11 w-full rounded-full bg-[#061F3D] px-6 text-white shadow-sm hover:bg-[#061F3D]/90 sm:w-auto">
                  Start Exploring Properties <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="mx-auto w-full max-w-[800px]">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-[0_18px_60px_rgba(15,23,42,0.18)] sm:rounded-3xl">
                <div className="relative h-[240px] w-full sm:h-[320px] md:h-[380px] lg:h-[400px]">
                  <Image
                    src={thumbs[activeIndex]}
                    alt="Property"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-2 sm:mt-4 sm:gap-3">
                {thumbs.map((src, idx) => (
                  <button
                    key={src + idx}
                    type="button"
                    className={[
                      'group relative overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl',
                      activeIndex === idx ? 'ring-blue-500' : 'ring-slate-200',
                    ].join(' ')}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </div>
                    <div
                      className={[
                        'pointer-events-none absolute inset-0 ring-2 ring-blue-500 transition',
                        activeIndex === idx
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100',
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:mt-4 sm:rounded-2xl">
                <div className="flex items-center justify-between gap-2">
                  {pages.map((p) => {
                    const isActive = p - 1 === activeIndex
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setActiveIndex(p - 1)}
                        className={[
                          'h-9 w-full rounded-lg text-sm font-medium transition sm:h-10 sm:rounded-xl',
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* soft background */}
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-slate-50 to-white sm:-inset-4 sm:rounded-[34px] lg:-inset-6 lg:rounded-[40px]" />
          </div>
        </div>
      </div>
    </section>
  )
}