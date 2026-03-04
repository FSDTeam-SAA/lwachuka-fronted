import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F6FAFD]">
            {/* Left side - Image Container */}
            <div className="hidden lg:flex flex-col justify-center p-6 lg:p-10 relative">
                <div className="relative w-full h-full min-h-[600px] max-h-[800px] overflow-hidden rounded-2xl">
                    <Image
                        src="/images/authImage.png"
                        alt="Authentication background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Right side - Form Container */}
            <div className="flex items-center justify-center p-6 lg:p-10">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
