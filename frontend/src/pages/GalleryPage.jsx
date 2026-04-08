import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import JewelleryCard from "@/components/JewelleryCard";
import { Button } from "@/components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jewellery, setJewellery] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All"
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/jewellery/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchJewellery = async () => {
      setLoading(true);
      try {
        const params = activeCategory !== "All" ? `?category=${activeCategory}` : "";
        const res = await axios.get(`${API}/jewellery${params}`);
        setJewellery(res.data);
      } catch (error) {
        console.error("Error fetching jewellery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJewellery();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen" data-testid="gallery-page">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1600"
            alt="Luxury Jewellery Showroom"
            className="w-full h-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-stone-900/50 to-stone-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase tracking-[0.3em] text-sm text-amber-400 font-semibold mb-4 block">
              Our Collection
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-4">
              Jewellery Gallery
            </h1>

            <p className="text-stone-300 text-lg max-w-2xl mx-auto">
              Explore our exquisite collection of handcrafted jewellery. Each piece is crafted with precision and passion by master artisans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-100 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant={activeCategory === category ? "default" : "outline"}
                className={`rounded-none px-6 py-2 uppercase tracking-widest text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-stone-900 text-stone-50"
                    : "text-stone-600"
                }`}
                data-testid={`filter-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-stone-200 mb-4" />
                  <div className="h-4 bg-stone-200 w-20 mb-2" />
                  <div className="h-6 bg-stone-200 w-full mb-2" />
                  <div className="h-4 bg-stone-200 w-3/4" />
                </div>
              ))}
            </div>
          ) : jewellery.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-500 text-lg">
                No jewellery found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {jewellery.map((item) => (
                <JewelleryCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h3 className="font-serif text-2xl md:text-3xl text-stone-900 font-semibold mb-4">
            Let Us Help You Find Your Perfect Jewellery
          </h3>
          <p className="text-stone-500 mb-6 max-w-lg mx-auto">
            Visit our showroom to explore our complete collection or call us for
            custom jewellery designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-amber-500 text-stone-50 hover:bg-stone-800 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold"
              data-testid="gallery-call-btn"
            >
              <a href="tel:+919839555066">Call: +91 98395 55066</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
