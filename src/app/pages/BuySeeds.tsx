import { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { Sprout, ShoppingBag, Star, Truck, Shield, CheckCircle, Search, MapPin, Sparkles } from 'lucide-react';
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
  { id: 'cotton', name: 'Cotton', icon: '🌿' },
];

// Region to best crop categories mapping
const REGION_CROPS: Record<string, string[]> = {
  punjab: ['cereals', 'oilseeds'],
  haryana: ['cereals', 'oilseeds', 'vegetables'],
  'uttar pradesh': ['cereals', 'vegetables', 'pulses'],
  up: ['cereals', 'vegetables', 'pulses'],
  maharashtra: ['cotton', 'oilseeds', 'pulses'],
  gujarat: ['cotton', 'oilseeds', 'pulses'],
  'madhya pradesh': ['cereals', 'oilseeds', 'pulses'],
  mp: ['cereals', 'oilseeds', 'pulses'],
  rajasthan: ['cereals', 'oilseeds', 'pulses'],
  'andhra pradesh': ['cereals', 'vegetables', 'cotton'],
  ap: ['cereals', 'vegetables', 'cotton'],
  telangana: ['cereals', 'vegetables', 'cotton'],
  karnataka: ['cereals', 'pulses', 'oilseeds'],
  'tamil nadu': ['cereals', 'vegetables', 'oilseeds'],
  tn: ['cereals', 'vegetables', 'oilseeds'],
  'west bengal': ['cereals', 'vegetables', 'pulses'],
  wb: ['cereals', 'vegetables', 'pulses'],
  bihar: ['cereals', 'vegetables', 'pulses'],
  odisha: ['cereals', 'pulses'],
  kerala: ['vegetables', 'oilseeds'],
  himachal: ['cereals', 'vegetables', 'oilseeds'],
  uttarakhand: ['cereals', 'oilseeds'],
  jharkhand: ['cereals', 'pulses'],
  chhattisgarh: ['cereals', 'pulses'],
};

