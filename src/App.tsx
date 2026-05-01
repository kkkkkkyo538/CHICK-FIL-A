/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Menu as MenuIcon, 
  X, 
  Star, 
  Clock, 
  Utensils, 
  ShoppingBag, 
  Gift, 
  Info, 
  Mail, 
  ExternalLink,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';

// --- CONFIGURATION & AFFILIATE LINKS ---
// Swap these placeholders with your actual links
const LINKS = {
  APP_DOWNLOAD: 'https://YOUR-AFFILIATE-LINK-APP',
  CATERING_ORDER: 'https://YOUR-AFFILIATE-LINK-CATERING',
  GIFT_CARDS: 'https://YOUR-AFFILIATE-LINK-GIFTCARD',
  GENERAL_ORDER: 'https://YOUR-AFFILIATE-LINK-ORDER',
  AI_BLUEPRINT: 'https://aiblueprint.gumroad.com'
};

const BRAND_COLORS = {
  RED: '#E4002B',
  WHITE: '#FFFFFF',
  GOLD: '#FFB81C',
};

// --- TYPES ---
type Page = 'home' | 'deals' | 'menu' | 'catering' | 'giftcards' | 'blog' | 'about' | 'resources';

// --- DATA CENTRALIZATION FOR SEARCH ---
const DEALS_DATA = [
  { title: 'Spicy Deluxe Meal', desc: 'Verified Deal', tag: '$0.00 REWARD', icon: "🍔", category: 'deal' },
  { title: '8-Count Nuggets', desc: 'App Exclusive', tag: 'APP ONLY', icon: "🍗", category: 'deal' },
  { title: 'Waffle Potato Fries', desc: 'Daily Catch', tag: 'LIMITED', icon: "🍟", category: 'deal' },
  { title: '$5 Off Your First Delivery', desc: 'Expires in 48h', link: LINKS.APP_DOWNLOAD, type: 'App Exclusive', category: 'deal' },
  { title: 'Free Large Fry with Any Sandwich', desc: 'Ends soon', link: LINKS.APP_DOWNLOAD, type: 'Reward', category: 'deal' },
  { title: '20% Off Family Meal Deals', desc: 'Limited Supply', link: LINKS.GENERAL_ORDER, type: 'Combo', category: 'deal' },
  { title: 'Free Iced Coffee Monday', desc: 'Monthly', link: LINKS.APP_DOWNLOAD, type: 'Event', category: 'deal' },
];

