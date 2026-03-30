import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { Sprout, ShoppingBag, Star, Truck, Shield, CheckCircle, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { seedOrdersApi, cartApi } from '../../utils/api';
import { useAuth } from '../components/AuthProvider';

const SEED_CATEGORIES = [
  { id: 'all', name: 'All Seeds', icon: '🌾' },
  { id: 'cereals', name: 'Cereals', icon: '🌾' },
  { id: 'pulses', name: 'Pulses', icon: '🫘' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
];

const SEEDS = [
  {
    id: 1,
    name: 'HD-3086 Wheat Seeds',
    category: 'cereals',
    brand: 'Punjab Agricultural University',
    price: 45,
    unit: 'kg',
    rating: 4.8,
    reviews: 245,
    image: '🌾',
    inStock: true,
    certified: true,
    yield: '55-60 quintals/acre',
    duration: '135-140 days',
    features: ['Disease resistant', 'High yield', 'Premium quality'],
  },
  {
    id: 2,
    name: 'PR-126 Paddy Seeds',
    category: 'cereals',
    brand: 'IARI',
    price: 60,
    unit: 'kg',
    rating: 4.9,
    reviews: 312,
    image: '🌾',
    inStock: true,
    certified: true,
    yield: '70-75 quintals/acre',
    duration: '140-145 days',
    features: ['Basmati quality', 'Pest resistant', 'Best for Punjab'],
  },
  {
    id: 3,
    name: 'Hybrid Cotton BT',
    category: 'cotton',
    brand: 'Mahyco',
    price: 950,
    unit: 'packet (450g)',
    rating: 4.7,
    reviews: 189,
    image: '🌱',
    inStock: true,
    certified: true,
    yield: '25-30 quintals/acre',
    duration: '150-160 days',
    features: ['Bollworm resistant', 'High fiber quality', 'Certified BT'],
  },
  {
    id: 4,
    name: 'Moong Dal Seeds',
    category: 'pulses',
    brand: 'ICAR',
    price: 120,
    unit: 'kg',
    rating: 4.6,
    reviews: 156,
    image: '🫘',
    inStock: true,
    certified: true,
    yield: '8-10 quintals/acre',
    duration: '60-65 days',
    features: ['Fast growing', 'Good for summer', 'High protein'],
  },
  {
    id: 5,
    name: 'Mustard Seeds (RH-30)',
    category: 'oilseeds',
    brand: 'CCS HAU',
    price: 85,
    unit: 'kg',
    rating: 4.5,
    reviews: 98,
    image: '🌻',
    inStock: false,
    certified: true,
    yield: '15-18 quintals/acre',
    duration: '125-130 days',
    features: ['Oil rich', 'Cold tolerant', 'Early maturity'],
  },
  {
    id: 6,
    name: 'Tomato Hybrid Seeds',
    category: 'vegetables',
    brand: 'Syngenta',
    price: 450,
    unit: '10g packet',
    rating: 4.9,
    reviews: 267,
    image: '🍅',
    inStock: true,
    certified: true,
    yield: '400-500 quintals/acre',
    duration: '70-80 days',
    features: ['High yield', 'Disease resistant', 'Market preferred'],
  },
];

export function BuySeeds() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    deliveryAddress: '',
    contactPhone: '',
    paymentMethod: 'cod' as 'cod' | 'online',
  });
  const [loading, setLoading] = useState(false);
  const { user, updatePoints } = useAuth();

  // Load cart from server on mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const { items } = await cartApi.get();
          const cartMap: Record<number, number> = {};
          items.forEach((item: any) => {
            cartMap[item.seedId] = item.quantity;
          });
          setCart(cartMap);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    };
    loadCart();
  }, [user]);

  // Save cart to server when it changes
  useEffect(() => {
    const saveCartToServer = async () => {
      if (user && Object.keys(cart).length > 0) {
        try {
          const items = Object.entries(cart).map(([seedId, quantity]) => {
            const seed = SEEDS.find(s => s.id === Number(seedId));
            return {
              seedId: Number(seedId),
              name: seed?.name || '',
              quantity,
              price: seed?.price || 0,
              unit: seed?.unit || '',
            };
          });
          await cartApi.save(items);
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      }
    };
    
    const timeoutId = setTimeout(saveCartToServer, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [cart, user]);

  const filteredSeeds = SEEDS.filter((seed) => {
    const matchesCategory = selectedCategory === 'all' || seed.category === selectedCategory;
    const matchesSearch = seed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seed.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (seedId: number) => {
    setCart((prev) => ({
      ...prev,
      [seedId]: (prev[seedId] || 0) + 1,
    }));
    toast.success('Added to cart!');
  };

  const updateCartQuantity = (seedId: number, quantity: number) => {
    if (quantity <= 0) {
      const newCart = { ...cart };
      delete newCart[seedId];
      setCart(newCart);
    } else {
      setCart((prev) => ({
        ...prev,
        [seedId]: quantity,
      }));
    }
  };

  const handleCheckout = async () => {
    if (!checkoutForm.deliveryAddress || !checkoutForm.contactPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(checkoutForm.contactPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const items = Object.entries(cart).map(([seedId, quantity]) => {
        const seed = SEEDS.find(s => s.id === Number(seedId));
        return {
          seedId: Number(seedId),
          name: seed?.name || '',
          quantity,
          price: seed?.price || 0,
          unit: seed?.unit || '',
        };
      });

      const { order } = await seedOrdersApi.create({
        items,
        totalAmount: cartTotal,
        deliveryAddress: checkoutForm.deliveryAddress,
        contactPhone: checkoutForm.contactPhone,
        paymentMethod: checkoutForm.paymentMethod,
      });

      toast.success('🎉 Order placed successfully!');
      updatePoints(15);
      
      // Clear cart
      setCart({});
      setShowCheckout(false);
      setCheckoutForm({
        deliveryAddress: '',
        contactPhone: '',
        paymentMethod: 'cod',
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = Object.entries(cart).reduce((total, [seedId, quantity]) => {
    const seed = SEEDS.find((s) => s.id === Number(seedId));
    return total + (seed ? seed.price * quantity : 0);
  }, 0);

  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const cartItems = Object.entries(cart).map(([seedId, quantity]) => {
    const seed = SEEDS.find(s => s.id === Number(seedId));
    return { seed, quantity };
  }).filter(item => item.seed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Buy Quality Seeds
              </h1>
            </div>
            {cartItemCount > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Cart ({cartItemCount})
                  <span className="ml-2 text-sm opacity-90">₹{cartTotal.toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Certified seeds from trusted brands with guaranteed quality
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Certified Seeds</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">100% Genuine</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Free Delivery</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders above ₹500</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Guaranteed</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Money back warranty</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for seeds, brands, or crops..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {SEED_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Seeds Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeeds.map((seed) => (
            <motion.div
              key={seed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image Section */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 flex items-center justify-center">
                <span className="text-6xl">{seed.image}</span>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {seed.name}
                    </h3>
                    {seed.certified && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                        ✓ Certified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{seed.brand}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {seed.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({seed.reviews} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Yield:</span>
                    <span>{seed.yield}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Duration:</span>
                    <span>{seed.duration}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {seed.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₹{seed.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">per {seed.unit}</p>
                  </div>
                  <button
                    onClick={() => addToCart(seed.id)}
                    disabled={!seed.inStock}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      seed.inStock
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {seed.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSeeds.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No seeds found matching your criteria
            </p>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</label>
                  <input
                    type="text"
                    value={checkoutForm.deliveryAddress}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
                  <input
                    type="tel"
                    value={checkoutForm.contactPhone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={checkoutForm.paymentMethod === 'cod'}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value as 'cod' | 'online' })}
                      />
                      Cash on Delivery
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={checkoutForm.paymentMethod === 'online'}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value as 'cod' | 'online' })}
                      />
                      Online Payment
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-xl font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}