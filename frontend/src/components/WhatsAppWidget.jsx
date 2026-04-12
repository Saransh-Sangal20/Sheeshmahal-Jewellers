import { useState } from "react";

const WHATSAPP_NUMBER = "919839555066";
const WHATSAPP_MESSAGE = "Hi! I'm interested in your jewellery collection. Can you help me?";

export const WhatsAppWidget = () => {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3" data-testid="whatsapp-widget">
      {/* Tooltip */}
      <div
        className={`bg-white text-stone-800 text-sm font-medium px-4 py-2 rounded-full shadow-lg border border-stone-100 whitespace-nowrap transition-all duration-300 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
        data-testid="whatsapp-tooltip"
      >
        Chat with us!
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="whatsapp-btn w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        data-testid="whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.913 15.913 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.342 22.616c-.39 1.1-1.932 2.012-3.178 2.278-.854.18-1.968.324-5.72-1.23-4.804-1.99-7.896-6.87-8.134-7.19-.228-.32-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.39-.428.918-.606 1.222-.606.152 0 .288.008.41.014.43.018.646.044.93.72.356.844 1.224 2.986 1.33 3.204.108.218.214.512.066.81-.138.304-.258.44-.476.694-.218.254-.424.448-.642.722-.198.242-.42.502-.174.932.246.424 1.094 1.804 2.35 2.922 1.616 1.438 2.978 1.886 3.402 2.094.43.208.68.174.93-.104.256-.284 1.096-1.278 1.388-1.716.286-.438.578-.364.972-.218.398.142 2.526 1.192 2.958 1.408.43.218.718.324.824.508.108.184.108 1.068-.282 2.166z"/>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppWidget;
