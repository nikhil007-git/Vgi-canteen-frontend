import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  Clock, 
  Bell, 
  QrCode, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Flame 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const popularShortcuts = [
    { name: "Kulhad Chai", price: "₹15", tag: "Hot" },
    { name: "Samosa Chat", price: "₹30", tag: "Popular" },
    { name: "Special Thali", price: "₹90", tag: "Lunch" },
    { name: "Paneer Roll", price: "₹60", tag: "Fast" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50/50 via-white to-slate-50 w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
              {/* Campus pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/80 text-brand-700 text-[11px] sm:text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-pulse" />
                <span>Vishveshwarya Group of Institutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18]">
                Your Canteen, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500">
                  Without the Wait.
                </span>
              </h1>

              {/* Sub-text */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Order before your lecture ends. Track food cooking live, skip the counter rush, and collect your hot meal instantly with your digital pass.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <span>{user ? "Go to Canteen" : "Get Started Now"}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Menu</span>
                </Link>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-slate-700 text-[11px] sm:text-xs font-semibold text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                  <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span>Order &lt; 60s</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Live Prep ETA</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 p-2 rounded-xl bg-white/80 border border-slate-100">
                  <QrCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>QR Pickup</span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Showcase */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <div className="relative h-60 sm:h-72 overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
                    alt="Delicious Canteen Meals"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Floating Live Indicator */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live Kitchen
                    </span>
                  </div>

                  {/* Avg prep on bottom of image */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-bold">
                    <span className="text-white/90">Fresh Chole Bhature</span>
                    <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-xs text-amber-300">
                      ⚡ ~10 mins prep
                    </span>
                  </div>
                </div>

                {/* Card Content with Order Simulation */}
                <div className="p-4 bg-white space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ready for pickup at <strong className="text-slate-800">Counter #1</strong></span>
                    </div>
                    <span className="font-extrabold text-brand-600">₹80</span>
                  </div>

                  {/* Simulated Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full w-3/4 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Order Placed</span>
                    <span className="text-brand-600">Cooking Now</span>
                    <span>Ready</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Campus Quick-Picks Preview */}
      <section className="py-6 sm:py-8 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm sm:text-base">
              <Flame className="w-4 h-4 text-brand-500" />
              <span>Campus Favorites</span>
            </div>
            <Link to="/menu" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>View full menu</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {popularShortcuts.map((item, idx) => (
              <Link
                key={idx}
                to="/menu"
                className="p-3 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-100 hover:border-brand-200 transition-all group flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                    {item.tag}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-brand-600 transition-colors">
                    {item.name}
                  </h4>
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-800 shrink-0">
                  {item.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Benefits - Sleek 2x2 on Mobile, 4-Col on Desktop */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-[11px] uppercase font-extrabold text-brand-600 tracking-wider">Campus Engineered</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Built for Fast Campus Life
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              No more standing in crowded 20-minute canteen queues between lectures.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Card 1 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 font-bold">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Order in Seconds</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Select your meal with 1-tap reordering from anywhere on campus.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 font-bold">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Track Live Prep</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Real-time kitchen status with live countdown timers and ETAs.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 font-bold">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Instant Alerts</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Audio chimes and ready notifications the moment your meal is hot.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 font-bold">
                  <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Fast QR Pickup</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                  Flash your digital pass to counter staff and grab your meal instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: Modern Connected Timeline Stepper */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] uppercase font-extrabold text-brand-600 tracking-wider">How It Works</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              4 Steps from Order to Table
            </h2>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3 sm:space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/25">
                1
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Select Your Food</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 hidden sm:inline">
                    Menu
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                  Choose samosas, thalis, dosas, rolls, or kulhad chai with your preferred add-ons and notes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/25">
                2
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Pay Online</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 hidden sm:inline">
                    Razorpay UPI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                  Pay instantly and securely via UPI, Card, or Net Banking with zero extra charges.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/25">
                3
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Track Progress Live</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 hidden sm:inline">
                    Live Status
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                  Walk leisurely towards the canteen while the kitchen staff prepares your piping-hot meal.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-brand-500/25">
                4
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Scan QR & Collect</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 hidden sm:inline">
                    No Line
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
                  Flash your order QR code or give your short 4-digit token to counter staff and enjoy your food!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-tr from-brand-600 via-brand-500 to-amber-500 p-6 sm:p-10 text-white text-center shadow-xl shadow-brand-500/20 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Hungry Right Now?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
              Check out today&apos;s freshly prepared specials and skip the counter queue in under 60 seconds.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-white text-brand-600 hover:bg-brand-50 font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>Browse Live Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimal Light Footer */}
      <footer className="mt-auto py-6 pb-24 sm:pb-8 bg-white border-t border-slate-100 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-900">VGI Canteen</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px]">Vishveshwarya Group of Institutions</span>
          </div>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} VGI Canteen. Official Campus Dining System.
          </p>
        </div>
      </footer>
    </div>
  );
};
