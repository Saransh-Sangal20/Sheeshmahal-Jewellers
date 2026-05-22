import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import ReviewCard from "@/components/ReviewCard";

const HERO_IMAGE = "https://images.unsplash.com/photo-1737515046830-1680d82e043c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBicmlkYWwlMjBqZXdlbGxlcnklMjBzZXQlMjBtb2RlbHxlbnwwfHx8fDE3Njk1ODYwOTB8MA&ixlib=rb-4.1.0&q=85";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Sheeshmahal+Jewellers/@25.3222549,82.9551871,13z/data=!4m7!3m6!1s0x398e2f04645bedcb:0x839f33c7437a3086!8m2!3d25.3271982!4d83.0032499!15sCgxzaGVlc2ggbWFoYWxaDiIMc2hlZXNoIG1haGFskgENamV3ZWxyeV9zdG9yZeABAA!16s%2Fg%2F11s1w1g192?coh=164777&entry=tt&shorturl=1";
const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Sheeshmahal Jewellers",
  description:
    "Best jewellery shop in Varanasi near Rani Sati Mandir for gold jewellery, diamond jewellery, silver jewellery, and bridal collections.",
  image: HERO_IMAGE,
  telephone: "+91 98395 55066",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nati Imli, Ramkatora, Near Rani Sati Mandir",
    addressLocality: "Varanasi",
    addressRegion: "Uttar Pradesh",
    postalCode: "221001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.3271982,
    longitude: 83.0032499,
  },
  areaServed: "Varanasi",
  sameAs: [
    "https://www.facebook.com/share/1AzM9fEE9j/",
    "https://www.instagram.com/sheeshmahal__jewellers?igsh=NnhyM3luMDVpOHo2",
    "https://wa.me/919839555066",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "18:00",
    },
  ],
};

