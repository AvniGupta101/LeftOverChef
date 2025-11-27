import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Upload, X, Camera, Package, MapPin, Clock, Calendar } from "lucide-react";
import { api } from "../api/client";

export default function UploadListing() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    pickupAddress: "",
    pickupTime: "",
    perishabilityHours: ""
  });

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Revoke previous preview if any
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // data URI
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageBase64(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!imageBase64) {
      toast.error("Please upload a food image");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const qty = parseInt(formData.quantity, 10);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("You must be logged in to create a listing");
        navigate("/login");
        return;
      }

      // Prepare payload — NOTE: backend expects "imageBase64"
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        quantity: qty,
        pickupAddress: formData.pickupAddress.trim(),
        pickupTime: formData.pickupTime || null,
        perishabilityHours: formData.perishabilityHours ? parseInt(formData.perishabilityHours, 10) : null,
        imageBase64 // <-- important: match backend expected field
      };

      // If your api client already attaches Authorization header via interceptor,
      // you can just call: await api.post('/upload', payload)
      // Here we include token manually to be explicit:
     const response = await api.post("/listings", payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});


      // If backend returns predictions, show top prediction (optional)
      const preds = response?.data?.predictions;
      if (preds && Array.isArray(preds) && preds.length) {
        const top = preds[0];
        toast.success(`Listing created — classifier: ${top.className} (${(top.probability*100).toFixed(0)}%)`);
      } else {
        toast.success("Listing created successfully! 🎉");
      }

      // Redirect to my-listings page
      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (error) {
      console.error("Upload error:", error);
      
      const errorMessage = 
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to create listing";
      
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-lg mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Donate Food
          </h1>
          <p className="text-gray-600 text-lg">
            Share your surplus food with those in need
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Food Image *
                </div>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ margin: '0 auto 1rem' }}>
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload food image
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '100%', height: '40rem', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                    style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Food Title *
                </div>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Fresh Biryani (50 servings)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us more about the food, ingredients, preparation time, etc."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Quantity & Perishability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (servings) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Perishability (hours)
                  </div>
                </label>
                <input
                  type="number"
                  name="perishabilityHours"
                  value={formData.perishabilityHours}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pickup Address *
                </div>
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                required
                placeholder="123 Main Street, City, State"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Pickup Time
                </div>
              </label>
              <input
                type="datetime-local"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Creating Listing...
                  </span>
                ) : (
                  "Create Donation Listing"
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              * Required fields. Your listing will be reviewed before being published.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
