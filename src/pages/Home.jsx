import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Flame, Sparkles, ArrowRight, Clock, Utensils, CheckCircle } from 'lucide-react';
import { vgiApi } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { FoodDetailModal } from '../components/FoodDetailModal';
import { FoodCardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [popularItems, setPopularItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [popRes, featRes] = await Promise.all([
          vgiApi.getItems({ popular: true }),
          vgiApi.getItems({ featured: true })
        ]);

        if (popRes.success) setPopularItems(popRes.items);
        if (featRes.success) setFeaturedItems(featRes.items);

        if (user) {
          const ordersRes = await vgiApi.getMyActiveOrders();
          if (ordersRes.success) setActiveOrders(ordersRes.orders);
        }
      } catch (err) {
        console.warn('Error loading home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search samosas, thali, dosa, cold coffee, maggi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-800 placeholder-slate-400 transition-all"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
        >
          Search
        </button>
      </form>

      {/* Active Order Alert Ribbon (If student has orders in progress) */}
      {activeOrders.length > 0 && (
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 rounded-2xl p-4 text-white shadow-lg shadow-brand-500/15 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                Order #{activeOrders[0].displayNumber || activeOrders[0].orderNumber} is{' '}
                {activeOrders[0].status === 'READY' ? 'Ready for Pickup! 🔔' : 'in preparation'}
              </h4>
              <p className="text-xs text-white/90">
                {activeOrders[0].status === 'READY'
                  ? 'Head to the canteen counter with your QR pass'
                  : 'Kitchen is preparing your meal'}
              </p>
            </div>
          </div>

          <Link
            to={`/orders/${activeOrders[0].id}`}
            className="px-4 py-2 rounded-xl bg-white text-brand-600 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Track</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}


      

      {/* Featured Specials Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Chef's Specials</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredItems.map((item) => (
              <FoodCard key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      {/* Popular Items Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Most Ordered on Campus</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularItems.map((item) => (
              <FoodCard key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      {/* Customization Details Modal */}
      {selectedItem && (
        <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

