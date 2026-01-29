import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { 
  Menu, Bell, X, Phone, CloudSun, AlertCircle, 
  Map as MapIcon, Home, Droplets, HeartPulse, 
  Clock, ChevronRight, Search 
} from 'lucide-react';

// JSON URL
const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";

const App = () => {
  // Initial State from JSON Structure
  const [data, setData] = useState({ 
    config: { app_name: "Smart Feni", last_updated: "Loading..." }, 
    services: [], 
    blood_bank: [],
    emergency: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Cache busting using timestamp
      const response = await axios.get(`${DATA_URL}?t=${Date.now()}`);
      if (response.data) {
        setData(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Connection Error:", err);
      setLoading(false);
    }
  };

  // Dynamic Icon Renderer
  const Icon = ({ name, size = 20, className }) => {
    const LucideIcon = LucideIcons[name] || LucideIcons.CircleDot; 
    return <LucideIcon size={size} className={className} />;
  };

  // Notification Toast Handler
  const handleNotification = () => {
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 4000);
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <LucideIcons.Heart className="text-white animate-pulse" fill="white" size={24}/>
        </div>
      </div>
      <h1 className="mt-5 text-white font-black text-2xl tracking-[0.2em] uppercase animate-pulse">Smart Feni</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-24 relative selection:bg-red-100">
      
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-[50] bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-lg rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl active:scale-95 transition">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight leading-none">{data.config?.app_name}</h1>
            <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">{data.config?.app_version || 'Beta'}</span>
          </div>
        </div>
        <button onClick={handleNotification} className="relative p-2.5 bg-white/20 backdrop-blur-md rounded-xl active:scale-95 transition">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-yellow-400 border border-red-600 rounded-full animate-ping"></span>
        </button>
      </header>

      {/* ─── NOTIFICATION TOAST ─── */}
      {showNotif && (
        <div className="fixed top-24 inset-x-4 z-[60] mx-auto max-w-sm bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-5 duration-300 border border-slate-700/50">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-yellow-400 shrink-0">
            <Clock size={20}/>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Last Updated</p>
            <p className="text-sm font-bold text-white">{data.config?.last_updated}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{data.config?.notification_msg}</p>
          </div>
        </div>
      )}

      {/* ─── SIDEBAR DRAWER ─── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 rounded-r-[2.5rem]">
            
            <div className="bg-[#cc0000] p-8 text-white rounded-br-[3rem] relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-14 h-14 bg-white text-[#cc0000] rounded-2xl flex items-center justify-center font-black text-3xl shadow-lg mb-4">S</div>
                 <h2 className="text-2xl font-black">Smart Feni</h2>
                 <p className="text-xs opacity-80 font-bold">আপনার ডিজিটাল সহকারী</p>
               </div>
               <LucideIcons.Activity className="absolute -right-5 -bottom-5 opacity-20" size={120}/>
            </div>

            <nav className="p-6 space-y-2 flex-1 overflow-y-auto no-scrollbar">
              {[
                {id: 'home', label: 'হোম পেজ', icon: 'Home'},
                {id: 'blood', label: 'ব্লাড ব্যাংক', icon: 'Droplets'},
                {id: 'map', label: 'লাইভ ম্যাপ', icon: 'Map'},
              ].map((item) => (
                <button key={item.id} onClick={() => {setActiveTab(item.id); setIsDrawerOpen(false)}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Icon name={item.icon} size={22}/> {item.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-slate-100"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Emergency</p>
              
              <button onClick={() => window.open('tel:999')} className="w-full flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-2xl font-bold active:scale-95 transition">
                <Phone size={22}/> ইমার্জেন্সি ৯৯৯
              </button>
            </nav>

            {/* DEVELOPER CREDITS (FIXED) */}
            <div className="p-6 bg-slate-50 mt-auto text-center border-t border-slate-200/50 rounded-tr-[2.5rem]">
               <div className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 shadow-sm border border-slate-100">Team Smart Feni</div>
               <p className="text-sm font-black text-slate-800">Developer Rifat Rishat</p>
               <p className="text-xs font-bold text-slate-500 mt-1 flex items-center justify-center gap-1">
                 Assist by <span className="text-[#cc0000] bg-red-50 px-2 py-0.5 rounded-md">@sultanarabi161</span>
               </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── HOME TAB ─── */}
      {activeTab === 'home' && (
        <main className="p-5 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-[#cc0000] via-[#990000] to-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-red-200 relative overflow-hidden group">
             <div className="relative z-10">
               <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">{data.config?.last_updated}</p>
               <h2 className="text-3xl font-black">{data.config?.welcome_title}</h2>
               <p className="opacity-90 text-sm mt-2 font-medium leading-relaxed max-w-[80%]">{data.config?.welcome_subtitle}</p>
             </div>
             <CloudSun className="absolute -right-6 -top-6 opacity-20 rotate-12 group-hover:rotate-[20deg] transition-transform duration-700" size={160} />
          </div>

          {/* Emergency Section */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
             {data.emergency?.map((em, i) => (
                <button key={i} onClick={() => window.open(`tel:${em.phone}`)} className="min-w-[140px] flex-1 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center gap-2 active:scale-95 transition-all">
                   <div className={`w-12 h-12 ${em.bg} rounded-full flex items-center justify-center ${em.color} shadow-inner`}>
                      <Icon name={em.icon} size={24}/>
                   </div>
                   <div>
                      <h3 className={`font-black ${em.color} text-xl`}>{em.label}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">{em.sub}</p>
                   </div>
                </button>
             ))}
          </div>

          {/* Services Grid */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-lg border border-white">
            <div className="flex justify-between items-end mb-6">
               <div>
                  <h3 className="text-xl font-black text-slate-800">সকল সেবা</h3>
                  <div className="h-1 w-10 bg-[#cc0000] rounded-full mt-1"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{data.services?.length || 0} টি সার্ভিস</span>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-8 gap-x-4">
              {data.services?.map((service, index) => (
                <button key={index} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-3 group active:scale-90 transition-all">
                  <div className={`w-16 h-16 ${service.bg || 'bg-slate-100'} ${service.color || 'text-slate-600'} rounded-[1.2rem] flex items-center justify-center shadow-sm border border-slate-50 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300`}>
                    <Icon name={service.icon} size={26} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 text-center leading-tight line-clamp-2">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ─── BLOOD BANK TAB ─── */}
      {activeTab === 'blood' && (
        <main className="p-5 animate-in slide-in-from-right duration-300 pb-20">
           {/* Header Card */}
           <div className="bg-[#cc0000] text-white p-8 rounded-[2.5rem] mb-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black">ব্লাড ব্যাংক</h2>
                <p className="text-sm opacity-90 mt-2 font-medium">রক্ত দিন, জীবন বাঁচান।</p>
                
                {/* Search Bar */}
                <div className="mt-6 bg-white/10 backdrop-blur-md p-1 rounded-2xl flex items-center border border-white/20">
                   <Search className="text-white/60 ml-3" size={18}/>
                   <input 
                      type="text" 
                      placeholder="খুঁজুন (যেমন: সদর, O+)" 
                      className="bg-transparent border-none outline-none text-white placeholder-white/60 text-sm font-bold w-full p-2.5"
                      onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                   />
                </div>
              </div>
              <Droplets className="absolute -right-6 -bottom-6 opacity-20 rotate-12" size={150} fill="white"/>
           </div>
           
           {/* Donors List from JSON 'blood_bank' array */}
           <div className="space-y-4">
              {data.blood_bank?.filter(item => 
                  item.name.toLowerCase().includes(searchTerm) || 
                  item.loc.toLowerCase().includes(searchTerm) ||
                  item.group?.toLowerCase().includes(searchTerm)
              ).length > 0 ? (
                data.blood_bank
                  .filter(item => 
                      item.name.toLowerCase().includes(searchTerm) || 
                      item.loc.toLowerCase().includes(searchTerm) ||
                      item.group?.toLowerCase().includes(searchTerm)
                  )
                  .map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner">{item.name.charAt(0)}</div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1"><MapIcon size={10}/> {item.loc}</p>
                             {item.group && <p className="text-[10px] text-white font-bold bg-red-500 px-2 py-0.5 rounded-md">{item.group}</p>}
                          </div>
                        </div>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-11 h-11 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-transform">
                       <Phone size={20}/>
                     </a>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-50 flex flex-col items-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <HeartPulse size={32} className="text-slate-400"/>
                   </div>
                   <p className="font-bold text-slate-400">কোন ডোনার পাওয়া যায়নি</p>
                </div>
              )}
           </div>
        </main>
      )}

      {/* ─── MAP TAB ─── */}
      {activeTab === 'map' && (
        <div className="h-screen w-full relative z-0 animate-in fade-in">
           <iframe className="w-full h-full bg-slate-200" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235850.6401089336!2d91.261892!3d23.0159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375368683e9b8621%3A0x6b49e3787720700d!2sFeni%20District!5e0!3m2!1sen!2sbd!4v1700000000000" allowFullScreen loading="lazy"></iframe>
           <div className="absolute top-24 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500 border border-white">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                <div>
                  <p className="text-sm font-black text-slate-800">Live Traffic</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Feni District</p>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-200">View</button>
           </div>
        </div>
      )}

      {/* ─── BOTTOM NAV ─── */}
      <nav className="fixed bottom-6 inset-x-6 h-[76px] bg-white/95 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex justify-around items-center z-40 px-2">
        {['home', 'blood', 'map'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="relative w-full h-full flex flex-col items-center justify-center group">
            <div className={`p-3 rounded-[1.2rem] transition-all duration-300 ${activeTab === tab ? '-translate-y-3 bg-[#cc0000] text-white shadow-xl shadow-red-200 scale-110' : 'text-slate-400 group-hover:bg-slate-50'}`}>
               <Icon name={tab === 'home' ? 'Home' : tab === 'blood' ? 'Droplets' : 'Map'} size={24}/>
            </div>
            {activeTab === tab && (
              <span className="absolute bottom-3 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 text-[#cc0000]">
                {tab}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ─── SERVICE MODAL ─── */}
      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="relative bg-[#f8f9fa] w-full max-w-lg h-[80vh] rounded-t-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
             
             <div className="bg-white px-6 py-5 border-b border-slate-100 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 ${selectedService.bg} ${selectedService.color} rounded-2xl flex items-center justify-center`}>
                      <Icon name={selectedService.icon} />
                   </div>
                   <div>
                     <h2 className="text-lg font-black text-slate-800">{selectedService.label}</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified List</p>
                   </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-slate-100 p-2.5 rounded-full hover:bg-slate-200 transition text-slate-600"><X size={20}/></button>
             </div>

             <div className="flex-1 overflow-y-auto p-5 space-y-3 pb-10">
                {selectedService.data?.map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-[2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-between group hover:border-red-100 transition-colors">
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-1.5 flex items-center gap-1.5">
                           <MapIcon size={12} className="text-red-400"/> {item.loc}
                        </p>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                        <Phone size={18}/>
                     </a>
                  </div>
                ))}
                {(!selectedService.data || selectedService.data.length === 0) && (
                   <div className="text-center py-10 opacity-50">তথ্য আপডেট করা হচ্ছে...</div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
