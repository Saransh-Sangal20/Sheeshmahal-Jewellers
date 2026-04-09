import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export const Footer = () => {
  const whyShopReasons = [
    "Legacy of Trust Since 50+ Years",
    "Trusted by families for generations in Varanasi",
    "Hallmarked Gold & Certified Diamond Jewellery",
    "Premium Jewellery Collection in Varanasi",
    "Perfect for Weddings & Celebrations",
  ];

  return (
    <footer className="bg-stone-900 text-stone-50" data-testid="footer">
      {/* Why Shop Section */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-8 text-center">
            Why Shop at <span className="text-amber-500">Sheeshmahal Jewellers</span> in Varanasi?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyShopReasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-stone-300"
                data-testid={`why-shop-reason-${index}`}
              >
                <span className="text-amber-500 font-serif text-xl">
                  {index + 1}.
                </span>
                <p className="text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h4 className="font-serif text-2xl font-semibold mb-4">
              Sheeshmahal
              <span className="block text-amber-500 text-lg">
                Jewellers
              </span>
            </h4>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              A legacy of trust and timeless elegance in the heart of Varanasi, crafting precious memories for generations.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1AzM9fEE9j/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-amber-600 transition-colors duration-300 rounded-none"
                data-testid="social-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/sheeshmahal__jewellers?igsh=NnhyM3luMDVpOHo2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-amber-600 transition-colors duration-300 rounded-none"
                data-testid="social-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/919839555066"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-amber-600 transition-colors duration-300 rounded-none"
                data-testid="social-whatsapp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="uppercase tracking-widest text-xs font-semibold mb-6 text-stone-300">
              Quick Links
            </h5>
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/gallery"
                className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
              >
                Contact
              </Link>
              <Link
                to="/location"
                className="text-stone-400 hover:text-amber-500 transition-colors text-sm"
              >
                Location
              </Link>
            </nav>
          </div>

          {/* Location */}
          <div>
            <h5 className="uppercase tracking-widest text-xs font-semibold mb-6 text-stone-300">
              Visit Us
            </h5>
            <div className="flex items-start gap-3 text-stone-400 mb-4">
              <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">
                Nati Imli, Ramkatora, Near Rani Sati Mandir,
                <br />
                Varanasi, Uttar Pradesh 221001
              </p>
            </div>
            <a
              href="https://www.google.com/maps/place/Sheeshmahal+Jewellers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-400 text-sm underline underline-offset-4"
              data-testid="footer-maps-link"
            >
              View on Google Maps
            </a>
          </div>

          {/* Contact & Hours */}
          <div>
            <h5 className="uppercase tracking-widest text-xs font-semibold mb-6 text-stone-300">
              Contact & Hours
            </h5>
            <div className="flex items-center gap-3 text-stone-400 mb-4">
              <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <a
                href="tel:+919839555066"
                className="text-sm hover:text-amber-500 transition-colors"
                data-testid="footer-phone"
              >
                +91 98395 55066
              </a>
            </div>
            <div className="flex items-start gap-3 text-stone-400">
              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p>Weekdays: 10:00 AM - 9:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <p className="text-center text-stone-500 text-sm">
            &copy; {new Date().getFullYear()} Sheeshmahal Jewellers. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
