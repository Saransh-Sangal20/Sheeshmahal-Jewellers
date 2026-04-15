import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Seo from "@/components/Seo";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    // Save review to localStorage
    const newReview = {
      id: `user-${Date.now()}`,
      name: formData.name.trim(),
      rating: formData.rating,
      comment: formData.comment.trim(),
      createdAt: new Date().toISOString(),
      approved: true,
    };

    const existingReviews = JSON.parse(localStorage.getItem("userReviews") || "[]");
    existingReviews.unshift(newReview);
    localStorage.setItem("userReviews", JSON.stringify(existingReviews));

    toast.success("Thank you for your review! Please Visit Again");
    setFormData({ name: "", rating: 5, comment: "" });
    setSubmitting(false);
  };

  return (
    <div className="bg-stone-50 min-h-screen" data-testid="contact-page">
      <Seo
        title="Contact Sheeshmahal Jewellers in Varanasi"
        description="Call or visit Sheeshmahal Jewellers near Rani Sati Mandir in Varanasi for gold jewellery, diamond jewellery, and custom designs."
        keywords={[
          "contact Sheeshmahal Jewellers",
          "jewellery near Rani Sati Mandir",
          "gold jewellery Varanasi",
          "diamond jewellery Varanasi",
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden" aria-labelledby="contact-hero-title">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Elegant jewellery showroom in Varanasi near Rani Sati Mandir"
            className="w-full h-full object-cover object-[center_30%]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/70 via-stone-900/60 to-stone-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase tracking-[0.3em] text-sm text-amber-400 font-semibold mb-4 block">
              Get in Touch
            </span>

            <h1 id="contact-hero-title" className="font-serif text-4xl md:text-5xl text-white font-semibold mb-4">
              Visit Our Showroom in <span className="text-amber-500">Varanasi</span>
            </h1>

            <p className="text-stone-300 text-lg max-w-2xl mx-auto">
              Connect with Sheeshmahal Jewellers for enquiries, custom designs, or visit us to explore our exclusive gold and diamond jewellery collection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Review Form */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
                Contact Information
              </span>
              <h2 className="font-serif text-3xl text-stone-900 font-semibold mb-8">
                Visit Our Showroom
              </h2>

              <div className="space-y-8">
                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 mb-1">Location</h3>
                    <p className="text-stone-600 leading-relaxed">
                      Sheeshmahal Chauraha,
                      <br />
                       Nati Imli, Near Rani Sati Mandir,
                      <br />
                      Varanasi, Uttar Pradesh 221001
                    </p>
                    <a
                      href="https://www.google.com/maps/place/Sheeshmahal+Jewellers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-sm mt-2 inline-block underline underline-offset-4"
                      data-testid="contact-maps-link"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 mb-1">Phone</h3>
                      +91 98395 55066
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-900 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 mb-1">
                      Opening Hours
                    </h3>
                    <div className="text-stone-600 space-y-1">
                      <p>Weekdays: 10:00 AM - 9:00 PM</p>
                      <p>Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <div className="mt-10">
                <Button
                  asChild
                  className="bg-stone-900 text-stone-50 hover:bg-amber-500 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold w-full sm:w-auto"
                  data-testid="contact-call-btn"
                >
                  <a href="tel:+919839555066">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Review Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
                Share Your Experience
              </span>
              <h2 className="font-serif text-3xl text-stone-900 font-semibold mb-8">
                Leave a Review
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-stone-900 font-medium mb-2 block"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="rounded-none border-stone-200 focus:border-stone-900 focus:ring-0 bg-white"
                    data-testid="review-name-input"
                  />
                </div>

                <div>
                  <Label className="text-stone-900 font-medium mb-2 block">
                    Rating
                  </Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none"
                        data-testid={`rating-star-${star}`}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= formData.rating
                              ? "fill-amber-500 text-amber-500"
                              : "fill-stone-200 text-stone-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="comment"
                    className="text-stone-900 font-medium mb-2 block"
                  >
                    Your Review
                  </Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Share your experience with us..."
                    rows={5}
                    className="rounded-none border-stone-200 focus:border-stone-900 focus:ring-0 bg-white resize-none"
                    data-testid="review-comment-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold w-full"
                  data-testid="review-submit-btn"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
