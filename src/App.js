import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { 
  Menu, Bell, X, Phone, CloudSun, AlertTriangle, 
  Map as MapIcon, Search, WifiOff, ChevronRight, 
  User, Info, Calendar
} from 'lucide-react';

// ⚠️ 
const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";
const CACHE_KEY = "smart_feni_v2_cache";

const App = () => {
  // ─── STATE MANAGEMENT ───
  const [data, setData] = useState({ 
    config: { app_name: "Smart Feni", welcome_title: "Loading...", last_updated: "..." }, 
    services: [], blood_bank: [], emergency: [] 
  });
  
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Notice & Notification States
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showNotifHistory, setShowNotifHistory] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ─── INITIAL LOAD ───
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
        processData(response.data);
      }
    } catch (err) {
      console.error("Network Error:", err);
      setIsOffline(true);
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) processData(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  const processData = (appData) => {
    setData(appData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(appData));
    
    // Check for active notice
    if (appData.notice?.active) {
      setShowNoticeModal(true);
      setHasUnread(true);
    }
  };

  // ─── HELPER COMPONENTS ───
  const Icon = ({ name, size = 20, className }) => {
    const LucideIcon = LucideIcons[name] || LucideIcons.CircleDot; 
    return <LucideIcon size={size} className={className} />;
  };

  // ─── LOADING SCREEN ───
  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="w-20 h-20 border-[6px] border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
      <h1 className="text-white font-black text-3xl tracking-[0.3em] uppercase animate-pulse">Smart Feni</h1>
      <p className="text-white/60 text-xs mt-2 font-bold uppercase tracking-widest">Initializing...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-24 relative selection:bg-red-200">
      
      {/* ─── OFFLINE ALERT ─── */}
      {isOffline && (
        <div className="bg-slate-800 text-white text-[11px] font-bold text-center py-2 flex items-center justify-center gap-2 sticky top-0 z-[999] shadow-md">
          <WifiOff size={14} className="text-red-500"/>
          <span>ইন্টারনেট সংযোগ নেই। অফলাইন মোড চালু।</span>
        </div>
      )}

      {/* ─── EMERGENCY NOTICE MODAL (Pop-up) ─── */}
      {showNoticeModal && data.notice && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNoticeModal(false)}></div>
           <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 relative shadow-2xl animate-in zoom-in-95 duration-300 border-t-[6px] border-[#cc0000]">
              <div className="w-16 h-16 bg-red-50 text-[#cc0000] rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-black text-center text-slate-900 mb-2">{data.notice.title}</h2>
              <div className="h-px w-20 bg-slate-100 mx-auto mb-4"></div>
              <p className="text-sm text-slate-600 text-center leading-relaxed mb-6 font-medium">{data.notice.message}</p>
              <button onClick={() => { setShowNoticeModal(false); setHasUnread(false); }} className="w-full py-3.5 bg-[#cc0000] text-white font-bold rounded-xl active:scale-95 transition shadow-lg shadow-red-200">বুঝেছি</button>
           </div>
        </div>
      )}

      {/* ─── NOTIFICATION HISTORY DRAWER ─── */}
      {showNotifHistory && (
        <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowNotifHistory(false)}></div>
          <div className="bg-white w-[300px] h-full shadow-2xl p-6 animate-in slide-in-from-right duration-300 rounded-l-[2rem] relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg flex items-center gap-2"><Bell size={20}/> নোটিফিকেশন</h3>
              <button onClick={() => setShowNotifHistory(false)} className="bg-slate-100 p-2 rounded-full"><X size={18}/></button>
            </div>
            
            <div className="space-y-4">
               {/* Last Update Info */}
               <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-blue-600"/>
                    <span className="text-xs font-bold text-blue-600">Last Database Update</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{data.config?.last_updated}</p>
               </div>

               {/* Active Notice */}
               {data.notice?.active ? (
                 <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-red-600"/>
                      <span className="text-xs font-bold text-red-600">Emergency Alert</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{data.notice.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{data.notice.message}</p>
                 </div>
               ) : (
                 <p className="text-center text-xs text-slate-400 py-10">কোনো নতুন নোটিশ নেই</p>
               )}
            </div>
          </div>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-[50] bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-xl shadow-red-900/10 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl active:scale-95 transition ring-1 ring-white/20">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none">{data.config?.app_name}</h1>
            <span className="text-[10px] font-bold opacity-90 uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              {data.config?.app_version}
            </span>
          </div>
        </div>
        <button onClick={() => setShowNotifHistory(true)} className="relative p-2.5 bg-white/20 backdrop-blur-md rounded-2xl active:scale-95 transition ring-1 ring-white/20">
          <Bell size={24} />
          {hasUnread && <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full animate-ping"></span>}
        </button>
      </header>

      {/* ─── MAIN DRAWER ─── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 rounded-r-[3rem]">
            
            {/* Header */}
            <div className="bg-gradient-to-br from-[#cc0000] to-[#990000] p-8 text-white rounded-br-[3rem] relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-white text-[#cc0000] rounded-[1.5rem] flex items-center justify-center font-black text-4xl shadow-xl mb-4">S</div>
                 <h2 className="text-2xl font-black tracking-tight">{data.config?.app_name}</h2>
               </div>
               <CloudSun className="absolute -right-8 -bottom-8 opacity-10 rotate-12" size={180}/>
            </div>

            {/* Menu */}
            <nav className="p-6 space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {[
                {id: 'home', label: 'হোম ড্যাশবোর্ড', icon: 'Home'},
                {id: 'blood', label: 'ব্লাড ব্যাংক', icon: 'Droplets'},
                {id: 'map', label: 'লাইভ ম্যাপ', icon: 'Map'},
              ].map((item) => (
                <button key={item.id} onClick={() => {setActiveTab(item.id); setIsDrawerOpen(false)}} className={`w-full flex items-center gap-4 p-4 rounded-[1.2rem] font-bold transition-all ${activeTab === item.id ? 'bg-red-50 text-red-600 shadow-md ring-1 ring-red-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon name={item.icon} size={22}/> {item.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-slate-100"></div>
              
              <button onClick={() => window.open('tel:999')} className="w-full flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-[1.2rem] font-bold active:scale-95 transition border border-red-100">
                <Phone size={22}/> ইমার্জেন্সি ৯৯৯
              </button>
            </nav>

            {/* Developer Card (Redesigned) */}
            <div className="p-5 pb-8">
               <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  <User size={24} className="mx-auto text-slate-400 mb-2"/>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Developed By</p>
                  <h4 className="text-sm font-black text-slate-800">{data.config?.developer_name}</h4>
                  <div className="mt-3 inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                     <span className="text-[10px] text-slate-500 font-bold">Assist:</span>
                     <span className="text-[10px] font-black text-[#cc0000]">{data.config?.assistant_name}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── HOME TAB ─── */}
      {activeTab === 'home' && (
        <main className="p-5 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-[#cc0000] to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-900/20 relative overflow-hidden group">
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Live Update: {data.config?.last_updated}</span>
               </div>
               <h2 className="text-3xl font-black leading-tight">{data.config?.welcome_title}</h2>
               <p className="opacity-90 text-sm mt-3 font-medium leading-relaxed max-w-[90%]">{data.config?.welcome_subtitle}</p>
             </div>
             <CloudSun className="absolute -right-8 -top-8 opacity-20 rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-1000" size={180} />
          </div>

          {/* Emergency Grid */}
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-4 px-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#cc0000] rounded-full"></span> জরুরি সেবা
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar snap-x">
               {data.emergency?.map((em, i) => (
                  <button key={i} onClick={() => window.open(`tel:${em.phone}`)} className="snap-start min-w-[150px] bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 active:scale-95 transition-all group">
                     <div className={`w-14 h-14 ${em.bg} rounded-full flex items-center justify-center ${em.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        <Icon name={em.icon} size={26}/>
                     </div>
                     <div>
                        <h3 className={`font-black ${em.color} text-2xl`}>{em.label}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight mt-1">{em.sub}</p>
                     </div>
                  </button>
               ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.8rem] shadow-lg border border-white">
            <div className="flex justify-between items-center mb-6 px-2">
               <h3 className="text-lg font-black text-slate-800">সকল ক্যাটাগরি</h3>
               <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">{data.services?.length || 0} টি</span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-8 gap-x-4">
              {data.services?.map((service, index) => (
                <button key={index} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-3 group active:scale-90 transition-all">
                  <div className={`w-[4.5rem] h-[4.5rem] ${service.bg || 'bg-slate-50'} ${service.color || 'text-slate-600'} rounded-[1.5rem] flex items-center justify-center shadow-sm border border-slate-50 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300`}>
                    <Icon name={service.icon} size={28} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 text-center leading-tight line-clamp-2 px-1">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ─── BLOOD BANK TAB ─── */}
      {activeTab === 'blood' && (
        <main className="p-5 pb-24 animate-in slide-in-from-right duration-500">
           <div className="bg-[#cc0000] text-white p-8 rounded-[2.5rem] mb-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black">ব্লাড ব্যাংক</h2>
                <div className="mt-6 bg-white/10 backdrop-blur-md p-1.5 rounded-[1.2rem] flex items-center border border-white/20 shadow-lg">
                   <div className="p-2.5"><Search className="text-white/70" size={18}/></div>
                   <input 
                      type="text" 
                      placeholder="খুঁজুন (যেমন: O+, ফেনী)" 
                      className="bg-transparent border-none outline-none text-white placeholder-white/50 text-sm font-bold w-full h-full"
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                   />
                </div>
              </div>
              <CloudSun className="absolute -right-8 -bottom-8 opacity-20 rotate-12" size={160} fill="white"/>
           </div>
           
           <div className="space-y-4">
              {data.blood_bank?.filter(item => 
                  item.name.toLowerCase().includes(searchTerm) || 
                  item.group?.toLowerCase().includes(searchTerm)
              ).map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[2rem] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-between group hover:border-red-100 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-[1.2rem] flex items-center justify-center font-black text-xl shadow-inner">{item.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                           <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1"><MapIcon size={10}/> {item.loc}</span>
                           {item.group && <span className="text-[10px] text-white font-bold bg-[#cc0000] px-2 py-0.5 rounded-md shadow-sm">{item.group}</span>}
                        </div>
                      </div>
                   </div>
                   <a href={`tel:${item.phone}`} className="w-12 h-12 bg-green-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-transform">
                     <Phone size={22}/>
                   </a>
                </div>
              ))}
           </div>
        </main>
      )}

      {/* ─── MAP TAB ─── */}
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

      {/* ─── BOTTOM NAV ─── */}
      <nav className="fixed bottom-6 inset-x-6 h-[80px] bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex justify-around items-center z-40 px-2">
        {['home', 'blood', 'map'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="relative w-full h-full flex flex-col items-center justify-center group">
            <div className={`p-3.5 rounded-[1.5rem] transition-all duration-500 ease-out ${activeTab === tab ? '-translate-y-5 bg-[#cc0000] text-white shadow-xl shadow-red-500/30 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
               <Icon name={tab === 'home' ? 'Home' : tab === 'blood' ? 'Droplets' : 'MapIcon'} size={24}/>
            </div>
            {activeTab === tab && (
              <span className="absolute bottom-3 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-2 text-[#cc0000]">
                {tab}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ─── SERVICE DETAILS MODAL ─── */}
      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="relative bg-[#f8f9fa] w-full max-w-lg h-[85vh] rounded-t-[3.5rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
             
             <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 ${selectedService.bg} ${selectedService.color} rounded-[1.2rem] flex items-center justify-center border border-slate-50 shadow-sm`}>
                      <Icon name={selectedService.icon} size={28} />
                   </div>
                   <div>
                     <h2 className="text-xl font-black text-slate-800">{selectedService.label}</h2>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Listing</p>
                     </div>
                   </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition text-slate-600 active:scale-90"><X size={22}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-12">
                {selectedService.data?.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-between group hover:border-red-100 transition-colors">
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-2 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md w-fit">
                           <MapIcon size={12} className="text-red-500"/> {item.loc}
                        </p>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-12 h-12 bg-green-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-transform">
                        <Phone size={22}/>
                     </a>
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
