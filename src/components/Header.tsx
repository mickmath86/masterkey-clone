"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, BarChart3 } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  hasDropdown: boolean;
  children?: { label: string; href: string; icon?: React.ReactNode; description?: string }[];
}

const navItems: NavItem[] = [
  { label: "Services", href: "/#services", hasDropdown: true },
  { label: "Markets", href: "/#markets", hasDropdown: true },
  { label: "Home Value", href: "/homevalue", hasDropdown: false },
  { label: "About Us", href: "/about", hasDropdown: false },
  {
    label: "Resources",
    href: "/#resources",
    hasDropdown: true,
    children: [
      {
        label: "MarketPulse",
        href: "/marketpulse",
        icon: <BarChart3 className="w-4 h-4 text-mk-teal" />,
        description: "AI-powered market intelligence",
      },
    ],
  },
  { label: "Contact", href: "/#contact", hasDropdown: false },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <nav className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-mk-teal transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* dropdown panel */}
                  {openDropdown === item.label && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-mk-mint/60 transition-colors"
                        >
                          {child.icon && (
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-mk-mint flex items-center justify-center">
                              {child.icon}
                            </span>
                          )}
                          <div>
                            <span className="block text-sm font-medium text-gray-900">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-gray-500">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-mk-teal transition-colors"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </Link>
              )}
            </div>
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
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {item.label}
                </span>
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="flex items-center gap-3 text-sm font-medium text-gray-900 pl-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.icon}
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
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