const MENU_DATA = [
  { name: 'Original Chicken Sandwich', cal: '440', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=400', category: 'menu' },
  { name: 'Spicy Deluxe Sandwich', cal: '550', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400', category: 'menu' },
  { name: 'Waffle Potato Fries', cal: '420', img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=400', category: 'menu' },
  { name: 'Chik-fil-A Nuggets (12ct)', cal: '380', img: 'https://images.unsplash.com/photo-1562967914-608f82629b3a?auto=format&fit=crop&q=80&w=400', category: 'menu' },
];

const BLOG_DATA = [
  { title: 'How to Get Free Chick-fil-A Every Month', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600', category: 'blog' },
  { title: '7 Secret Menu Items You Must Try', img: 'https://images.unsplash.com/photo-1598182121887-5d8c3f93241b?auto=format&fit=crop&q=80&w=600', category: 'blog' },
  { title: 'Chick-fil-A Catering: The Wedding Guest Favorite', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600', category: 'blog' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const hasSeenPopup = useRef(false);

  // --- COUNTDOWN TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setHours(23, 59, 59, 999);
      
      const diff = resetTime.getTime() - now.getTime();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- EXIT INTENT POPUP ---
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasSeenPopup.current) {
        setShowExitPopup(true);
        hasSeenPopup.current = true;
      }
    };

    // Fallback timer: 30 seconds
    const timer = setTimeout(() => {
      if (!hasSeenPopup.current) {
        setShowExitPopup(true);
        hasSeenPopup.current = true;
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setSearchQuery('');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SEARCH LOGIC ---
  const filteredDeals = DEALS_DATA.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMenu = MENU_DATA.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBlog = BLOG_DATA.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearching = searchQuery.trim().length > 0;
  const totalResults = filteredDeals.length + filteredMenu.length + filteredBlog.length;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubscribed(true);
  };

  // --- REUSABLE COMPONENTS ---

  const AIBlueprintBanner = ({ className = "" }: { className?: string }) => (
    <div className={`bg-cfa-dark text-white p-6 md:p-8 rounded-[20px] border-2 border-cfa-gold shadow-2xl relative overflow-hidden group ${className}`}>
      <div className="relative z-10">
        <div className="text-cfa-gold text-[11px] letter-spacing-[2px] font-bold uppercase mb-4">Builder Resource</div>
        <p className="text-sm md:text-base mb-6 italic opacity-90 max-w-lg">
          "Build your own high-converting affiliate site using AI — no coding required. The AI Blueprint shows you exactly how."
        </p>
        <a 
          href={LINKS.AI_BLUEPRINT} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-cfa-gold hover:bg-yellow-500 text-cfa-dark font-bold py-3 px-8 rounded-lg transition-all text-xs uppercase tracking-wider"
        >
          Get the AI Blueprint &rarr;
        </a>
      </div>
    </div>
  );

  const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-5xl font-serif text-cfa-red font-black leading-tight mb-4">{title}</h2>
      {subtitle && <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base font-medium">{subtitle}</p>}
      <div className="w-16 h-1.5 bg-cfa-gold mx-auto mt-8 rounded-full shadow-lg shadow-cfa-gold/30"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cfa-tan font-sans text-cfa-dark">
      {/* --- AFFILIATE DISCLOSURE TOP BANNER --- */}
      <div className="bg-cfa-dark py-1 text-[10px] md:text-xs text-center text-white uppercase tracking-widest border-b border-white/10 sticky top-0 z-[60]">
        Affiliate Disclosure: We may earn a commission from links on this site at no extra cost to you.
      </div>

      {/* --- STICKY NAVIGATION --- */}
      <nav className="sticky top-[22px] md:top-[26px] bg-white shadow-sm z-50 border-b-2 border-cfa-red">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-14 md:h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate('home')}
          >
            <span className="font-serif text-xl md:text-2xl font-black italic tracking-tighter text-cfa-red">
              CFA Fanatics
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {(['home', 'deals', 'menu', 'catering', 'resources'] as const).map((page) => (
              <button 
                key={page}
                onClick={() => navigate(page as Page)}
                className={`text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-cfa-red ${currentPage === page ? 'text-cfa-red' : 'text-cfa-dark'}`}
              >
                {page}
              </button>
            ))}
            <a 
              href={LINKS.GENERAL_ORDER} 
              target="_blank" 
              className="bg-cfa-gold hover:bg-yellow-500 text-cfa-dark px-5 py-2 rounded-full font-bold text-[11px] uppercase transition-all shadow-sm"
            >
              Get Coupons
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 sm:w-48 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cfa-red/30 transition-all font-medium"
              />
            </div>
            <button className="p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Desktop Search Bar (Overlay) */}
        <div className="hidden lg:block max-w-7xl mx-auto px-10 pb-4">
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl px-10 py-1 transition-all focus-within:shadow-md focus-within:bg-white focus-within:border-cfa-red/20">
            <TrendingUp size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Searching for a specific meal, reward, or menu hack? Type here..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none py-2 text-sm text-cfa-dark placeholder:text-slate-400 focus:outline-none font-medium"
            />
            {isSearching && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-cfa-red transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-xl lg:hidden border-b border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-2">
                {(['home', 'deals', 'menu', 'catering', 'giftcards', 'blog', 'about', 'resources'] as Page[]).map((page) => (
                  <button 
                    key={page}
                    onClick={() => navigate(page)}
                    className={`p-3 text-left font-bold capitalize rounded-lg ${currentPage === page ? 'bg-slate-50 text-cfa-red' : 'text-slate-600'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="search-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="py-12 max-w-7xl mx-auto px-4"
            >
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                <div className="text-center md:text-left">
                   <h2 className="text-3xl font-serif text-cfa-red font-black">Search Results</h2>
                   <p className="text-slate-500 font-medium tracking-tight">Found {totalResults} items matching "{searchQuery}"</p>
                </div>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2 rounded-full text-xs font-bold transition-all"
                >
                  Clear & Close Search
                </button>
              </div>

              {totalResults === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <Utensils size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No items found</p>
                  <p className="text-slate-500 text-xs mt-2">Try searching for "Chicken", "Sandwich", or "Catering"</p>
                </div>
              ) : (
                <div className="space-y-16">
                  {filteredDeals.length > 0 && (
                    <section>
                      <h3 className="text-xl font-serif font-black text-cfa-dark mb-6 border-l-4 border-cfa-gold pl-4 italic">Relevant Deals ({filteredDeals.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredDeals.map((deal, i) => (
                           <div key={i} className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm relative group">
                            <div className="h-16 bg-slate-50 rounded-xl flex items-center justify-center text-3xl mb-4">
                              {deal.icon || "🍗"}
                            </div>
                            <h4 className="text-sm font-black text-cfa-dark mb-1">{deal.title}</h4>
                            <div className="flex justify-between items-center mt-2">
                              {deal.tag && <span className="text-[10px] text-cfa-red font-black uppercase tracking-tighter">{deal.tag}</span>}
                              <a href={deal.link || LINKS.GENERAL_ORDER} target="_blank" className="text-[10px] font-bold underline text-slate-400 hover:text-cfa-red">Go to Deal</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredMenu.length > 0 && (
                    <section>
                      <h3 className="text-xl font-serif font-black text-cfa-dark mb-6 border-l-4 border-cfa-red pl-4 italic">Menu Matches ({filteredMenu.length})</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredMenu.map((item, i) => (
                           <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                            <div className="h-32 overflow-hidden">
                              <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-slate-900 text-xs mb-1">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 mb-3">{item.cal} Cal</p>
                              <a href={LINKS.GENERAL_ORDER} target="_blank" className="block text-center bg-cfa-red text-white py-1.5 rounded-lg text-xs font-bold">Order Now</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredBlog.length > 0 && (
                    <section>
                      <h3 className="text-xl font-serif font-black text-cfa-dark mb-6 border-l-4 border-slate-900 pl-4 italic">Blog Tips ({filteredBlog.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredBlog.map((post, i) => (
                          <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                               <img src={post.img} className="w-full h-full object-cover" alt={post.title} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">{post.title}</h4>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </motion.div>
          ) : currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-20"
            >
              {/* Hero Section */}
              <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-12 pb-8">
                <div className="relative bg-white rounded-[24px] border border-slate-200 p-8 md:p-16 flex flex-col md:flex-row shadow-2xl shadow-slate-200/40 overflow-hidden min-h-[500px]">
                  <div className="flex-1 z-10">
                    <div className="inline-block bg-cfa-gold text-cfa-dark px-4 py-2 rounded-full mb-8 shadow-md shadow-cfa-gold/30">
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        DAILY DEAL EXPIRES: <span className="tabular-nums font-mono">{timeLeft}</span>
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-cfa-red font-black leading-[1.1] mb-6">
                      Satisfy Your Cravings & <br />Save Like a <span className="italic">Pro.</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
                      Get exclusive access to Chick-fil-A app rewards, secret menu items, and the best catering deals for your next event.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <a href={LINKS.GENERAL_ORDER} target="_blank" className="w-full sm:w-auto bg-cfa-red hover:bg-red-700 text-white px-10 py-4 rounded-full font-black uppercase text-sm tracking-wider shadow-lg shadow-cfa-red/20 transition-all text-center">
                        View Today's Deals
                      </a>
                      <button onClick={() => navigate('catering')} className="w-full sm:w-auto bg-white border-2 border-cfa-red text-cfa-red px-10 py-4 rounded-full font-black uppercase text-sm tracking-wider hover:bg-red-50 transition-all">
                        Order Catering
                      </button>
                    </div>

                    <div className="mt-16">
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-6">Trusted by fans at</p>
                      <div className="flex flex-wrap gap-8 md:gap-12 opacity-30 grayscale font-black text-xs md:text-sm tracking-tighter">
                        <span>FOOD NETWORK</span>
                        <span>BUZZFEED</span>
                        <span>TODAY SHOW</span>
                        <span>EATER</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block lg:w-1/3 h-full absolute right-0 top-0 bottom-0">
                    <img 
                      src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover"
                      alt="Chick-fil-A Spread"
                    />
                  </div>
                </div>
              </section>

              {/* As Seen On Trust Bar */}
              <section className="bg-slate-100/50 py-12 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                  <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Trusted By Fans Worldwide</p>
                  <div className="flex flex-wrap justify-around items-center gap-10 opacity-40 grayscale contrast-125">
                    <span className="font-serif font-black text-xs md:text-sm">FOOD NETWORK</span>
                    <span className="font-serif font-black text-xs md:text-sm italic underline underline-offset-4">BUZZFEED</span>
                    <span className="font-serif font-black text-xs md:text-sm uppercase tracking-tighter">TODAY SHOW</span>
                    <span className="font-serif font-black text-xs md:text-sm">EATER</span>
                  </div>
                </div>
              </section>

              {/* Featured Deals Section */}
              <section className="py-20 max-w-7xl mx-auto px-4">
                <SectionHeading 
                  title="Flash Deals & App Rewards" 
                  subtitle="Latest limited-time promotions valid at participating Chick-fil-A locations." 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Spicy Deluxe Meal', desc: 'Verified Deal', tag: '$0.00 REWARD', icon: "🍔" },
                    { title: '8-Count Nuggets', desc: 'App Exclusive', tag: 'APP ONLY', icon: "🍗" },
                    { title: 'Waffle Potato Fries', desc: 'Daily Catch', tag: 'LIMITED', icon: "🍟" },
                  ].map((deal, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -8 }}
                      className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm relative group"
                    >
                      <div className="h-20 bg-slate-50 rounded-xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                        {deal.icon}
                      </div>
                      <div className="deal-info">
                        <h4 className="text-sm font-black text-cfa-dark mb-1">{deal.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                           <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={10} fill={BRAND_COLORS.GOLD} className="text-cfa-gold" />)}
                          </div>
                          <span className="text-[11px] text-cfa-red font-black uppercase tracking-tighter">{deal.tag}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-16">
                  <AIBlueprintBanner />
                </div>
              </section>

              {/* Menu Favorites Section */}
              <section className="bg-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4">
                  <SectionHeading 
                    title="Guest Favorites" 
                    subtitle="Our community's most-loved orders and secret menu recommendations." 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Original Chicken Sandwich', cal: '440', img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=400' },
                      { name: 'Spicy Deluxe Sandwich', cal: '550', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400' },
                      { name: 'Waffle Potato Fries', cal: '420', img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=400' },
                      { name: 'Chik-fil-A Nuggets (12ct)', cal: '380', img: 'https://images.unsplash.com/photo-1562967914-608f82629b3a?auto=format&fit=crop&q=80&w=400' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md group">
                        <div className="h-48 overflow-hidden relative">
                          <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-700">{item.cal} Cal</div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-1 mb-2">
                            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= 4 ? BRAND_COLORS.GOLD : 'none'} className={s <= 4 ? "text-cfa-gold" : "text-slate-300"} />)}
                            <span className="text-xs text-slate-400 ml-1">(4.9)</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-4">{item.name}</h4>
                          <a href={LINKS.GENERAL_ORDER} target="_blank" className="block text-center bg-slate-50 hover:bg-cfa-red hover:text-white border border-slate-200 py-2 rounded-lg text-sm font-bold transition-colors">
                            Order for Pickup
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQ Section for Home */}
              <section className="py-20 max-w-4xl mx-auto px-4">
                <SectionHeading title="Frequently Asked Questions" />
                <div className="space-y-6">
                  {[
                    { q: "How can I get free Chick-fil-A today?", a: "The most reliable way is through the Chick-fil-A One app. They frequently drop free reward items just for having the app installed and being a member." },
                    { q: "Does the Chick-fil-A secret menu really exist?", a: "While not official, many items like the Buffalo Chicken Mac & Cheese can be made by combining standard menu items. Check our Secret Menu blog post for more!" },
                    { q: "Can I earn points on catering orders?", a: "Yes! As long as you order through your Chick-fil-A One account, catering orders can earn significant points towards free meals." },
                    { q: "How do I redeem coupons?", a: "Physical coupons can be scanned in-store or entered into the app. App-based rewards are activated directly within the 'Rewards' tab." },
                    { q: "Does Chick-fil-A deliver?", a: "Yes, delivery is available through the official app and major third-party services. App delivery often yields more reward points." }
                  ].map((faq, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                      <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {currentPage === 'deals' && (
            <motion.div 
              key="deals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-20 max-w-7xl mx-auto px-4"
            >
              <SectionHeading title="Current Promotions" subtitle="Save on your next meal with these verified deals." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: '$5 Off Your First Delivery', exp: 'Expires in 48h', link: LINKS.APP_DOWNLOAD, type: 'App Exclusive' },
                  { title: 'Free Large Fry with Any Sandwich', exp: 'Ends soon', link: LINKS.APP_DOWNLOAD, type: 'Reward' },
                  { title: '20% Off Family Meal Deals', exp: 'Limited Supply', link: LINKS.GENERAL_ORDER, type: 'Combo' },
                  { title: 'Free Iced Coffee Monday', exp: 'Monthly', link: LINKS.APP_DOWNLOAD, type: 'Event' },
                ].map((deal, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center gap-8 group">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingBag size={40} className="text-cfa-red" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="bg-cfa-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block tracking-widest">{deal.type}</span>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{deal.title}</h3>
                      <p className="text-slate-400 text-sm mb-6">{deal.exp}</p>
                      <a href={deal.link} target="_blank" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-cfa-red transition-colors">Get Voucher</a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'catering' && (
            <motion.div 
              key="catering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20"
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="bg-cfa-red rounded-[3rem] overflow-hidden text-white flex flex-col lg:flex-row items-center shadow-3xl">
                  <div className="lg:w-1/2 p-12 md:p-20">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Feed the Whole <br /><span className="text-cfa-gold">Team</span>.</h2>
                    <p className="text-lg text-white/80 mb-10">Whether it's a corporate board meeting, a family reunion, or the big game, our catering service brings the flavor everyone loves.</p>
                    <ul className="space-y-4 mb-10">
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-cfa-gold" /> Boxed Meals for Easy Distribution</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-cfa-gold" /> Group Spreads & Side Trays</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="text-cfa-gold" /> Gallons of Signature Tea & Lemonade</li>
                    </ul>
                    <a href={LINKS.CATERING_ORDER} target="_blank" className="bg-white text-cfa-red px-12 py-5 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl inline-block">Order Catering Now</a>
                  </div>
                  <div className="lg:w-1/2 h-[400px] lg:h-[700px] w-full">
                    <img src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Catering" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'resources' && (
            <motion.div 
              key="resources"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 max-w-7xl mx-auto px-4"
            >
              <SectionHeading 
                title="Recommended Resources" 
                subtitle="Tools and guides to help you master affiliate marketing and save more." 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 ring-4 ring-cfa-gold/5 flex flex-col">
                  <div className="bg-slate-950 text-white p-6 rounded-xl mb-6 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 bg-cfa-gold/20 w-24 h-24 rounded-full blur-2xl"></div>
                    <TrendingUp className="text-cfa-gold mb-4" />
                    <h3 className="text-xl font-bold mb-2">AI Blueprint</h3>
                    <p className="text-slate-400 text-xs">The #1 choice for building passive income sites.</p>
                  </div>
                  <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                    Build your own high-converting affiliate site using AI — no coding required. The AI Blueprint on Gumroad shows you exactly how to automate content and rank on Google.
                  </p>
                  <a href={LINKS.AI_BLUEPRINT} target="_blank" className="block text-center bg-cfa-gold hover:bg-yellow-500 text-slate-950 font-bold py-3 rounded-lg transition-colors">
                    Get the AI Blueprint →
                  </a>
                </div>
                
                {[
                  { title: 'Affiliate Toolkit', icon: <Smartphone />, desc: 'Recommended software for tracking your clicks and conversions effortlessly.' },
                  { title: 'Reward Expert Guide', icon: <Award />, desc: 'A deep dive into maximizing Chick-fil-A One reward points for maximum free food.' }
                ].map((tool, i) => (
                   <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 flex flex-col">
                    <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center text-slate-600 mb-6">{tool.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 flex-grow">{tool.desc}</p>
                    <button className="text-slate-800 font-bold text-sm border-b-2 border-cfa-red pb-1 w-fit hover:text-cfa-red transition-colors">Learn More</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'blog' && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 max-w-7xl mx-auto px-4"
            >
              <div className="mb-12 p-8 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
                <p className="text-blue-900 italic font-medium">
                  "Before you dig in — if you want to build a site like this yourself, check out the <a href={LINKS.AI_BLUEPRINT} className="text-blue-600 underline font-bold">AI Blueprint</a> on Gumroad for a complete step-by-step roadmap!"
                </p>
              </div>
              <SectionHeading title="Inside Scoop & Tips" subtitle="Latest guides to hacking the menu and maximizing rewards." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'How to Get Free Chick-fil-A Every Month', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600' },
                  { title: '7 Secret Menu Items You Must Try', img: 'https://images.unsplash.com/photo-1598182121887-5d8c3f93241b?auto=format&fit=crop&q=80&w=600' },
                  { title: 'Chick-fil-A Catering: The Wedding Guest Favorite', img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=600' },
                ].map((post, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="h-64 overflow-hidden rounded-2xl mb-6 shadow-md">
                      <img src={post.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cfa-red transition-colors">{post.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">Read more in our community guide →</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'giftcards' && (
            <motion.div 
              key="giftcards"
              initial={{ opacity : 0 }}
              animate={{ opacity: 1 }}
              className="py-20 max-w-7xl mx-auto px-4"
            >
              <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <Gift size={400} className="absolute -top-20 -left-20 text-white" />
                  <Gift size={400} className="absolute -bottom-20 -right-20 text-white" />
                </div>
                <div className="relative z-10">
                  <Gift size={64} className="text-cfa-gold mx-auto mb-8" />
                  <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">The Perfect Gift for <br />Any Occasion</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">Send instant happiness with a Chick-fil-A e-Gift card. Corporate gifts, birthdays, or just because - everyone loves chicken!</p>
                  <p className="text-cfa-red font-bold animate-pulse mb-8 uppercase tracking-widest text-sm">HURRY: NEXT-DAY E-DELIVERY AVAILABLE!</p>
                  <a href={LINKS.GIFT_CARDS} target="_blank" className="bg-cfa-red hover:bg-red-700 text-white px-12 py-5 rounded-full font-bold text-lg shadow-2xl transition-all inline-block">Buy a Gift Card</a>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 max-w-4xl mx-auto px-4"
            >
              <SectionHeading title="About CFA DealsHub" />
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-slate-600 leading-relaxed space-y-6">
                <p>
                  We are a dedicated group of Chick-fil-A enthusiasts and affiliate marketing experts who believe good chicken should come with great rewards. Our mission is to curate the absolute best deals, hacks, and catering tips so you can enjoy your favorites for less.
                </p>
                <p>
                  Since 2024, our community has helped thousands of fans unlock app rewards and optimize their catering events. We are transparent about our affiliate partnerships, which allow us to keep this platform free for everyone.
                </p>
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                    <div>
                      <p className="font-bold text-slate-900">The Editorial Team</p>
                      <p className="text-xs">Reward Optimizers & Food Curators</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-cfa-red hover:text-white transition-colors cursor-pointer"><TrendingUp size={16} /></div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-cfa-red hover:text-white transition-colors cursor-pointer"><Mail size={16} /></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- EMAIL OPT-IN SECTION --- */}
      <section className="bg-white py-20 text-center px-4 border-t border-slate-200">
        <div className="max-w-xl mx-auto">
          {!emailSubscribed ? (
            <div className="bg-cfa-tan p-8 md:p-12 rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-2xl font-serif text-cfa-red font-black mb-4 uppercase tracking-tighter italic">Join 15k+ Fans</h3>
              <p className="text-slate-500 mb-8 font-medium">Never miss a flash deal or secret menu hack. Exclusive rewards delivered weekly.</p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input 
                  type="email" 
                  required 
                  placeholder="Your email address..." 
                  className="w-full px-6 py-3 rounded-lg bg-white border border-slate-200 text-cfa-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cfa-red/10 transition-all font-semibold text-sm"
                />
                <button className="w-full bg-cfa-red text-white font-black uppercase text-xs tracking-widest py-4 rounded-lg shadow-lg shadow-cfa-red/20 hover:bg-red-700 transition-all">Subscribe for Coupons</button>
              </form>
            </div>
          ) : (
            <div className="text-cfa-red">
              <CheckCircle2 size={64} className="mx-auto mb-6 text-cfa-gold" />
              <h3 className="text-3xl font-serif font-black mb-2 italic">You're on the list!</h3>
              <p className="text-slate-500 font-medium tracking-tight">Check your inbox for your first secret menu tip.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 pt-20 pb-20 md:pb-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-cfa-red rounded-full flex items-center justify-center text-white font-bold text-sm">C</div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                DealsHub<span className="text-cfa-red">.</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your premium third-party guide to savings, rewards, and catering at your favorite chicken spot. 
            </p>
            <p className="text-slate-500 text-xs italic">
              Build your own high-converting affiliate site using AI. The <strong>AI Blueprint on Gumroad</strong> shows you how. <a href={LINKS.AI_BLUEPRINT} className="text-white underline" target="_blank">Get started here</a>.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="text-slate-400 space-y-3 text-sm">
              <li><button onClick={() => navigate('deals')} className="hover:text-cfa-red">Current Coupons</button></li>
              <li><button onClick={() => navigate('menu')} className="hover:text-cfa-red">Guest Favorites</button></li>
              <li><button onClick={() => navigate('catering')} className="hover:text-cfa-red">Catering Service</button></li>
              <li><button onClick={() => navigate('giftcards')} className="hover:text-cfa-red">Buy Gift Cards</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Community</h4>
            <ul className="text-slate-400 space-y-3 text-sm">
              <li><button onClick={() => navigate('blog')} className="hover:text-cfa-red">Secret Menu Blog</button></li>
              <li><button onClick={() => navigate('about')} className="hover:text-cfa-red">Our Story</button></li>
              <li><button onClick={() => navigate('resources')} className="hover:text-cfa-red">Affiliate Toolkit</button></li>
              <li><a href="#" className="hover:text-cfa-red">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-4">Official Disclaimer</p>
            <p className="text-slate-500 text-[10px] leading-relaxed">
              CFA DealsHub is an independent affiliate website. We are not officially affiliated with, endorsed by, or sponsored by Chick-fil-A, Inc. All trademarks and logos are the property of their respective owners.
            </p>
            <div className="mt-6 flex gap-4 text-slate-500 text-xs underline decoration-slate-800 underline-offset-4">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Disclosure</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] md:text-xs">
          <p>© 2026 Chick-fil-A DealsHub Affiliate. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-cfa-gold" />
            <span>Secure SSL Encryption</span>
          </div>
        </div>
      </footer>

      {/* --- STICKY MOBILE BANNER --- */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[55] w-[90%]">
        <a 
          href={LINKS.APP_DOWNLOAD} 
          target="_blank" 
          className="bg-cfa-red text-white py-3 px-8 rounded-full shadow-[0_10px_30px_rgba(228,0,43,0.3)] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest"
        >
          <span>📲</span> Get the App – Earn Free Food! <span>&rarr;</span>
        </a>
      </div>

      {/* --- EXIT INTENT POPUP --- */}
      <AnimatePresence>
        {showExitPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowExitPopup(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-[101] bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowExitPopup(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={40} className="text-cfa-red" />
                </div>
                <h3 className="text-3xl font-serif text-slate-900 mb-2">Wait! Don't Miss Out</h3>
                <p className="text-slate-500 mb-8">Get our "Secret 2026 Coupon Code" cheat sheet absolutely free when you join our inner circle today.</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input type="email" required placeholder="Enter your email" className="w-full px-6 py-4 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cfa-red/20 font-semibold" />
                  <button className="w-full bg-cfa-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-[0.98]">Reveal My Secret Code</button>
                </form>
                
                <div className="mt-10 pt-8 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-4 italic">Build your OWN affiliate site with the AI Blueprint on Gumroad</p>
                  <a href={LINKS.AI_BLUEPRINT} target="_blank" className="inline-flex items-center gap-2 text-slate-800 font-bold hover:text-cfa-red transition-colors">
                    Learn more about AI Blueprint <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
