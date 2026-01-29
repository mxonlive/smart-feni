import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { 
  Menu, Bell, X, Phone, CloudSun, AlertCircle, 
  Map as MapIcon, Home, Droplets, HeartPulse, 
  Clock, Search, Shield, Info, Flame, Truck, Zap,
  Wifi, Monitor, GraduationCap, Landmark, Coffee,
  ShoppingBag, Package, Pill, Car, Mic2, Scale,
  Building2, Stethoscope, Ticket, Activity
} from 'lucide-react';

// মাস্টারপিস JSON URL
const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";

const App = () => {
  // ডাটা স্ট্রাকচার ইনিশিয়ালাইজেশন
  const [data, setData] = useState({ 
    config: { 
      app_name: "Smart Feni", 
      last_updated: "Checking...",
      welcome_title: "লোডিং...",
      welcome_subtitle: "অনুগ্রহ করে অপেক্ষা করুন"
    }, 
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
      // টাইমস্ট্যাম্প দিয়ে ক্যাশ বাইপাস করা হচ্ছে
      const response = await axios.get(`${DATA_URL}?t=${Date.now()}`);
      if (response.data) {
        setData(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("ডাটা লোড হতে সমস্যা হয়েছে:", err);
      setLoading(false);
    }
  };

  // ডাইনামিক আইকন রেন্ডারার (Lucide আইকন ম্যাপার)
  const Icon = ({ name, size = 20, className }) => {
    // আইকন নেম স্ট্রিং থেকে কম্পোনেন্ট বের করা
    const LucideIcon = LucideIcons[name] || LucideIcons.CircleDot; 
    return <LucideIcon size={size} className={className} />;
  };

  // নোটিফিকেশন টোস্ট
  const handleNotification = () => {
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 5000);
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
        <h1 className="text-white font-black text-3xl uppercase tracking-[0.3em] animate-pulse">Smart Feni</h1>
        <p className="text-white/70 text-xs mt-2 font-bold uppercase tracking-widest">System Initializing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-900 pb-24 relative selection:bg-red-200">
      
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-[50] bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-xl shadow-red-900/10 rounded-b-[2.5rem]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl active:scale-90 transition-transform ring-1 ring-white/30">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight leading-none">{data.config?.app_name}</h1>
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              {data.config?.app_version || 'Live'}
            </span>
          </div>
        </div>
        <button onClick={handleNotification} className="relative p-2.5 bg-white/20 backdrop-blur-md rounded-2xl active:scale-90 transition-transform ring-1 ring-white/30">
          <Bell size={24} />
          <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full animate-ping"></span>
        </button>
      </header>

      {/* ─── NOTIFICATION POPUP ─── */}
      {showNotif && (
        <div className="fixed top-28 inset-x-4 z-[60] mx-auto max-w-sm bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-[2rem] shadow-2xl flex items-start gap-4 animate-in slide-in-from-top-5 duration-500 border border-slate-700">
          <div className="p-3 bg-slate-800 rounded-full text-yellow-400 shrink-0">
            <Clock size={20}/>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">System Update</p>
            <p className="text-xs font-bold text-white mb-2">{data.config?.last_updated}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{data.config?.notification_msg}</p>
          </div>
        </div>
      )}

      {/* ─── SIDEBAR DRAWER ─── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-500 rounded-r-[3rem]">
            
            {/* Drawer Header */}
            <div className="bg-gradient-to-br from-[#cc0000] to-[#990000] p-8 text-white rounded-br-[3rem] relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-white text-[#cc0000] rounded-[1.5rem] flex items-center justify-center font-black text-4xl shadow-xl mb-4">S</div>
                 <h2 className="text-2xl font-black tracking-tight">{data.config?.app_name}</h2>
                 <p className="text-xs opacity-80 font-bold mt-1">ফেনী জেলার ডিজিটাল গেটওয়ে</p>
               </div>
               <Activity className="absolute -right-8 -bottom-8 opacity-10 rotate-12" size={200}/>
            </div>

            {/* Menu Items */}
            <nav className="p-6 space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {[
                {id: 'home', label: 'হোম ড্যাশবোর্ড', icon: 'Home'},
                {id: 'blood', label: 'ব্লাড ব্যাংক', icon: 'Droplets'},
                {id: 'map', label: 'লাইভ ম্যাপ', icon: 'Map'},
              ].map((item) => (
                <button key={item.id} onClick={() => {setActiveTab(item.id); setIsDrawerOpen(false)}} className={`w-full flex items-center gap-4 p-4 rounded-[1.2rem] font-bold transition-all ${activeTab === item.id ? 'bg-red-50 text-red-600 shadow-lg shadow-red-100/50' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Icon name={item.icon} size={22}/> {item.label}
                </button>
              ))}
              
              <div className="my-4 border-t border-slate-100"></div>
              
              <button onClick={() => window.open('tel:999')} className="w-full flex items-center gap-4 p-4 bg-red-50 text-red-600 rounded-[1.2rem] font-bold active:scale-95 transition border border-red-100">
                <Phone size={22}/> ইমার্জেন্সি ৯৯৯
              </button>
            </nav>

            {/* Developer Credits (Config Driven) */}
            <div className="p-6 bg-slate-50 mt-auto text-center border-t border-slate-100">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> App Info
               </div>
               <p className="text-sm font-black text-slate-800">{data.config?.developer_name}</p>
               <p className="text-xs font-bold text-slate-500 mt-1 flex items-center justify-center gap-1">
                 Assist by <span className="text-[#cc0000] bg-red-100/50 px-2 py-0.5 rounded-md">{data.config?.assistant_name}</span>
               </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── HOME TAB ─── */}
      {activeTab === 'home' && (
        <main className="p-5 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-br from-[#cc0000] via-[#b30000] to-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-900/20 relative overflow-hidden group">
             <div className="relative z-10">
               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-3 border border-white/10">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{data.config?.last_updated}</span>
               </div>
               <h2 className="text-3xl font-black leading-tight">{data.config?.welcome_title}</h2>
               <p className="opacity-90 text-sm mt-3 font-medium leading-relaxed max-w-[90%]">{data.config?.welcome_subtitle}</p>
             </div>
             <CloudSun className="absolute -right-8 -top-8 opacity-20 rotate-[15deg] group-hover:rotate-[25deg] transition-transform duration-1000" size={180} />
          </div>

          {/* Emergency Horizontal Scroll */}
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-4 px-2 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full"></span> জরুরি সেবা
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

          {/* Main Services Grid */}
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
        <main className="p-5 animate-in slide-in-from-right duration-500 pb-20">
           {/* Header with Search */}
           <div className="bg-[#cc0000] text-white p-8 rounded-[2.5rem] mb-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black">ব্লাড ব্যাংক</h2>
                <p className="text-sm opacity-90 mt-2 font-medium">রক্ত দিন, জীবন বাঁচান।</p>
                
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
              <Droplets className="absolute -right-8 -bottom-8 opacity-20 rotate-12" size={160} fill="white"/>
           </div>
           
           {/* Dynamic Donors List */}
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <HeartPulse size={40} className="text-slate-400"/>
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
           <iframe className="w-full h-full bg-slate-200" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.35231267677!2d91.32135965!3d23.01582235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37536868848d7d91%3A0x29643d22b289060e!2sFeni%20District!5e0!3m2!1sen!2sbd!4v1652899476088!5m2!1sen!2sbd" allowFullScreen loading="lazy"></iframe>
           <div className="absolute top-28 left-5 right-5 bg-white/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500 border border-white">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <div>
                  <p className="text-sm font-black text-slate-800">লাইভ ট্রাফিক</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ফেনী জেলা</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform">রিফ্রেশ</button>
           </div>
        </div>
      )}

      {/* ─── BOTTOM NAVIGATION ─── */}
      <nav className="fixed bottom-6 inset-x-6 h-[80px] bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex justify-around items-center z-40 px-2">
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
             
             {/* Modal Header */}
             <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10 sticky top-0">
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 ${selectedService.bg} ${selectedService.color} rounded-[1.2rem] flex items-center justify-center border border-slate-50 shadow-sm`}>
                      <Icon name={selectedService.icon} size={28} />
                   </div>
                   <div>
                     <h2 className="text-xl font-black text-slate-800">{selectedService.label}</h2>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Listing</p>
                     </div>
                   </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition text-slate-600 active:scale-90"><X size={22}/></button>
             </div>

             {/* Modal Content */}
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
                {(!selectedService.data || selectedService.data.length === 0) && (
                   <div className="flex flex-col items-center justify-center h-40 opacity-50">
                      <p className="font-bold text-slate-400">তথ্য আপডেট করা হচ্ছে...</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
