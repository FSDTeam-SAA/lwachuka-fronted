'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
    title: string
    subtitle?: string
    backHref?: string
    children?: React.ReactNode
}

export function DashboardHeader({
    title,
    subtitle,
    backHref,
    children,
}: DashboardHeaderProps) {
    const router = useRouter()

    return (
        <div className="bg-white px-8 py-6">
            <div className="max-w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {backHref && (
                        <button
                            onClick={() => router.push(backHref)}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors group"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-[24px] font-semibold text-gray-900 leading-[150%]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[12px] font-normal text-gray-500 leading-[150%] mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">{children}</div>
            </div>
        </div>
    )
}
