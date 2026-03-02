'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'Properties' },
    { href: '#', label: 'About us' },
    { href: '#', label: 'Agents & Vendors' },
    { href: '#', label: 'Contact us' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full  bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
           <Image src="/logo.png" alt="logo" width={1000} height={1000} className='w-[97px] h-[60px]' />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-2 md:flex md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-semibold text-[#1E1E1E] transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden gap-3 md:flex">
            <Button variant="outline" size="sm" className="text-[#101828] text-base font-bold  border-none bg-transparent shadow-none">
              Log in
            </Button>
            <Button size="sm" className="bg-[#061F3D] text-white px-[21px] h-[40px] rounded-full text-base font-bold hover:bg-[#061F3D]/90">
              Sign up
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-medium text-foreground transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Log in
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Sign up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
