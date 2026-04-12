import { motion } from "framer-motion";

export const JewelleryCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
      data-testid={`jewellery-card-${item.id}`}
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-stone-100 mb-4">
        <img
          src={item.imageUrl}
          alt={`${item.name} jewellery from Sheeshmahal Jewellers in Varanasi`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <span className="uppercase tracking-widest text-sm text-amber-600 font-semibold">
          {item.category}
        </span>
        <h3 className="font-serif text-xl text-stone-900 font-semibold">
          {item.name}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};

export default JewelleryCard;
