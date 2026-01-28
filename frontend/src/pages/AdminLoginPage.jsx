import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, formData);
      const { token, admin } = response.data;

      // Store token and admin data
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(admin));

      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.detail || "Invalid email or password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-stone-900 flex items-center justify-center px-6"
      data-testid="admin-login-page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-white font-semibold">
            Sheeshmahal
            <span className="block text-amber-500 text-xl italic">
              Jewellers
            </span>
          </h1>
          <p className="text-stone-400 text-sm mt-4">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-stone-800 p-8 border border-stone-700">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-amber-600 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="font-serif text-xl text-white text-center mb-6">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-stone-300 font-medium mb-2 block"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@jewellery.com"
                className="rounded-none border-stone-600 bg-stone-700 text-white placeholder:text-stone-500 focus:border-amber-500 focus:ring-0"
                data-testid="admin-email-input"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-stone-300 font-medium mb-2 block"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="rounded-none border-stone-600 bg-stone-700 text-white placeholder:text-stone-500 focus:border-amber-500 focus:ring-0 pr-10"
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white hover:bg-amber-700 rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold"
              data-testid="admin-login-btn"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-stone-400 hover:text-amber-500 text-sm transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
