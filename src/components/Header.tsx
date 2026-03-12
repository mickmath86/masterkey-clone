"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Services", href: "/#services", hasDropdown: true },
  { label: "Markets", href: "/#markets", hasDropdown: true },
  { label: "About Us", href: "/about", hasDropdown: false },
  { label: "Resources", href: "/#resources", hasDropdown: true },
  { label: "Contact", href: "/#contact", hasDropdown: false },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-mk-cream/95 backdrop-blur-xl shadow-sm"
          : "bg-mk-cream/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-light tracking-tight">
          <span className="text-gray-900">masterkey</span>
          <span className="text-mk-teal-light font-medium">real estate</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-mk-teal transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-200 px-6 py-6 flex flex-col gap-4 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-mk-teal text-white text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Get started
          </Link>
        </nav>
      )}
    </header>
  );
}
