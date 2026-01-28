import React, { useState, useEffect } from 'react';
import { 
  Phone, Heart, Shield, Flame, Zap, Droplets, 
  MapPin, Menu, X, Bell, Bus, GraduationCap, 
  Settings, Home, LogOut, Navigation, Clock, 
  Activity, Briefcase, Coffee, Pill, Car, Camera, 
  Waves, Trash2, Landmark, Building2, Umbrella,
  HardHat, BookOpen, Radio, Mic2, ShoppingBag, Truck,
  ChevronRight, Globe, Moon, Sun, Download, Star, CloudSun, AlertCircle, PlayCircle, HelpCircle, Volume2, Lock, Languages
} from 'lucide-react';

// Icon Mapping Helper
const iconMap = {
  hospital: Heart, shield: Shield, fire: Flame, ambulance: Activity,
  blood: Droplets, electricity: Zap, bus: Bus, education: GraduationCap,
  bank: Landmark, restaurant: Coffee, pharmacy: Pill, car: Car,
  parlor: Waves, camera: Camera, building: Building2, truck: Truck,
  job: Briefcase, shopping: ShoppingBag, trash: Trash2, engineer: HardHat,
  insurance: Umbrella, radio: Radio, mic: Mic2, book: BookOpen
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // 1. Fetch Data & PWA Install Listener
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
        setTimeout(() => setLoading(false), 1500);
      })
      .catch(err => console.error("Data Load Error:", err));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("ব্রাউজার অপশন থেকে 'Add to Home Screen' সিলেক্ট করুন।");
    }
  };

  const handleCall = (num) => window.location.href = `tel:${num}`;

  // Loading Screen
  if (loading || !data) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
      <h1 className="text-2xl font-black uppercase tracking-widest animate-pulse">Smart Feni</h1>
      <p className="text-xs opacity-70 mt-2">Connecting Database...</p>
    </div>
  );

  const mainBgClass = darkMode ? "bg-slate-900 text-white" : "bg-[#efe7de] text-slate-900";

  return (
    <div className={`min-h-screen ${mainBgClass} font-sans pb-32 transition-colors duration-500`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-red-900' : 'bg-[#cc0000]'} text-white px-5 py-4 flex justify-between items-center shadow-lg`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDrawerOpen(true)}><Menu size={24} /></button>
          <h1 className="text-lg font-black uppercase tracking-tight">{data.appInfo.name}</h1>
        </div>
        <div className="flex gap-3">
          {deferredPrompt && (
            <button onClick={installApp} className="animate-pulse text-yellow-300"><Download size={20}/></button>
          )}
          <Bell size={20} />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-5 max-w-2xl mx-auto space-y-6">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Weather & Welcome */}
            <section className="flex gap-4">
              <div className="flex-1 bg-gradient-to-br from-red-600 to-red-800 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <h2 className="text-xl font-black relative z-10">শুভ সকাল!</h2>
                <p className="text-xs opacity-80 relative z-10">আজকের দিনটি ভালো কাটুক</p>
                <CloudSun size={60} className="absolute -right-2 -top-2 opacity-20"/>
              </div>
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-3xl shadow-lg flex flex-col items-center justify-center min-w-[100px]`}>
                 <span className="text-2xl font-black">28°C</span>
                 <span className="text-[10px] uppercase opacity-50">{data.appInfo.weatherCity}</span>
              </div>
            </section>

            {/* Emergency */}
            <button onClick={() => handleCall(data.appInfo.emergencyPhone)} className="w-full bg-red-50 border border-red-100 p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-transform">
               <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Phone size={24}/></div>
               <div>
                  <h4 className="font-black text-red-600 text-lg">{data.appInfo.emergencyPhone}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">জরুরি সেবা</p>
               </div>
            </button>

            {/* Dynamic Services Grid */}
            <div className={`${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-white'} p-6 rounded-[2.5rem] shadow-xl border`}>
              <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-red-600 rounded-full"></span> সেবা সমূহ
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {data.services?.map((s) => {
                  const IconComp = iconMap[s.type] || HelpCircle; // Fallback icon
                  return (
                    <button key={s.id} onClick={() => setSelectedService(s)} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
                      <div className={`w-14 h-14 ${darkMode ? 'bg-slate-700' : s.bg} ${s.color} rounded-2xl flex items-center justify-center shadow-md`}>
                        <IconComp size={20}/>
                      </div>
                      <span className="text-[10px] font-bold opacity-70">{s.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* News Feed */}
            <div className="space-y-4">
               <h3 className="text-lg font-black px-2">আপডেট নিউজ</h3>
               {data.news?.map((n, i) => (
                 <div key={i} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-4 rounded-3xl shadow-sm flex gap-4 items-center`}>
                    <img src={n.image} className="w-20 h-20 bg-slate-200 rounded-2xl object-cover" alt="news"/>
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-2">{n.title}</h4>
                      <span className="text-[10px] font-bold opacity-40">{n.time} • {n.source}</span>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        )}

        {activeTab === 'blood' && (
           <div className="space-y-4">
             <div className="bg-red-600 p-6 rounded-3xl text-white shadow-xl">
               <h2 className="text-xl font-black">রক্তদান কেন্দ্র</h2>
               <p className="text-xs opacity-80">ফেনীর সকল ব্লাড ডোনার ক্লাব</p>
             </div>
             {data.bloodClubs?.map((club, i) => (
               <div key={i} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center`}>
                  <div className="font-bold">{club} ব্লাড ক্লাব</div>
                  <button onClick={() => handleCall('01800000000')} className="p-3 bg-green-100 text-green-700 rounded-xl"><Phone size={18}/></button>
               </div>
             ))}
           </div>
        )}
        
        {/* Placeholder for Map */}
        {activeTab === 'map' && (
          <div className="h-[70vh] bg-white p-2 rounded-3xl shadow-xl">
             <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14710.0!2d91.39!3d23.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1" width="100%" height="100%" className="rounded-2xl border-0" loading="lazy"></iframe>
          </div>
        )}

      </main>

      {/* Bottom Nav */}
      <nav className={`fixed bottom-6 inset-x-6 h-20 ${darkMode ? 'bg-slate-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-around px-2 z-50`}>
         {[ 
           { id: 'home', icon: <Home size={20}/>, label: 'Home' }, 
           { id: 'blood', icon: <Droplets size={20}/>, label: 'Blood' },
           { id: 'map', icon: <Navigation size={20}/>, label: 'Map' } 
         ].map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-slate-400'}`}>
             {tab.icon}
           </button>
         ))}
      </nav>

      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}/>
          <div className={`relative w-full max-w-lg ${darkMode ? 'bg-slate-900' : 'bg-[#efe7de]'} rounded-t-[3rem] p-6 h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300`}>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-black">{selectedService.label}</h2>
               <button onClick={() => setSelectedService(null)} className="p-2 bg-black/5 rounded-full"><X size={20}/></button>
             </div>
             <div className="space-y-3">
               {selectedService.data.map((item, i) => (
                 <div key={i} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-5 rounded-3xl shadow-sm flex items-center justify-between`}>
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-xs opacity-50">{item.loc}</p>
                    </div>
                    <button onClick={() => handleCall(item.phone)} className="p-3 bg-green-500 text-white rounded-xl shadow-lg"><Phone size={18}/></button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Sidebar Drawer */}
      {isDrawerOpen && (
         <div className="fixed inset-0 z-[100] flex">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}/>
           <div className={`relative w-3/4 max-w-xs ${darkMode ? 'bg-slate-900' : 'bg-white'} h-full p-6 animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col`}>
              <h2 className="text-2xl font-black text-red-600 mb-8">Smart Feni</h2>
              <div className="space-y-2 flex-1">
                 <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-4 p-4 font-bold w-full hover:bg-slate-50 rounded-2xl">
                    {darkMode ? <Sun size={20}/> : <Moon size={20}/>} ডার্ক মোড
                 </button>
              </div>
              <p className="text-center text-[10px] opacity-30 font-black tracking-[0.3em]">APP VERSION 1.0.0</p>
           </div>
         </div>
      )}

    </div>
  );
};

export default App;
