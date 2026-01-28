import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react'; // Import all icons dynamically
import { CloudSun, Phone, Info, ChevronRight, Star, Menu, Download, Bell, X, LogOut, Settings, Sun, Moon, Languages, Lock, Volume2, Zap, PlayCircle, HelpCircle } from 'lucide-react';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState(null); // External Data State
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Load Data from JSON
  useEffect(() => {
    fetch('./data.json')
      .then(res => res.json())
      .then(data => {
        setAppData(data);
        setTimeout(() => setLoading(false), 2000); // Fake load time for branding
      })
      .catch(err => {
        console.error("Data Load Error:", err);
        setLoading(false);
      });

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Helper to render icon dynamically from string name
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.HelpCircle;
    return <IconComponent size={size} />;
  };

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert("ব্রাউজার মেনু থেকে 'Install App' বা 'Add to Home Screen' সিলেক্ট করুন।");
    }
  };

  const handleCall = (num) => {
    window.location.href = `tel:${num}`;
  };

  const mainBgClass = darkMode ? "bg-slate-900 text-white" : "bg-[#efe7de] text-slate-900";

  // Loading Screen
  if (loading || !appData) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-white/20 rounded-full animate-spin border-t-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <LucideIcons.Heart className="text-white animate-pulse" size={32} fill="white"/>
        </div>
      </div>
      <h1 className="mt-8 text-white font-black text-2xl tracking-[0.3em] uppercase animate-bounce">Smart Feni</h1>
    </div>
  );

  return (
    <div className={`min-h-screen ${mainBgClass} font-sans relative pb-32 transition-colors duration-500 overflow-x-hidden`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: '400px' }}></div>

      {/* Header */}
      <header className={`sticky top-0 z-[100] ${darkMode ? 'bg-red-900' : 'bg-[#cc0000]'} text-white px-6 py-5 flex justify-between items-center shadow-lg`}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 bg-white/10 rounded-2xl active:scale-90"><Menu size={24} /></button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">Smart Feni</h1>
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-[9px]">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={installApp} className="p-2 bg-white/10 rounded-xl text-yellow-300 animate-pulse"><Download size={20} /></button>
          <button onClick={() => setNotifications(!notifications)} className="p-2 bg-white/10 rounded-xl relative">
            <Bell size={20} />
            {notifications && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full"></span>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-5 max-w-2xl mx-auto space-y-8">
        
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8 pb-10">
            
            {/* Weather Widget */}
            <section className="flex flex-col sm:flex-row gap-4">
               <div className="flex-1 bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-[2.5rem] text-white shadow-xl flex items-center justify-between overflow-hidden relative">
                  <div className="relative z-10">
                     <p className="text-xs font-bold opacity-80 mb-1">স্বাগতম,</p>
                     <h2 className="text-2xl font-black">শুভ দিন!</h2>
                  </div>
                  <CloudSun size={80} className="absolute -right-4 -top-2 opacity-20" />
               </div>
               <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center justify-center min-w-[120px]`}>
                  <CloudSun className="text-orange-500 mb-1" size={32}/>
                  <span className="text-2xl font-black">{appData.appConfig.weatherTemp}</span>
                  <span className="text-[10px] font-bold uppercase opacity-50">{appData.appConfig.weatherCity}</span>
               </div>
            </section>

            {/* Emergency Actions */}
            <section className="grid grid-cols-2 gap-4">
               <button onClick={() => handleCall("999")} className="bg-red-50 border border-red-100 p-5 rounded-[2.2rem] flex items-center gap-4 active:scale-95 transition-all shadow-sm">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><LucideIcons.AlertCircle size={24}/></div>
                  <div>
                     <h4 className="font-black text-red-600 text-lg">৯৯৯</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">ইমার্জেন্সি</p>
                  </div>
               </button>
               <button onClick={() => setActiveTab('map')} className="bg-blue-50 border border-blue-100 p-5 rounded-[2.2rem] flex items-center gap-4 active:scale-95 transition-all shadow-sm">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><LucideIcons.Map size={24}/></div>
                  <div>
                     <h4 className="font-black text-blue-600 text-lg">ম্যাপ</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">লোকেশন</p>
                  </div>
               </button>
            </section>

            {/* Services Grid (Dynamic from JSON) */}
            <div className={`${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/90 border-white'} backdrop-blur-xl p-8 rounded-[3.5rem] shadow-2xl border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2.5 h-7 bg-red-600 rounded-full"></div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">সেবাসমূহ ({appData.services?.length || 0})</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                {appData.services?.map((s) => (
                  <button key={s.id} onClick={() => setSelectedService(s)} className="flex flex-col items-center gap-3 group active:scale-90">
                    <div className={`w-16 h-16 ${darkMode ? 'bg-slate-700 border-slate-600' : s.bg + ' border-white'} ${s.color} rounded-2xl flex items-center justify-center shadow-lg border-2 group-hover:-translate-y-1 transition-transform`}>
                      {renderIcon(s.iconName)}
                    </div>
                    <span className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} text-center leading-tight`}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tourist Spots */}
            <section className="space-y-4">
               <h3 className="text-xl font-black text-slate-800 px-2 flex items-center gap-2"><div className="w-2 h-6 bg-red-600 rounded-full"></div> দর্শনীয় স্থান</h3>
               <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
                  {appData.spots?.map((place, i) => (
                    <div key={i} className="min-w-[220px] bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100">
                       <div className="h-32 bg-slate-200"><img src={place.img} className="w-full h-full object-cover" loading="lazy" /></div>
                       <div className="p-4">
                          <span className="text-[10px] font-black text-red-600 uppercase mb-1 block">{place.type}</span>
                          <h4 className="font-bold text-slate-800">{place.name}</h4>
                          <button onClick={()=>setActiveTab('map')} className="mt-3 w-full py-2 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-xl border border-slate-100">ম্যাপে দেখুন</button>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

             {/* Ticker */}
            <section className="bg-red-950 p-6 rounded-[2.5rem] shadow-xl text-white overflow-hidden relative">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"><Phone size={24}/></div>
                  <div>
                     <h4 className="font-black text-lg">জরুরি হেল্পলাইন</h4>
                     <p className="text-sm opacity-80">{appData.appConfig.tickerText}</p>
                  </div>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-10"><Info size={100}/></div>
            </section>
          </div>
        )}

        {/* Dynamic Map Tab */}
        {activeTab === 'map' && (
          <div className="animate-in slide-in-from-right h-[75vh] flex flex-col">
             <div className="bg-white p-3 rounded-[3rem] shadow-2xl border-4 border-white flex-1 overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58888.3820689456!2d91.35921808604368!3d23.015911475510684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375368686e58b16b%3A0x6d8c60e3189a8002!2sFeni!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
                  className="w-full h-full border-0 rounded-[2.5rem]" 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
             </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="animate-in slide-in-from-right space-y-6">
             <h2 className="text-2xl font-black px-2">ফেনী আপডেট</h2>
             {appData.news?.map((item) => (
                <div key={item.id} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-[2.5rem] overflow-hidden shadow-xl`}>
                   <div className="h-52 bg-slate-200 relative">
                      <img src={item.img} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">News</div>
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-lg leading-tight mb-4">{item.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-black opacity-40 uppercase">
                         <span>{item.time}</span> • <span>{item.source}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}

      </main>

      {/* Navigation */}
      <nav className={`fixed bottom-6 inset-x-6 h-22 ${darkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-white'} backdrop-blur-2xl rounded-[2.5rem] border flex items-center justify-around z-[150] shadow-2xl px-4`}>
        {[
          { id: 'home', icon: LucideIcons.Home, label: 'হোম' },
          { id: 'blood', icon: LucideIcons.Droplets, label: 'ব্লাড' },
          { id: 'map', icon: LucideIcons.Navigation, label: 'ম্যাপ' },
          { id: 'news', icon: LucideIcons.Newspaper, label: 'নিউজ' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => {setActiveTab(tab.id); setShowSettings(false)}} className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-full h-full rounded-3xl ${activeTab === tab.id ? 'text-red-600 scale-110' : 'text-slate-400 opacity-60'}`}>
            <div className={`p-2.5 rounded-2xl ${activeTab === tab.id ? 'bg-red-600 text-white shadow-xl shadow-red-200' : ''}`}>
              <tab.icon size={22}/>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
          <div className={`relative ${darkMode ? 'bg-slate-900' : 'bg-[#efe7de]'} w-full max-w-lg h-[80vh] rounded-t-[3.5rem] flex flex-col animate-in slide-in-from-bottom duration-500 shadow-2xl overflow-hidden`}>
             <div className="bg-red-600 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">{renderIcon(selectedService.iconName)}</div>
                   <div>
                      <h2 className="text-xl font-black">{selectedService.label}</h2>
                      <span className="text-[10px] opacity-70 font-black uppercase tracking-widest mt-1 block">Feni Database</span>
                   </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="p-3.5 bg-white/10 rounded-full active:scale-90"><X/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {selectedService.data.map((item, i) => (
                   <div key={i} className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-5 rounded-[2.2rem] shadow-sm border flex items-center gap-5`}>
                      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner">{item.name.charAt(0)}</div>
                      <div className="flex-1">
                         <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{item.name}</h4>
                         <p className="text-[10px] opacity-50 font-black flex items-center gap-1 mt-1 uppercase"><LucideIcons.MapPin size={10}/> {item.loc}</p>
                      </div>
                      <button onClick={() => handleCall(item.phone)} className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-75 transition-all"><LucideIcons.Phone size={20} /></button>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
