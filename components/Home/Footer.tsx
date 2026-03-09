import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#05203D] text-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              {/* Replace with your logo */}
              <div className="relative h-[65px] w-[100px]">
                <Image
                  src="/footerlogo.png"
                  alt="HomeFinder"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <p className="mt-5 max-w-xs text-sm text-white/70 leading-6">
              Kenya&apos;s leading property discovery platform. Find your perfect
              home among thousands of verified listings.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:justify-self-center">
            <h4 className="text-xl font-semibold text-[#FFFFFF]">Quick Links</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Buy Properties
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  Rent Properties
                </Link>
              </li>
              <li>
                <Link href="/agent&vendor" className="hover:text-white transition">
                  Agents &amp; Vendors
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:justify-self-center">
            <h4 className="text-xl font-semibold text-[#FFFFFF]">Account</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/user/dashboard/saved-properties" className="hover:text-white transition">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:justify-self-end">
            <h4 className="text-xl font-semibold text-[#FFFFFF]">Contact Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>Westlands, Nairobi</li>
              <li>+254 700 000 000</li>
              <li>info@propertyhub.co.ke</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-white/20" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© 2026 PropertyHub Kenya. All rights reserved.</p>

          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}