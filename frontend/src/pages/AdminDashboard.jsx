import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Gem,
  MessageSquare,
  Check,
  X,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ["Gold", "Silver", "Diamond", "Platinum"];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [jewellery, setJewellery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("adminToken");

  // Fetch data on mount
  useEffect(() => {
    fetchJewellery();
    fetchReviews();
  }, []);

  const fetchJewellery = async () => {
    try {
      const res = await axios.get(`${API}/jewellery`);
      setJewellery(res.data);
    } catch (error) {
      toast.error("Failed to fetch jewellery");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        imageUrl: item.imageUrl,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        imageUrl: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      imageUrl: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.description ||
      !formData.imageUrl
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingItem) {
        // Update
        await axios.put(`${API}/jewellery/${editingItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Jewellery updated successfully");
      } else {
        // Create
        await axios.post(`${API}/jewellery`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Jewellery added successfully");
      }
      handleCloseDialog();
      fetchJewellery();
    } catch (error) {
      toast.error("Failed to save jewellery");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${API}/jewellery/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Jewellery deleted successfully");
      fetchJewellery();
    } catch (error) {
      toast.error("Failed to delete jewellery");
    }
  };

  const handleReviewAction = async (reviewId, approved) => {
    try {
      await axios.put(
        `${API}/admin/reviews/${reviewId}?approved=${approved}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(approved ? "Review approved" : "Review rejected");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${API}/admin/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl text-white font-semibold">
              Sheeshmahal{" "}
              <span className="text-amber-500 italic">Admin</span>
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-stone-300 hover:text-white hover:bg-stone-800"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="jewellery" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-stone-200 rounded-none mb-8">
            <TabsTrigger
              value="jewellery"
              className="rounded-none data-[state=active]:bg-stone-900 data-[state=active]:text-white"
              data-testid="tab-jewellery"
            >
              <Gem className="w-4 h-4 mr-2" />
              Jewellery
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none data-[state=active]:bg-stone-900 data-[state=active]:text-white"
              data-testid="tab-reviews"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Jewellery Tab */}
          <TabsContent value="jewellery">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-stone-900 font-semibold">
                Manage Jewellery
              </h2>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-stone-900 hover:bg-stone-800 rounded-none"
                data-testid="add-jewellery-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-stone-500">Loading...</div>
            ) : jewellery.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                No jewellery items found. Add your first item!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jewellery.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-stone-100 overflow-hidden"
                    data-testid={`admin-jewellery-${item.id}`}
                  >
                    <div className="aspect-video bg-stone-100 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-stone-900 text-white text-xs px-2 py-1 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-stone-900 font-medium mb-1">
                        {item.name}
                      </h3>
                      <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                        {item.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleOpenDialog(item)}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none"
                          data-testid={`edit-btn-${item.id}`}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-none text-red-600 hover:bg-red-50 hover:text-red-700"
                          data-testid={`delete-btn-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <h2 className="font-serif text-2xl text-stone-900 font-semibold mb-6">
              Manage Reviews
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`bg-white border p-4 ${
                      review.approved ? "border-green-200" : "border-amber-200"
                    }`}
                    data-testid={`review-${review.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-stone-900">
                            {review.name}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-amber-500"
                                    : "text-stone-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 ${
                              review.approved
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {review.approved ? "Approved" : "Pending"}
                          </span>
                        </div>
                        <p className="text-stone-600 text-sm">
                          "{review.comment}"
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!review.approved && (
                          <Button
                            onClick={() => handleReviewAction(review.id, true)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 rounded-none"
                            data-testid={`approve-btn-${review.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {review.approved && (
                          <Button
                            onClick={() => handleReviewAction(review.id, false)}
                            size="sm"
                            variant="outline"
                            className="rounded-none"
                            data-testid={`reject-btn-${review.id}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteReview(review.id)}
                          size="sm"
                          variant="outline"
                          className="rounded-none text-red-600 hover:bg-red-50"
                          data-testid={`delete-review-btn-${review.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingItem ? "Edit Jewellery" : "Add New Jewellery"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter jewellery name"
                className="rounded-none"
                data-testid="form-name-input"
              />
            </div>

            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="rounded-none" data-testid="form-category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter description"
                rows={3}
                className="rounded-none resize-none"
                data-testid="form-description-input"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl" className="mb-2 block">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="rounded-none"
                data-testid="form-imageUrl-input"
              />
              {formData.imageUrl && (
                <div className="mt-2 aspect-video bg-stone-100 overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Invalid+URL";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1 rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-stone-900 hover:bg-stone-800 rounded-none"
                data-testid="form-submit-btn"
              >
                {editingItem ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
