"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Services", hasDropdown: true },
  { label: "Markets", hasDropdown: true },
  { label: "Clients", hasDropdown: false },
  { label: "Resources", hasDropdown: true },
  { label: "Contact", hasDropdown: false },
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
        <a href="#" className="flex items-center gap-2 text-lg font-light tracking-tight">
          <span className="text-gray-900">masterkey</span>
          <span className="text-mk-teal-light font-medium">real estate</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-mk-teal transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </a>
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
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              className="text-sm font-medium text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-mk-teal text-white text-sm font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Get started
          </a>
        </nav>
      )}
    </header>
  );
}
