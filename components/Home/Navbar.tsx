'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/about-us', label: 'About us' },
    { href: '/agent&vendor', label: 'Agents & Vendors' },
    { href: '/contact-us', label: 'Contact us' },
  ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Derive user info from session
  const user = session?.user;
  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : firstName?.[0]?.toUpperCase() ?? 'U';

  // Dashboard href based on role
  const dashboardHref =
    user?.role === 'agent' || user?.role === 'owners'
      ? '/agent/dashboard'
      : '/user/dashboard';

  const AuthSection = ({ mobile = false }: { mobile?: boolean }) => {
    if (status === 'loading') return null;

    if (status === 'authenticated' && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className={mobile ? 'h-9 w-9' : 'h-9 w-9 cursor-pointer ring-2 ring-[#061F3D]/20 hover:ring-[#061F3D]/50 transition-all'}>
                <AvatarImage src={user.image ?? ''} alt={`${firstName} ${lastName}`} />
                <AvatarFallback className="text-xs bg-[#061F3D] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div>
                <p className="text-sm font-semibold">{`${firstName} ${lastName}`}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={dashboardHref} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Not logged in
    return mobile ? (
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="flex-1" onClick={() => setIsOpen(false)}>
          <Button variant="outline" className="w-full">Log in</Button>
        </Link>
        <Link href="/register" className="flex-1" onClick={() => setIsOpen(false)}>
          <Button className="w-full bg-primary hover:bg-primary/90">Sign up</Button>
        </Link>
      </div>
    ) : (
      <div className="flex gap-3">
        <Link href="/login">
          <Button variant="outline" size="sm" className="text-[#101828] text-base font-bold border-none bg-transparent shadow-none">
            Log in
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm" className="bg-[#061F3D] text-white px-[21px] h-[40px] rounded-full text-base font-bold hover:bg-[#061F3D]/90">
            Sign up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white">
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
                className={`inline-flex h-[40px] items-center rounded-full px-4 text-base font-semibold transition-colors ${isActive(link.href)
                    ? 'bg-[#061F3D] text-white hover:text-white'
                    : 'text-[#1E1E1E] hover:text-primary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex">
            <AuthSection />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="!h-5 !w-5" />
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
                <AuthSection mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
