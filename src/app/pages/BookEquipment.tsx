import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { Tractor, Calendar, MapPin, User, Clock, DollarSign, Star, CheckCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const EQUIPMENT = [
  {
    id: 1,
    name: 'Tractor (50 HP)',
    category: 'Tractor',
    image: '🚜',
    owner: 'Punjab Agri Rentals',
    location: 'Ludhiana',
    distance: '5 km',
    rating: 4.8,
    reviews: 156,
    pricePerHour: 500,
    pricePerDay: 3500,
    available: true,
    features: ['Rotavator attachment', 'Fuel included', 'Trained operator'],
    specifications: {
      power: '50 HP',
      brand: 'Mahindra',
      year: '2022',
      condition: 'Excellent',
    },
  },
  {
    id: 2,
    name: 'Combine Harvester',
    category: 'Harvester',
    image: '🌾',
    owner: 'Green Farm Equipment',
    location: 'Jalandhar',
    distance: '12 km',
    rating: 4.9,
    reviews: 89,
    pricePerHour: 1200,
    pricePerDay: 8500,
    available: true,
    features: ['Latest model', 'GPS tracking', 'Experienced operator included'],
    specifications: {
      power: '120 HP',
      brand: 'John Deere',
      year: '2023',
      condition: 'Like new',
    },
  },
  {
    id: 3,
    name: 'Rotavator',
    category: 'Tillage',
    image: '🔧',
    owner: 'Amritsar Farm Tools',
    location: 'Amritsar',
    distance: '8 km',
    rating: 4.7,
    reviews: 124,
    pricePerHour: 300,
    pricePerDay: 2000,
    available: true,
    features: ['8 feet width', 'Sharp blades', 'Excellent for paddy fields'],
    specifications: {
      width: '8 feet',
      brand: 'Lemken',
      year: '2021',
      condition: 'Good',
    },
  },
  {
    id: 4,
    name: 'Seed Drill',
    category: 'Sowing',
    image: '🌱',
    owner: 'Modern Agri Services',
    location: 'Patiala',
    distance: '15 km',
    rating: 4.6,
    reviews: 67,
    pricePerHour: 400,
    pricePerDay: 2500,
    available: false,
    features: ['Multi-crop compatible', 'Precision seeding', 'Fertilizer attachment'],
    specifications: {
      rows: '9 rows',
      brand: 'Swaraj',
      year: '2022',
      condition: 'Good',
    },
  },
  {
    id: 5,
    name: 'Sprayer (Boom Type)',
    category: 'Spraying',
    image: '💧',
    owner: 'Crop Care Equipment',
    location: 'Ludhiana',
    distance: '3 km',
    rating: 4.8,
    reviews: 92,
    pricePerHour: 350,
    pricePerDay: 2200,
    available: true,
    features: ['500L tank', 'Wide coverage', 'Adjustable nozzles'],
    specifications: {
      capacity: '500 liters',
      brand: 'Aspee',
      year: '2023',
      condition: 'Excellent',
    },
  },
  {
    id: 6,
    name: 'Thresher',
    category: 'Processing',
    image: '⚙️',
    owner: 'Punjab Farm Machinery',
    location: 'Moga',
    distance: '18 km',
    rating: 4.5,
    reviews: 78,
    pricePerHour: 600,
    pricePerDay: 4000,
    available: true,
    features: ['High capacity', 'Low grain damage', 'Mobile unit'],
    specifications: {
      capacity: '1000 kg/hr',
      brand: 'Shaktiman',
      year: '2021',
      condition: 'Good',
    },
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Equipment', icon: '🚜' },
  { id: 'Tractor', name: 'Tractors', icon: '🚜' },
  { id: 'Harvester', name: 'Harvesters', icon: '🌾' },
  { id: 'Tillage', name: 'Tillage', icon: '🔧' },
  { id: 'Sowing', name: 'Sowing', icon: '🌱' },
  { id: 'Spraying', name: 'Spraying', icon: '💧' },
];

export function BookEquipment() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingHours, setBookingHours] = useState('8');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const filteredEquipment = EQUIPMENT.filter(
    (eq) => selectedCategory === 'all' || eq.category === selectedCategory
  );

  const handleBooking = (equipmentId: number) => {
    setSelectedEquipment(equipmentId);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }
    toast.success('🎉 Equipment booked successfully!');
    setShowBookingModal(false);
    setBookingDate('');
    setBookingHours('8');
  };

  const selectedEq = EQUIPMENT.find((eq) => eq.id === selectedEquipment);
  const estimatedCost = selectedEq
    ? parseInt(bookingHours) * selectedEq.pricePerHour
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rent Farm Equipment
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Book tractors, harvesters, and other farming equipment near you
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <Tractor className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">50+</p>
            <p className="text-orange-100 text-sm">Equipment Available</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <DollarSign className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">₹300/hr</p>
            <p className="text-green-100 text-sm">Starting Price</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">24/7</p>
            <p className="text-blue-100 text-sm">Booking Available</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEquipment.map((equipment) => (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-8 flex items-center justify-center relative">
                <span className="text-6xl">{equipment.image}</span>
                {!equipment.available && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs rounded-full font-semibold">
                    Booked
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {equipment.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    <span>{equipment.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{equipment.location} ({equipment.distance} away)</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {equipment.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({equipment.reviews} bookings)
                  </span>
                </div>

                {/* Specifications */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(equipment.specifications).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {key}:
                        </span>
                        <span className="ml-1 font-semibold text-gray-900 dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  {equipment.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ₹{equipment.pricePerHour}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">/hour</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ₹{equipment.pricePerDay}/day (8+ hours)
                  </p>
                </div>

                {/* Action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBooking(equipment.id)}
                    disabled={!equipment.available}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      equipment.available
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {equipment.available ? 'Book Now' : 'Not Available'}
                  </button>
                  <button className="px-4 py-3 border-2 border-orange-600 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedEq && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Book {selectedEq.name}
              </h2>

              <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Booking Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Hours Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={bookingHours}
                    onChange={(e) => setBookingHours(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="4">4 hours</option>
                    <option value="8">8 hours (Full day)</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                  </select>
                </div>

                {/* Cost Summary */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                    Booking Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Equipment:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedEq.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {bookingHours} hours
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-orange-200 dark:border-orange-800">
                      <span className="text-gray-700 dark:text-gray-300">Total Cost:</span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        ₹{estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
