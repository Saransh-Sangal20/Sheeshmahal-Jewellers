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
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <span className="uppercase tracking-widest text-xs text-amber-600 font-medium">
          {item.category}
        </span>
        <h3 className="font-serif text-xl text-stone-900 font-medium">
          {item.name}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <p className="text-stone-400 text-xs uppercase tracking-wider pt-2">
          Visit Store for Price
        </p>
      </div>
    </motion.div>
  );
};

export default JewelleryCard;
