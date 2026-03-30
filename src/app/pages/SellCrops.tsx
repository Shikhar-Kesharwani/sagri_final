import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { ShoppingCart, TrendingUp, MapPin, Phone, User, Package, Calendar, DollarSign, CheckCircle, Clock, Star, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { cropListingsApi, type CropListing } from '../../utils/api';

const CROPS = [
  { id: 'wheat', name: 'Wheat (गेहूं)', unit: 'quintal', marketPrice: 2450 },
  { id: 'rice', name: 'Rice (धान)', unit: 'quintal', marketPrice: 3200 },
  { id: 'cotton', name: 'Cotton (कपास)', unit: 'quintal', marketPrice: 8500 },
  { id: 'sugarcane', name: 'Sugarcane (गन्ना)', unit: 'quintal', marketPrice: 350 },
  { id: 'maize', name: 'Maize (मक्का)', unit: 'quintal', marketPrice: 2100 },
  { id: 'pulses', name: 'Pulses (दालें)', unit: 'quintal', marketPrice: 5500 },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', unit: 'quintal', marketPrice: 4200 },
  { id: 'mustard', name: 'Mustard (सरसों)', unit: 'quintal', marketPrice: 5800 },
];

const QUALITIES = [
  { id: 'premium', name: 'Premium (A Grade)', priceMultiplier: 1.15 },
  { id: 'standard', name: 'Standard (B Grade)', priceMultiplier: 1.0 },
  { id: 'basic', name: 'Basic (C Grade)', priceMultiplier: 0.85 },
];

export function SellCrops() {
  const { user, updatePoints } = useAuth();
  const [activeTab, setActiveTab] = useState<'sell' | 'myListings'>('sell');
  
  // Sell Form State
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quality, setQuality] = useState('standard');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock Listings
  const [myListings, setMyListings] = useState<CropListing[]>([]);

  const selectedCrop = CROPS.find(c => c.id === cropType);
  const selectedQuality = QUALITIES.find(q => q.id === quality);
  const suggestedPrice = selectedCrop && selectedQuality 
    ? Math.round(selectedCrop.marketPrice * selectedQuality.priceMultiplier)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cropType || !quantity || !price || !location || !contactPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const selectedCropData = CROPS.find(c => c.id === cropType);
      
      const { listing } = await cropListingsApi.create({
        cropType,
        cropName: selectedCropData?.name || cropType,
        quantity: parseFloat(quantity),
        quality,
        price: parseFloat(price),
        location,
        contactPhone,
        description,
        harvestDate,
      });

      toast.success('🎉 Your crop listing is now live!');
      updatePoints(10);
      
      // Add new listing to the front of the array
      setMyListings(prev => [listing, ...prev]);
      
      // Reset form
      setCropType('');
      setQuantity('');
      setPrice('');
      setLocation('');
      setContactPhone('');
      setDescription('');
      setHarvestDate('');
      setQuality('standard');
      
      // Switch to my listings tab
      setActiveTab('myListings');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  // Load user's listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { listings } = await cropListingsApi.getMy();
        setMyListings(listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        // Fail silently on initial load
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sell Your Crops
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Connect directly with buyers and get the best prices for your produce
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">₹{suggestedPrice || '—'}</p>
            <p className="text-blue-100 text-sm">Suggested Price/Quintal</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">1,245</p>
            <p className="text-green-100 text-sm">Active Buyers</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <Star className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">4.8/5</p>
            <p className="text-purple-100 text-sm">Average Rating</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'sell'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
            }`}
          >
            Create Listing
          </button>
          <button
            onClick={() => setActiveTab('myListings')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'myListings'
                ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
            }`}
          >
            My Listings ({myListings.length})
          </button>
        </div>

        {activeTab === 'sell' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Crop Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select crop type</option>
                    {CROPS.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {QUALITIES.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity (quintals) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 50"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price per Quintal (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={suggestedPrice ? `Suggested: ₹${suggestedPrice}` : 'Enter price'}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                    {suggestedPrice > 0 && (
                      <button
                        type="button"
                        onClick={() => setPrice(suggestedPrice.toString())}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Use suggested
                      </button>
                    )}
                  </div>
                  {suggestedPrice > 0 && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Market price: ₹{selectedCrop?.marketPrice}
                    </p>
                  )}
                </div>
              </div>

              {/* Location and Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Ludhiana, Punjab"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g., 9876543210"
                      pattern="[0-9]{10}"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Harvest Date (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any additional information about your crop (storage conditions, organic certification, etc.)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Price Summary */}
              {quantity && price && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                    Expected Earnings
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                      ₹{(parseInt(quantity) * parseInt(price)).toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ({quantity} quintals × ₹{price})
                    </span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Creating Listing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Create Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {listing.cropName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>{listing.quantity} quintals</span>
                        <span>•</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ₹{listing.price}/quintal
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                          {listing.quality}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.status === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {listing.status === 'active' ? '🟢 Active' : '✅ Sold'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {listing.views} views
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {listing.interested} interested buyers
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Posted {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {listing.status === 'sold' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      ✅ Sold for{' '}
                      <strong>₹{(listing.quantity * listing.price).toLocaleString('en-IN')}</strong>
                    </p>
                  </div>
                )}

                {listing.status === 'active' && (
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Edit Listing
                    </button>
                    <button className="px-4 py-2 border-2 border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}