// Comprehensive Indian seed catalog with region tags
const ALL_SEEDS = [
  // CEREALS
  { id: 1, name: 'HD-3086 Wheat Seeds', category: 'cereals', brand: 'Punjab Agricultural University', price: 45, unit: 'kg', rating: 4.8, reviews: 245, image: '🌾', inStock: true, certified: true, yield: '55-60 quintals/acre', duration: '135-140 days', regions: ['punjab', 'haryana', 'uttar pradesh', 'up', 'rajasthan', 'himachal'], features: ['Disease resistant', 'High yield', 'Best for North India'] },
  { id: 2, name: 'PR-126 Paddy Seeds', category: 'cereals', brand: 'IARI', price: 60, unit: 'kg', rating: 4.9, reviews: 312, image: '🌾', inStock: true, certified: true, yield: '70-75 quintals/acre', duration: '140-145 days', regions: ['punjab', 'haryana', 'west bengal', 'wb', 'odisha', 'jharkhand'], features: ['Basmati quality', 'Pest resistant', 'Best for Punjab'] },
  { id: 3, name: 'MTU-7029 Paddy (Swarna)', category: 'cereals', brand: 'AP Seed Dev. Corp', price: 55, unit: 'kg', rating: 4.7, reviews: 198, image: '🌾', inStock: true, certified: true, yield: '60-68 quintals/acre', duration: '148-155 days', regions: ['andhra pradesh', 'ap', 'telangana', 'odisha', 'chhattisgarh'], features: ['Flood tolerant', 'Heavy yield', 'South India'] },
  { id: 4, name: 'Sorghum CSV-15 (Jowar)', category: 'cereals', brand: 'ICRISAT', price: 40, unit: 'kg', rating: 4.5, reviews: 134, image: '🌾', inStock: true, certified: true, yield: '30-35 quintals/acre', duration: '105-110 days', regions: ['maharashtra', 'karnataka', 'rajasthan', 'madhya pradesh', 'mp'], features: ['Drought tolerant', 'Dual purpose', 'Best for Deccan'] },
  { id: 5, name: 'Maize DHM-117 Hybrid', category: 'cereals', brand: 'DuPont Pioneer', price: 380, unit: 'packet (2kg)', rating: 4.8, reviews: 227, image: '🌽', inStock: true, certified: true, yield: '55-65 quintals/acre', duration: '85-95 days', regions: ['karnataka', 'andhra pradesh', 'ap', 'telangana', 'bihar', 'jharkhand'], features: ['High protein', 'Fast growing', 'Market preferred'] },
  { id: 6, name: 'Wheat GW-322 (Gujarat)', category: 'cereals', brand: 'Anand Agricultural Univ.', price: 50, unit: 'kg', rating: 4.6, reviews: 88, image: '🌾', inStock: true, certified: true, yield: '45-55 quintals/acre', duration: '110-120 days', regions: ['gujarat', 'madhya pradesh', 'mp', 'rajasthan'], features: ['Heat tolerant', 'Semi-arid suitable', 'High protein'] },
  // PULSES
  { id: 7, name: 'Moong Dal Seeds (ML-1425)', category: 'pulses', brand: 'ICAR', price: 120, unit: 'kg', rating: 4.6, reviews: 156, image: '🫘', inStock: true, certified: true, yield: '8-10 quintals/acre', duration: '60-65 days', regions: ['all'], features: ['Fast growing', 'Good for summer', 'High protein'] },
  { id: 8, name: 'Arhar (Tur Dal) UPAS-120', category: 'pulses', brand: 'IIPR Kanpur', price: 95, unit: 'kg', rating: 4.5, reviews: 119, image: '🫘', inStock: true, certified: true, yield: '12-15 quintals/acre', duration: '130-140 days', regions: ['maharashtra', 'karnataka', 'uttar pradesh', 'up', 'madhya pradesh', 'mp'], features: ['Short duration', 'Wilt resistant', 'High yield'] },
  { id: 9, name: 'Lentil (Masur) WBL-77', category: 'pulses', brand: 'BHU Varanasi', price: 105, unit: 'kg', rating: 4.4, reviews: 74, image: '🫘', inStock: true, certified: true, yield: '10-14 quintals/acre', duration: '120-135 days', regions: ['uttar pradesh', 'up', 'madhya pradesh', 'mp', 'bihar', 'west bengal', 'wb'], features: ['High starch', 'Rust resistant', 'North India'] },
  // OILSEEDS
  { id: 10, name: 'Mustard Seeds (RH-749)', category: 'oilseeds', brand: 'CCS HAU Hisar', price: 85, unit: 'kg', rating: 4.5, reviews: 98, image: '🌻', inStock: true, certified: true, yield: '18-22 quintals/acre', duration: '125-130 days', regions: ['haryana', 'punjab', 'rajasthan', 'uttar pradesh', 'up'], features: ['Oil rich', 'Cold tolerant', 'Early maturity'] },
  { id: 11, name: 'Sunflower KBSH-44', category: 'oilseeds', brand: 'Univ. of Agri Sciences Karnataka', price: 200, unit: 'kg', rating: 4.6, reviews: 112, image: '🌻', inStock: true, certified: true, yield: '12-16 quintals/acre', duration: '80-95 days', regions: ['karnataka', 'andhra pradesh', 'ap', 'telangana', 'maharashtra'], features: ['Short duration', 'High oil content', 'Drought tolerant'] },
  { id: 12, name: 'Groundnut JL-24', category: 'oilseeds', brand: 'Junagadh Agricultural Univ.', price: 145, unit: 'kg', rating: 4.7, reviews: 167, image: '🥜', inStock: true, certified: true, yield: '20-25 quintals/acre', duration: '95-105 days', regions: ['gujarat', 'rajasthan', 'andhra pradesh', 'ap', 'telangana', 'karnataka'], features: ['Aflatoxin resistant', 'Good shelling', 'High oil'] },
  // COTTON
  { id: 13, name: 'Hybrid Cotton BT (MRC-7017)', category: 'cotton', brand: 'Mahyco', price: 950, unit: 'packet (450g)', rating: 4.7, reviews: 189, image: '🌿', inStock: true, certified: true, yield: '28-33 quintals/acre', duration: '150-160 days', regions: ['maharashtra', 'gujarat', 'telangana', 'andhra pradesh', 'ap'], features: ['Bollworm resistant', 'High fiber quality', 'Certified BT'] },
  { id: 14, name: 'Cotton Hybrid DCH-32', category: 'cotton', brand: 'Dharwad Cotton Research', price: 880, unit: 'packet (450g)', rating: 4.5, reviews: 143, image: '🌿', inStock: true, certified: true, yield: '25-30 quintals/acre', duration: '155-170 days', regions: ['karnataka', 'maharashtra', 'tamil nadu', 'tn'], features: ['Long staple fiber', 'Rain-fed suitable', 'South India'] },
  // VEGETABLES
  { id: 15, name: 'Tomato Hybrid (H-86)', category: 'vegetables', brand: 'Syngenta', price: 450, unit: '10g packet', rating: 4.9, reviews: 267, image: '🍅', inStock: true, certified: true, yield: '400-500 quintals/acre', duration: '70-80 days', regions: ['all'], features: ['High yield', 'Disease resistant', 'Market preferred'] },
  { id: 16, name: 'Brinjal Arka Nidhi', category: 'vegetables', brand: 'IIHR Bangalore', price: 280, unit: '10g packet', rating: 4.6, reviews: 102, image: '🍆', inStock: true, certified: true, yield: '250-300 quintals/acre', duration: '80-90 days', regions: ['karnataka', 'andhra pradesh', 'ap', 'telangana', 'west bengal', 'wb'], features: ['Wilt resistant', 'Long shelf life', 'Good quality'] },
  { id: 17, name: 'Onion Agrifound Light Red', category: 'vegetables', brand: 'NHRDF', price: 320, unit: '500g packet', rating: 4.7, reviews: 213, image: '🧅', inStock: true, certified: true, yield: '200-250 quintals/acre', duration: '110-120 days', regions: ['maharashtra', 'karnataka', 'andhra pradesh', 'ap', 'madhya pradesh', 'mp'], features: ['Long storage', 'High TSS', 'Export quality'] },
  { id: 18, name: 'Potato Kufri Jyoti', category: 'vegetables', brand: 'CPRI Shimla', price: 50, unit: 'kg (seed tubers)', rating: 4.5, reviews: 178, image: '🥔', inStock: true, certified: true, yield: '180-220 quintals/acre', duration: '80-90 days', regions: ['uttar pradesh', 'up', 'west bengal', 'wb', 'himachal', 'uttarakhand', 'punjab', 'bihar'], features: ['Cold tolerant', 'Late blight resistant', 'Table quality'] },
];

