import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DreamHomeCTA() {
  return (
    <section className="pyt-16 pb-[120px] bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl">
          
          {/* Background Image */}
          <Image
            src="/ctabg.jpg" 
            alt="Background"
            fill
            priority
            className="object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#061F3D]/50 backdrop-blur-[2px]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 md:py-24 text-white">
            
            <h2 className="text-2xl md:text-3xl font-semibold"> 
              Ready to Find Your Dream Home?
            </h2>

            <p className="mt-4 max-w-xl text-sm md:text-base text-white/80">
              Join thousands of Kenyans who have found their perfect properties
              through our platform
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href='/contact-us'>
              <Button className="bg-[#061F3D] hover:bg-[#04172d] text-white !px-10 h-11 rounded-lg border border-[#D3920E]">
                Contact 
              </Button>
              </Link>
              <Link href="/login">
              <Button
                variant="outline"
                className="border-white text-[#0B1C39] hover:bg-white hover:text-[#0B1C39] px-6 h-11 rounded-lg"
              >
                Sign In
              </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}