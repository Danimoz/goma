'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

import schoolLogo from '../../public/School Logo.jpg'
import { useSession } from "next-auth/react";
import { signOut } from "@/auth";

const navbarItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/#about' },
  { name: 'Programs', href: '/#academics' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:container md:mx-auto flex h-16 items-center justify-between">
        <Link href='/' className="flex items-center gap-4">
          <div className="h-10 w-10">
            <Image 
              alt='G.O.M.A. Logo' 
              className="object-contain"
              src={schoolLogo}
            />
          </div>
          <span className="text-2xl font-bold tracking-wider font-[family-name:var(--font-montserrat)]">G.O.M.A.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navbarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-md font-medium hover:text-congress-blue-500 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-4">
          <Button asChild variant="outline">
            <Link href="/portal">Portal</Link>
          </Button>
          <Button asChild>
            <Link href="/apply">Apply Now</Link>
          </Button>
          {!!session?.user && (
            <Button variant="outline" onClick={() => signOut({ redirectTo: '/' })}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-x-0 top-16 z-50 bg-white border-b border-gray-200 shadow-lg md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="container p-4 space-y-4">
          <nav className="flex flex-col items-center gap-4">
            {navbarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-md font-medium hover:text-congress-blue-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <Button
              asChild
              variant="outline"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/portal">Portal</Link>
            </Button>
            <Button asChild  onClick={() => setIsMenuOpen(false)}>
              <Link href="/apply">Apply Now</Link>
            </Button>
            {!!session?.user && (
              <Button variant="outline" onClick={() => signOut({ redirectTo: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}