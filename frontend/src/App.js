import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const LocationPage = lazy(() => import("@/pages/LocationPage"));

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

function App() {
  return (
    <div className="App min-h-screen bg-stone-50">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <Suspense
            fallback={
              <div className="min-h-[40vh] flex items-center justify-center text-stone-500">
                Loading page...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/location" element={<LocationPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppWidget />
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