function getMatchedRegions(location: string | undefined): string[] {
  if (!location) return [];
  const loc = location.toLowerCase();
  return Object.keys(REGION_CROPS).filter(region => loc.includes(region));
}

export function BuySeeds() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ deliveryAddress: '', contactPhone: '', paymentMethod: 'cod' as 'cod' | 'online' });
  const [loading, setLoading] = useState(false);
  const { user, updatePoints } = useAuth();

  // Auto-fill checkout from user profile
  useEffect(() => {
    if (user) {
      setCheckoutForm(prev => ({
        ...prev,
        deliveryAddress: (user as any).location || '',
        contactPhone: (user as any).phone || '',
      }));
    }
  }, [user]);

  // Load cart from server
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const { items } = await cartApi.get();
          const cartMap: Record<number, number> = {};
          items.forEach((item: any) => { cartMap[item.seedId] = item.quantity; });
          setCart(cartMap);
        } catch (error) { console.error('Error loading cart:', error); }
      }
    };
    loadCart();
  }, [user]);

  // Save cart changes (debounced)
  useEffect(() => {
    const save = async () => {
      if (user && Object.keys(cart).length > 0) {
        try {
          const items = Object.entries(cart).map(([seedId, quantity]) => {
            const seed = ALL_SEEDS.find(s => s.id === Number(seedId));
            return { seedId: Number(seedId), name: seed?.name || '', quantity, price: seed?.price || 0, unit: seed?.unit || '' };
          });
          await cartApi.save(items);
        } catch (e) {}
      }
    };
    const t = setTimeout(save, 500);
    return () => clearTimeout(t);
  }, [cart, user]);

  const userLocation: string | undefined = (user as any)?.location;
  const matchedRegions = useMemo(() => getMatchedRegions(userLocation), [userLocation]);

  const isRecommended = (seed: typeof ALL_SEEDS[0]) => {
    if (matchedRegions.length === 0) return false;
    return seed.regions.includes('all') || seed.regions.some(r => matchedRegions.includes(r));
  };

  const filteredSeeds = useMemo(() =>
    ALL_SEEDS.filter(seed => {
      const matchesCat = selectedCategory === 'all' || seed.category === selectedCategory;
      const matchesQ = seed.name.toLowerCase().includes(searchQuery.toLowerCase()) || seed.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQ;
    }).sort((a, b) => (isRecommended(b) ? 1 : 0) - (isRecommended(a) ? 1 : 0)),
    [selectedCategory, searchQuery, matchedRegions]
  );

  const addToCart = (seedId: number) => { setCart(prev => ({ ...prev, [seedId]: (prev[seedId] || 0) + 1 })); toast.success('Added to cart!'); };
  const updateCartQuantity = (seedId: number, quantity: number) => {
    if (quantity <= 0) { const c = { ...cart }; delete c[seedId]; setCart(c); }
    else { setCart(prev => ({ ...prev, [seedId]: quantity })); }
  };

  const cartTotal = Object.entries(cart).reduce((t, [id, qty]) => { const s = ALL_SEEDS.find(x => x.id === Number(id)); return t + (s ? s.price * qty : 0); }, 0);
  const cartItemCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const handleCheckout = async () => {
    if (!checkoutForm.deliveryAddress || !checkoutForm.contactPhone) { toast.error('Please fill in all required fields'); return; }
    if (!/^[6-9]\d{9}$/.test(checkoutForm.contactPhone)) { toast.error('Please enter a valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      const items = Object.entries(cart).map(([seedId, quantity]) => {
        const seed = ALL_SEEDS.find(s => s.id === Number(seedId));
        return { seedId: Number(seedId), name: seed?.name || '', quantity, price: seed?.price || 0, unit: seed?.unit || '' };
      });
      await seedOrdersApi.create({ items, totalAmount: cartTotal, deliveryAddress: checkoutForm.deliveryAddress, contactPhone: checkoutForm.contactPhone, paymentMethod: checkoutForm.paymentMethod });
      toast.success('🎉 Order placed successfully!');
      updatePoints(15);
      setCart({});
      setShowCheckout(false);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Failed to place order'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Buy Quality Seeds</h1>
                {userLocation && (
                  <div className="flex items-center gap-1 mt-0.5 text-sm text-green-600 dark:text-green-400 font-medium">
                    <MapPin className="w-4 h-4" />
                    Personalised for <span className="capitalize ml-1 font-bold">{userLocation}</span>
                  </div>
                )}
              </div>
            </div>
            {cartItemCount > 0 && (
              <button onClick={() => setShowCheckout(true)} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart ({cartItemCount})
                <span className="ml-1 text-sm opacity-90">₹{cartTotal.toFixed(2)}</span>
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">Certified seeds from trusted brands with guaranteed quality — 18 varieties across India</p>
        </div>

        {/* Trust Badges */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Shield className="w-8 h-8 text-green-600" />, title: 'Certified Seeds', sub: '100% Genuine' },
            { icon: <Truck className="w-8 h-8 text-blue-600" />, title: 'Free Delivery', sub: 'Orders above ₹500' },
            { icon: <CheckCircle className="w-8 h-8 text-green-600" />, title: 'Guaranteed', sub: 'Money back warranty' },
          ].map(b => (
            <div key={b.title} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              {b.icon}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{b.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Location Banner */}
        {matchedRegions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-800 dark:text-green-300 text-sm">
              Seeds marked <strong>⭐ For Your Region</strong> are scientifically best suited for <span className="capitalize font-bold">{userLocation}</span> based on your profile.
            </p>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search seeds, brands, or crop type..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white" />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {SEED_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}>
              <span className="mr-1">{cat.icon}</span>{cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeeds.map(seed => {
            const rec = isRecommended(seed);
            return (
              <motion.div key={seed.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow ${rec ? 'border-green-400 dark:border-green-600 ring-2 ring-green-100 dark:ring-green-900' : 'border-gray-100 dark:border-gray-700'}`}>
                <div className={`p-8 flex items-center justify-center relative ${rec ? 'bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-800/40 dark:to-emerald-800/40' : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20'}`}>
                  {rec && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold">
                      ⭐ For Your Region
                    </span>
                  )}
                  <span className="text-6xl">{seed.image}</span>
                </div>
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{seed.name}</h3>
                      {seed.certified && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium ml-2 flex-shrink-0">✓ Certified</span>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{seed.brand}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{seed.rating}</span>
                    <span className="text-sm text-gray-500">({seed.reviews} reviews)</span>
                  </div>
                  <div className="mb-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <div><span className="font-medium">Yield:</span> {seed.yield}</div>
                    <div><span className="font-medium">Duration:</span> {seed.duration}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {seed.features.map((f, i) => <span key={i} className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full">{f}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{seed.price}</p>
                      <p className="text-xs text-gray-500">per {seed.unit}</p>
                    </div>
                    {cart[seed.id] ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(seed.id, cart[seed.id] - 1)} className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white">−</button>
                        <span className="w-6 text-center font-bold text-gray-900 dark:text-white">{cart[seed.id]}</span>
                        <button onClick={() => updateCartQuantity(seed.id, cart[seed.id] + 1)} className="w-8 h-8 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(seed.id)} disabled={!seed.inStock}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${seed.inStock ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
                        {seed.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredSeeds.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No seeds found matching your criteria</p>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Checkout</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                {(user as any)?.name ? `Order for ${(user as any).name}` : ''} — Total: <span className="text-green-600 font-bold">₹{cartTotal.toFixed(2)}</span>
              </p>
              {/* Order summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-5 space-y-2">
                {Object.entries(cart).map(([seedId, qty]) => {
                  const seed = ALL_SEEDS.find(s => s.id === Number(seedId));
                  return seed ? (
                    <div key={seedId} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>{seed.name} × {qty}</span>
                      <span className="font-semibold">₹{(seed.price * qty).toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address</label>
                <input type="text" value={checkoutForm.deliveryAddress}
                  onChange={e => setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })}
                  placeholder="Village, Tehsil, District, State..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                <input type="tel" value={checkoutForm.contactPhone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, contactPhone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white" required />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <div className="flex gap-6">
                  {[{ v: 'cod', l: '💵 Cash on Delivery' }, { v: 'online', l: '📱 Online Payment' }].map(o => (
                    <label key={o.v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="pm" value={o.v} checked={checkoutForm.paymentMethod === o.v}
                        onChange={e => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value as 'cod' | 'online' })} />
                      <span className="text-gray-700 dark:text-gray-300">{o.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={() => setShowCheckout(false)} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300">Cancel</button>
                <button onClick={handleCheckout} disabled={loading} className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50">
                  {loading ? 'Placing Order...' : `Place Order — ₹${cartTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}