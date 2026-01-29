import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { 
  Menu, Bell, X, Phone, CloudSun, AlertCircle, 
  Map as MapIcon, Home, Droplets, HeartPulse, 
  Clock, Search, WifiOff, AlertTriangle
} from 'lucide-react';

// content_data.json
const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";
const CACHE_KEY = "smart_feni_data_v1";

const App = () => {
  const [data, setData] = useState({ 
    config: { app_name: "Smart Feni", welcome_title: "Loading..." }, 
    services: [], blood_bank: [], emergency: [] 
  });
  
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
    return () => {
      window.removeEventListener('online', () => setIsOffline(false));
      window.removeEventListener('offline', () => setIsOffline(true));
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${DATA_URL}?t=${Date.now()}`);
      if (response.data) {
        setData(response.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
        if (response.data.notice?.active) setShowNotice(true);
      }
      setLoading(false);
      setIsOffline(false);
    } catch (err) {
      console.error("Network Error:", err);
      setIsOffline(true);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        if (parsedData.notice?.active) setShowNotice(true);
      }
      setLoading(false);
    }
  };

  const Icon = ({ name, size = 20, className }) => {
    const LucideIcon = LucideIcons[name] || LucideIcons.CircleDot; 
    return <LucideIcon size={size} className={className} />;
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
      <h1 className="text-white font-black text-2xl tracking-[0.3em] animate-pulse">SMART FENI</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-24 relative selection:bg-red-200">
      
      {isOffline && (
        <div className="bg-slate-900 text-white text-[10px] font-bold text-center py-2 flex items-center justify-center gap-2 sticky top-0 z-[60] animate-in slide-in-from-top">
          <WifiOff size={12} className="text-red-500"/>
          <span>ইন্টারনেট সংযোগ নেই। অফলাইন মোড চালু হয়েছে।</span>
        </div>
      )}

      {showNotice && data.notice && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNotice(false)}></div>
           <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative shadow-2xl animate-in zoom-in-95 duration-300 border-t-4 border-red-600">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-black text-center text-slate-900 mb-2">{data.notice.title}</h2>
              <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">{data.notice.message}</p>
              <button onClick={() => setShowNotice(false)} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl active:scale-95 transition">ঠিক আছে</button>
           </div>
        </div>
      )}

      <header className="sticky top-0 z-[50] bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-xl shadow-red-900/10 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 bg-white/20 backdrop-blur-md rounded-xl active:scale-95 transition">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">{data.config?.app_name}</h1>
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-md">
              {data.config?.app_version}
            </span>
          </div>
        </div>
        <div className="relative p-2 bg-white/20 rounded-xl">
          <Bell size={22} />
          {data.notice?.active && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full animate-ping"></span>}
        </div>
      </header>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[300px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 rounded-r-[2.5rem]">
            <div className="bg-[#cc0000] p-8 text-white rounded-br-[3rem]">
               <h2 className="text-2xl font-black">{data.config?.app_name}</h2>
               <p className="text-xs opacity-80 mt-1">Smart City Guide</p>
            </div>
            <nav className="p-6 space-y-3 flex-1 overflow-y-auto">
              {[
                {id: 'home', label: 'হোম', icon: 'Home'},
                {id: 'blood', label: 'ব্লাড ব্যাংক', icon: 'Droplets'},
                {id: 'map', label: 'ম্যাপ', icon: 'Map'},
              ].map((item) => (
                <button key={item.id} onClick={() => {setActiveTab(item.id); setIsDrawerOpen(false)}} className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon name={item.icon} size={20}/> {item.label}
                </button>
              ))}
              <div className="my-4 border-t border-slate-100"></div>
              <button onClick={() => window.open('tel:999')} className="w-full flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100">
                <Phone size={20}/> ইমার্জেন্সি ৯৯৯
              </button>
            </nav>
            <div className="p-6 bg-slate-50 mt-auto text-center border-t border-slate-100">
               <p className="text-xs font-black text-slate-800">Dev: {data.config?.developer_name}</p>
               <p className="text-[10px] text-slate-500 mt-1">Assist: <span className="text-[#cc0000]">{data.config?.assistant_name}</span></p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'home' && (
        <main className="p-5 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-gradient-to-br from-[#cc0000] to-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-2xl font-black">{data.config?.welcome_title}</h2>
               <p className="opacity-90 text-sm mt-2">{data.config?.welcome_subtitle}</p>
             </div>
             <CloudSun className="absolute -right-5 -top-5 opacity-20 rotate-12" size={120} />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
             {data.emergency?.map((em, i) => (
                <button key={i} onClick={() => window.open(`tel:${em.phone}`)} className="min-w-[140px] flex-1 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 active:scale-95 transition-all">
                   <div className={`w-12 h-12 ${em.bg} rounded-full flex items-center justify-center ${em.color}`}>
                      <Icon name={em.icon} size={24}/>
                   </div>
                   <h3 className={`font-black ${em.color} text-xl`}>{em.label}</h3>
                </button>
             ))}
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-lg border border-white">
            <h3 className="text-lg font-black text-slate-800 mb-6 border-l-4 border-[#cc0000] pl-3">সকল সেবা</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-4">
              {data.services?.map((service, index) => (
                <button key={index} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
                  <div className={`w-16 h-16 ${service.bg || 'bg-slate-50'} ${service.color || 'text-slate-600'} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                    <Icon name={service.icon} size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 text-center line-clamp-2">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {activeTab === 'blood' && (
        <main className="p-5 pb-24 animate-in slide-in-from-right duration-500">
           <div className="bg-[#cc0000] text-white p-8 rounded-[2.5rem] mb-6 shadow-xl relative">
              <h2 className="text-2xl font-black relative z-10">ব্লাড ব্যাংক</h2>
              <div className="mt-4 bg-white/20 p-2 rounded-xl flex items-center relative z-10">
                 <Search className="text-white ml-2" size={18}/>
                 <input 
                    type="text" 
                    placeholder="Search (e.g., O+, Feni)" 
                    className="bg-transparent border-none outline-none text-white placeholder-white/70 text-sm font-bold w-full ml-2"
                    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                 />
              </div>
              <Droplets className="absolute -right-5 -bottom-5 opacity-20 rotate-12" size={120} fill="white"/>
           </div>
           
           <div className="space-y-3">
              {data.blood_bank?.filter(item => 
                  item.name.toLowerCase().includes(searchTerm) || 
                  item.group?.toLowerCase().includes(searchTerm)
              ).map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-lg">{item.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">{item.loc}</span>
                           <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">{item.group}</span>
                        </div>
                      </div>
                   </div>
                   <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90"><Phone size={18}/></a>
                </div>
              ))}
           </div>
        </main>
      )}

      {activeTab === 'map' && (
        <div className="h-screen w-full relative z-0">
           {isOffline ? (
             <div className="h-full flex flex-col items-center justify-center bg-slate-200 text-slate-500">
               <WifiOff size={48} className="mb-2"/>
               <p className="font-bold">ম্যাপ অফলাইনে কাজ করে না</p>
             </div>
           ) : (
             <iframe className="w-full h-full bg-slate-200" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.35231267677!2d91.32135965!3d23.01582235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37536868848d7d91%3A0x29643d22b289060e!2sFeni%20District!5e0!3m2!1sen!2sbd!4v1652899476088!5m2!1sen!2sbd" allowFullScreen loading="lazy"></iframe>
           )}
        </div>
      )}

      <nav className="fixed bottom-6 inset-x-6 h-[72px] bg-white/95 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl flex justify-around items-center z-40">
        {['home', 'blood', 'map'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="relative w-full h-full flex flex-col items-center justify-center">
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${activeTab === tab ? '-translate-y-3 bg-[#cc0000] text-white shadow-lg scale-110' : 'text-slate-400'}`}>
               <Icon name={tab === 'home' ? 'Home' : tab === 'blood' ? 'Droplets' : 'MapIcon'} size={22}/>
            </div>
            {activeTab === tab && <span className="absolute bottom-2 text-[9px] font-black uppercase text-[#cc0000]">{tab}</span>}
          </button>
        ))}
      </nav>

      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="relative bg-[#f8f9fa] w-full max-w-lg h-[80vh] rounded-t-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
             <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 ${selectedService.bg} ${selectedService.color} rounded-2xl flex items-center justify-center`}><Icon name={selectedService.icon} /></div>
                   <h2 className="text-lg font-black">{selectedService.label}</h2>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-slate-100 p-2 rounded-full"><X size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-3 pb-12">
                {selectedService.data?.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-1 flex items-center gap-1"><MapIcon size={12} className="text-red-500"/> {item.loc}</p>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90"><Phone size={18}/></a>
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
