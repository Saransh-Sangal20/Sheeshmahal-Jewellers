import { motion } from "framer-motion";
import { Award, Users, Heart, Gem } from "lucide-react";
import about from "../assets/about.png";
import about2 from "../assets/about2.png";

const SHOWROOM_IMAGE = "https://images.unsplash.com/photo-1754573433744-bf2b79d0eaf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqZXdlbGxlcnklMjBzaG93cm9vbSUyMGludGVyaW9yJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY5NTg2MDg4fDA&ixlib=rb-4.1.0&q=85";

export const AboutPage = () => {
  const values = [
    {
      icon: Gem,
      title: "Quality Craftsmanship",
      description:
        "Every piece is handcrafted by master artisans using traditional techniques passed down through generations.",
    },
    {
      icon: Award,
      title: "Certified Purity",
      description:
        "All our gold jewellery is BIS hallmarked, and diamonds come with certified authenticity.",
    },
    {
      icon: Heart,
      title: "Customer Trust",
      description:
        "Generations of families have trusted us for their most precious moments and celebrations.",
    },
    {
      icon: Users,
      title: "Personalized Service",
      description:
        "Our expert staff provides personalized guidance to help you find the perfect piece.",
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen" data-testid="about-page">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={about}
            alt="Sheeshmahal Jewellers Showroom in Varanasi"
            className="w-full h-full object-cover object-[center_30%]"
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
              Our Story
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-white font-semibold mb-4">
              About Sheeshmahal <span className="text-amber-500">Jewellers</span>
            </h1>

            <p className="text-stone-300 text-lg max-w-2xl mx-auto">
              Rooted in the heart of Varanasi, we craft jewellery that blends tradition, elegance, and timeless beauty for generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={about2}
                  alt="Sheeshmahal Jewellers Showroom"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
                Since Generations
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold mb-6">
                Crafting Precious Memories
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  For over 50 years, Sheeshmahal Jewellers has been a trusted name in fine gold, silver and diamond jewellery in Varanasi, 
                  blending timeless craftsmanship with modern elegance. 
                  Located near Rani Sati Mandir, our showroom has been part of countless weddings, celebrations, and cherished moments across generations. 
                  Every piece we create reflects the rich heritage of Varanasi, crafted by skilled artisans who transform precious metals and gemstones into timeless works of art.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="uppercase tracking-[0.3em] text-sm text-amber-600 font-semibold mb-4 block">
              Our Values
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-semibold">
              What Sets Us Apart
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 border border-stone-100 shadow-sm hover:border-stone-300 hover:shadow-md transition-colors duration-300"
                data-testid={`value-card-${index}`}
              >
                <div className="w-14 h-14 mx-auto mb-6 bg-stone-900 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="font-serif text-xl text-stone-900 font-medium mb-3">
                  {value.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 md:py-28 bg-stone-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold mb-6">
              Our Promise to You
            </h2>
            <p className="text-stone-400 text-lg max-w-3xl mx-auto leading-relaxed">
              When you choose Sheeshmahal Jewellers, you're not just buying
              jewellery — you're investing in a legacy. We promise purity,
              authenticity, and service that goes beyond the transaction. Your
              trust is our most treasured possession, and we work every day to
              uphold it.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