export const HomePage = () => {
  const [jewellery, setJewellery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jewelleryRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.PUBLIC_URL}/data/jewellery.json`).then(r => r.json()),
          fetch(`${process.env.PUBLIC_URL}/data/reviews.json`).then(r => r.json()),
        ]);
        setJewellery(jewelleryRes.slice(0, 4));

        // Merge JSON reviews with localStorage reviews
        const localReviews = JSON.parse(localStorage.getItem("userReviews") || "[]");
        const allReviews = [...localReviews, ...reviewsRes].filter(r => r.approved);
        setReviews(allReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { name: "Gold", image: "https://images.unsplash.com/photo-1653227907877-e097195908fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqZXdlbGxlcnklMjBzaG93cm9vbSUyMGludGVyaW9yJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY5NTg2MDg4fDA&ixlib=rb-4.1.0&q=85" },
    { name: "Silver", image: "https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Diamond", image: "https://images.unsplash.com/photo-1607703829739-c05b7beddf60?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Platinum", image: "https://plus.unsplash.com/premium_photo-1680181362119-5c9bf196805f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ];

  return (
    <div className="bg-stone-50" data-testid="home-page">
      <Seo
        title="Best Jewellery Shop in Varanasi | Gold & Diamond Jewellery Near Rani Sati Mandir"
        description="Sheeshmahal Jewellers is a trusted choice for the best jewellery shop in Varanasi, offering gold jewellery, diamond jewellery, and bridal designs near Rani Sati Mandir."
        keywords={[
          "best jewellery shop in Varanasi",
          "gold jewellery Varanasi",
          "diamond jewellery Varanasi",
          "jewellery near Rani Sati Mandir",
          "Sheeshmahal Jewellers",
        ]}
        image={HERO_IMAGE}
        imageAlt="Sheeshmahal Jewellers in Varanasi showcasing bridal jewellery"
        structuredData={LOCAL_BUSINESS_SCHEMA}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-labelledby="home-hero-title">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Sheeshmahal Jewellers bridal jewellery showcase in Varanasi"
            className="w-full h-full object-cover object-[center_30%]"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 via-stone-900/60 to-stone-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="uppercase tracking-[0.3em] text-sm text-amber-400 font-bold mb-4 block">
              Trusted Jewellers in Varanasi
            </span>
            <h1 id="home-hero-title" className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6">
              Where Tradition
              <span className="block text-amber-400">Meets Elegance</span>
            </h1>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed max-w-xl">
              Discover hallmarked gold jewellery, silver jewellery, diamond jewellery, and bridal collections in Varanasi, designed with timeless elegance and unmatched craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-stone-50 text-stone-900 hover:bg-amber-500 hover:text-white rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-all duration-300"
                data-testid="hero-explore-btn"
              >
                <Link to="/gallery">
                  Explore Collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-amber-500 text-stone-50 border-none hover:bg-stone-50 hover:text-stone-900 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-all duration-300"
                data-testid="hero-visit-btn"
              >
                <Link to="/location">Visit Showroom</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="py-20 md:py-28 bg-white" aria-labelledby="home-seo-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
              Local Jewellery Destination
            </span>
            <h2 id="home-seo-title" className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold leading-tight">
              Best Jewellery Shop in Varanasi for Gold and Diamond Jewellery
            </h2>
            <p className="mt-6 text-stone-600 leading-relaxed text-lg">
              Sheeshmahal Jewellers is built for customers searching for the best jewellery shop in Varanasi, with a trusted collection of gold jewellery Varanasi shoppers love, diamond jewellery Varanasi families choose for special occasions, and elegant designs for everyday wear.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Located near Rani Sati Mandir, our showroom serves people looking for jewellery near Rani Sati Mandir with easy access, clear guidance, and a premium shopping experience rooted in trust and craftsmanship.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <article className="border border-stone-100 p-6 bg-stone-50">
                <h3 className="font-serif text-xl text-stone-900 font-semibold mb-3">
                  Gold Jewellery in Varanasi
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Explore hallmarked gold sets, bangles, chains, and bridal pieces crafted for lasting purity and daily elegance.
                </p>
              </article>
              <article className="border border-stone-100 p-6 bg-stone-50">
                <h3 className="font-serif text-xl text-stone-900 font-semibold mb-3">
                  Diamond Jewellery in Varanasi
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Discover statement diamond jewellery with refined design, precise finishing, and celebration-ready brilliance.
                </p>
              </article>
              <article className="border border-stone-100 p-6 bg-stone-50">
                <h3 className="font-serif text-xl text-stone-900 font-semibold mb-3">
                  Near Rani Sati Mandir
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Visit our easy-to-find showroom near Rani Sati Mandir in Varanasi for personal assistance and a comfortable buying journey.
                </p>
              </article>
            </div>
          </motion.div>
        </div>
      </section> */}

      <section className="py-20 md:py-28" aria-labelledby="home-categories-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="uppercase tracking-[0.3em] text-sm font-semibold text-amber-600 mb-4 block">
              Our Collections
            </span>
            <h2 id="home-categories-title" className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold">
              Shop by Category
            </h2>
          </motion.div>

          <div className="grid relative grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/gallery?category=${category.name}`}
                  className="group relative aspect-[3/4] block overflow-hidden"
                  data-testid={`category-${category.name.toLowerCase()}`}
                >
                  <img
                    src={category.image}
                    alt={`${category.name} jewellery collection at Sheeshmahal Jewellers in Varanasi`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-xl md:text-2xl text-white font-medium absolute bottom-2 left-2 md:bottom-11 md:left-6">
                      {category.name}
                    </h3>
                    <span className="text-stone-300 text-sm flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View Collection <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="home-featured-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6"
          >
            <div>
              <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
                Handpicked for You
              </span>
              <h2 id="home-featured-title" className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold">
                Featured Pieces
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-stone-900 hover:bg-amber-500 hover:text-stone-50 uppercase tracking-widest text-xs font-bold"
              data-testid="view-all-btn"
            >
              <Link to="/gallery">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-stone-200 mb-4" />
                  <div className="h-4 bg-stone-200 w-20 mb-2" />
                  <div className="h-6 bg-stone-200 w-full mb-2" />
                  <div className="h-4 bg-stone-200 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {jewellery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                  data-testid={`featured-item-${index}`}
                >
                  <div className="aspect-square overflow-hidden bg-stone-100 mb-4">
                    <img
                      src={item.imageUrl}
                      alt={`${item.name} from Sheeshmahal Jewellers, Varanasi`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="uppercase tracking-widest text-sm font-semibold text-amber-600">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl text-stone-900 font-semibold mt-1">
                    {item.name}
                  </h3>
                  <p className="text-stone-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 md:py-28 bg-stone-100 overflow-hidden" aria-labelledby="home-reviews-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div>
              <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
                Customer Stories
              </span>
              <h2 id="home-reviews-title" className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold">
                What Our Customers Say
              </h2>
            </div>
            <Button 
            variant="ghost"
            className="text-stone-900 hover:bg-amber-500 hover:text-stone-50 rounded-none uppercase tracking-widest text-xs font-bold transition-all duration-300">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-800 hover:text-stone-50 transition-colors text-sm"
              data-testid="google-reviews-link"
              aria-label="Read Sheeshmahal Jewellers reviews on Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
              Review us on Google
            </a>
            </Button>
          </motion.div>
        </div>

        {/* Marquee Reviews */}
        {reviews.length > 0 && (
          <div className="relative">
            <div className="flex gap-6 animate-marquee border-gray-600">
              {[...reviews, ...reviews].map((review, index) => (
                <ReviewCard key={`${review.id}-${index}`} review={review} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-stone-900" aria-labelledby="home-cta-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="home-cta-title" className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-6">
              Experience the Magic of
              <span className="block text-amber-500">Handcrafted Jewellery</span>
            </h2>
            <p className="text-stone-400 text-lg mb-8 max-w-2xl mx-auto">
              Visit our showroom in the heart of Varanasi and discover pieces
              that will become treasured heirlooms for generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-amber-600 text-white hover:bg-stone-50 hover:text-stone-900 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-all duration-300"
                data-testid="cta-location-btn"
              >
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
                  Get Directions
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-stone-50 text-stone-50 hover:bg-stone-50 hover:text-stone-900 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold transition-all duration-300 bg-transparent"
                data-testid="cta-call-btn"
              >
                <a href="tel:+919839555066">Call Now</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
