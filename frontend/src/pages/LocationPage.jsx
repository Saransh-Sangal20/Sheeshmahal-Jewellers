import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.4567!2d83.0032499!3d25.3271982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2f04645bedcb%3A0x839f33c7437a3086!2sSheeshmahal%20Jewellers!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin";

export const LocationPage = () => {
  return (
    <div className="bg-stone-50 min-h-screen" data-testid="location-page">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="uppercase tracking-[0.3em] text-xs text-amber-600 font-medium mb-4 block">
              Find Us
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-semibold mb-4">
              Our Location
            </h1>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto">
              Visit our showroom in the heart of Varanasi to experience our
              exquisite collection in person.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Address Card */}
              <div className="bg-white p-6 border border-stone-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium mb-2">
                      Address
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      Nati Imli, Bauliabagh,
                      <br />
                      near Rani Sati Mandir,
                      <br />
                      Varanasi, Uttar Pradesh 221001
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white p-6 border border-stone-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium mb-2">
                      Contact
                    </h3>
                    <a
                      href="tel:+919839555066"
                      className="text-stone-600 hover:text-amber-600 transition-colors"
                      data-testid="location-phone"
                    >
                      +91 98395 55066
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white p-6 border border-stone-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-stone-900 font-medium mb-2">
                      Opening Hours
                    </h3>
                    <div className="text-stone-600 text-sm space-y-1">
                      <p>Weekdays: 10:00 AM - 8:00 PM</p>
                      <p>Saturday: 10:00 AM - 7:30 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <Button
                asChild
                className="bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold w-full"
                data-testid="get-directions-btn"
              >
                <a
                  href="https://www.google.com/maps/place/Sheeshmahal+Jewellers/@25.3222549,82.9551871,13z/data=!4m7!3m6!1s0x398e2f04645bedcb:0x839f33c7437a3086!8m2!3d25.3271982!4d83.0032499!15sCgxzaGVlc2ggbWFoYWxaDiIMc2hlZXNoIG1haGFskgENamV3ZWxyeV9zdG9yZeABAA!16s%2Fg%2F11s1w1g192?coh=164777&entry=tt&shorturl=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] bg-stone-200">
                <iframe
                  src={GOOGLE_MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sheeshmahal Jewellers Location"
                  data-testid="google-maps-iframe"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Landmarks Section */}
      <section className="py-16 md:py-20 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="font-serif text-2xl text-stone-900 font-semibold mb-4">
              How to Find Us
            </h3>
            <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
              We are located near <strong>Rani Sati Mandir</strong> in the Nati
              Imli area of Bauliabagh, Varanasi. Look for the prominent
              Sheeshmahal Jewellers signboard. Parking is available nearby. If
              you need assistance finding us, please call us and we'll be happy
              to guide you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
