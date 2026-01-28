import React, { useState, useEffect } from 'react';
import { 
  Phone, Heart, Shield, Flame, Zap, Droplets, 
  MapPin, Menu, X, Bell, Bus, GraduationCap, 
  Settings, Newspaper, Home, LogOut, Navigation, 
  Activity, Coffee, Pill, Car, Camera, Waves, 
  Trash2, Landmark, Building2, Umbrella, HardHat, 
  BookOpen, Radio, Mic2, ShoppingBag, Truck, 
  ChevronRight, Globe, Moon, Sun, Languages, 
  Lock, HelpCircle, Star, CloudSun, AlertCircle, 
  PlayCircle, Map as MapIcon, Download
} from 'lucide-react';

// Icon mapping helper to convert string name from JSON to Component
const iconMap = {
  Heart, Shield, Flame, Activity, Droplets, Zap, Bus, GraduationCap,
  Scale: Building2, Landmark, Coffee, Pill, Car, Waves, Camera,
  Newspaper, Building2, Truck, Briefcase: ShoppingBag, Navigation,
  ShoppingBag, Trash2, HardHat, Umbrella, Radio, Mic2, BookOpen
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // External Data Source
  const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";

  useEffect(() => {
    // 1. Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    // 2. Fetch Data from GitHub
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Data fetch error:", error);
        // Fallback or Alert could go here
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchData();
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("ব্রাউজার মেনু (⋮) থেকে 'Install App' বা 'Add to Home Screen' সিলেক্ট করুন।");
    }
  };

  const handleCall = (num) => window.location.href = `tel:${num}`;

  if (loading || !data) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="w-24 h-24 border-8 border-white/20 rounded-full animate-spin border-t-white mb-8"></div>
      <h1 className="text-white font-black text-2xl tracking-[0.3em] uppercase animate-bounce">Smart Feni</h1>
      <p className="text-white/60 text-xs mt-2">Connecting to Server...</p>
    </div>
  );

  const mainBgClass = darkMode ? "bg-slate-900 text-white" : "bg-[#efe7de] text-slate-900";

  return (
    <div className={`min-h-screen ${mainBgClass} font-['Hind_Siliguri',sans-serif] relative pb-32 transition-colors duration-500 overflow-x-hidden`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');`}</style>
      
      {/* Header */}
      <header className={`sticky top-0 z-[100] ${darkMode ? 'bg-red-900' : 'bg-[#cc0000]'} text-white px-6 py-5 flex justify-between items-center shadow-lg`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 bg-white/10 rounded-xl"><Menu size={24} /></button>
          <div>
            <h1 className="text-xl font-black uppercase">Smart Feni</h1>
            <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={installApp} className="p-2.5 bg-white/10 rounded-xl text-yellow-300 animate-pulse"><Download size={20} /></button>
          <button onClick={() => setNotifications(!notifications)} className="p-2.5 bg-white/10 rounded-xl relative">
            <Bell size={20} />
            {notifications && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full"></span>}
          </button>
        </div>
      </header>

      <main className="relative z-10 p-5 max-w-2xl mx-auto space-y-8">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8">
            
            {/* Banner Section */}
            <div className="relative h-56 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
              <img src={data.banner_image || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full self-start mb-2 uppercase">Update</span>
                <h2 className="text-white text-2xl font-black">{data.welcome_msg || "ডিজিটাল ফেনী অ্যাপে স্বাগতম"}</h2>
              </div>
            </div>

            {/* Emergency & Map Buttons */}
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => handleCall("999")} className="bg-red-50 p-5 rounded-[2rem] flex items-center gap-4 active:scale-95 transition-transform border border-red-100">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><AlertCircle size={24}/></div>
                  <div className="text-left">
                    <h4 className="font-black text-red-600 text-xl">999</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Emergency</p>
                  </div>
               </button>
               <button onClick={() => setActiveTab('map')} className="bg-blue-50 p-5 rounded-[2rem] flex items-center gap-4 active:scale-95 transition-transform border border-blue-100">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><MapIcon size={24}/></div>
                  <div className="text-left">
                    <h4 className="font-black text-blue-600 text-xl">Map</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                  </div>
               </button>
            </div>

            {/* Services Grid (Dynamic from JSON) */}
            <div className={`${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-white'} p-6 rounded-[3rem] shadow-xl border`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase flex items-center gap-2">
                   <span className="w-2 h-6 bg-red-600 rounded-full"></span> Services
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-4">
                {data.services?.map((s) => {
                  const IconComp = iconMap[s.icon] || Home;
                  return (
                    <button key={s.id} onClick={() => setSelectedService(s)} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                      <div className={`w-14 h-14 ${darkMode ? 'bg-slate-700' : s.bg || 'bg-gray-100'} ${s.color || 'text-gray-700'} rounded-2xl flex items-center justify-center shadow-md`}>
                        <IconComp size={20}/>
                      </div>
                      <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-600'} text-center`}>{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        )}

        {/* BLOOD TAB */}
        {activeTab === 'blood' && (
           <div className="space-y-4 animate-in slide-in-from-right">
              {data.blood_banks?.map((bank, i) => (
                <div key={i} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-[2rem] shadow-lg flex justify-between items-center`}>
                   <div>
                     <h3 className="font-bold text-lg">{bank.area} ব্লাড ব্যাংক</h3>
                     <p className="text-xs opacity-60 mt-1">{bank.name}</p>
                   </div>
                   <button onClick={() => handleCall(bank.phone)} className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse"><Phone/></button>
                </div>
              ))}
           </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in slide-in-from-right">
             <h2 className="text-2xl font-black">Latest News</h2>
             {data.news?.map((item, i) => (
               <div key={i} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-[2rem] overflow-hidden shadow-lg`}>
                  <img src={item.image} className="h-48 w-full object-cover"/>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-xs opacity-60 mt-2">{item.date}</p>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
           <div className="h-[70vh] bg-white rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
              <iframe src={data.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689659021!2d91.35!3d23.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753686884394017%3A0x6295964f40f07141!2sFeni!5e0!3m2!1sen!2sbd!4v1642221654285!5m2!1sen!2sbd"} width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
           </div>
        )}

      </main>

      {/* Bottom Nav */}
      <nav className={`fixed bottom-6 inset-x-6 h-20 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-md rounded-[2rem] shadow-2xl flex items-center justify-around px-2 z-50 border border-white/10`}>
         {[
           { id: 'home', icon: <Home size={20}/>, label: 'Home' },
           { id: 'blood', icon: <Droplets size={20}/>, label: 'Blood' },
           { id: 'map', icon: <Navigation size={20}/>, label: 'Map' },
           { id: 'news', icon: <Newspaper size={20}/>, label: 'News' }
         ].map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-red-600 text-white -translate-y-4 shadow-lg shadow-red-500/30' : 'text-slate-400'}`}>
              {tab.icon}
           </button>
         ))}
      </nav>

      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
           <div className={`relative ${darkMode ? 'bg-slate-900' : 'bg-[#efe7de]'} w-full max-w-lg h-[70vh] rounded-t-[3rem] p-6 animate-in slide-in-from-bottom duration-300`}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black">{selectedService.label}</h2>
                 <button onClick={() => setSelectedService(null)} className="p-2 bg-slate-200 rounded-full text-black"><X size={20}/></button>
              </div>
              <div className="space-y-3 overflow-y-auto h-[55vh] pb-10">
                 {selectedService.data?.map((item, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                       <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.loc}</p>
                       </div>
                       <button onClick={() => handleCall(item.phone)} className="bg-green-500 text-white p-3 rounded-xl shadow-lg"><Phone size={18}/></button>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Settings Drawer (Simplied for length) */}
      {showSettings && (
         <div className="fixed inset-0 z-[200] bg-white p-6 animate-in slide-in-from-bottom">
            <button onClick={() => setShowSettings(false)}>Close</button>
            <h1 className="text-2xl font-bold mt-4">Settings</h1>
            {/* Add settings controls here */}
         </div>
      )}

    </div>
  );
};

export default App;
