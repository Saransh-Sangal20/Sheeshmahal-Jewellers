import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Location", path: "/location" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-stone-100"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            data-testid="navbar-logo"
          >
            <span className="font-serif text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight">
              Sheeshmahal
            </span>
            <span className="hidden sm:block text-amber-600 font-serif text-lg italic">
              Jewellers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={`uppercase tracking-widest text-xs font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? "text-amber-600"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="mobile-menu-button"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-stone-50">
                <div className="flex flex-col gap-8 mt-12">
                  <div className="font-serif text-2xl font-semibold text-stone-900">
                    Sheeshmahal
                    <span className="block text-amber-600 text-lg italic">
                      Jewellers
                    </span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                        className={`uppercase tracking-widest text-sm font-medium py-2 transition-colors duration-300 ${
                          isActive(link.path)
                            ? "text-amber-600"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
