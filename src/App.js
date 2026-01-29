import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { Download, Menu, Bell, CloudSun, AlertCircle, Map as MapIcon, X, Phone, Heart } from 'lucide-react';

// তোর দেওয়া JSON লিংক
const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";

const App = () => {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // ক্যাশ এড়াতে timestamp যোগ করা হয়েছে
      const response = await axios.get(`${DATA_URL}?t=${new Date().getTime()}`);
      console.log("Data Loaded:", response.data);
      setAppData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // এরর হলে ম্যানুয়ালি কিছু ডাটা দেখাবে যাতে অ্যাপ ক্র্যাশ না করে
      setLoading(false);
    }
  };

  // ডাইনামিক আইকন লোডার
  const IconRender = ({ name, size = 20, className }) => {
    const Icon = LucideIcons[name] || LucideIcons.CircleDot;
    return <Icon size={size} className={className} />;
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
      <h1 className="text-white font-black text-2xl tracking-widest animate-pulse">SMART FENI</h1>
      <p className="text-white/60 text-xs mt-2">ডাটা আপডেট হচ্ছে...</p>
    </div>
  );

  // যদি ডাটা লোড না হয়, তাহলে ফলব্যাক UI
  const data = appData || { app_name: "Smart Feni", services: [] };

  return (
    <div className="min-h-screen bg-[#efe7de] font-sans pb-24 text-slate-900 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDrawerOpen(true)}><Menu size={24} /></button>
          <h1 className="text-xl font-black uppercase tracking-tight">{data.app_name}</h1>
        </div>
        <div className="flex gap-3">
          <Bell size={22} />
        </div>
      </header>

      {/* HOME CONTENT */}
      {activeTab === 'home' && (
        <main className="p-5 space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-2xl font-black">স্বাগতম!</h2>
               <p className="opacity-90 text-sm mt-1">ফেনী জেলার সকল ডিজিটাল সেবা এক অ্যাপে।</p>
             </div>
             <CloudSun className="absolute right-[-10px] top-[-10px] opacity-20" size={100} />
          </div>

          {/* Emergency Row */}
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => window.open('tel:999')} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-red-100 active:scale-95 transition">
                <div className="bg-red-50 p-3 rounded-full text-red-600"><AlertCircle size={24}/></div>
                <div className="text-left">
                  <h3 className="font-black text-red-600 text-lg">৯৯৯</h3>
                  <p className="text-[10px] uppercase font-bold opacity-50">জরুরি সেবা</p>
                </div>
             </button>
             <button onClick={() => setActiveTab('map')} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-blue-100 active:scale-95 transition">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600"><MapIcon size={24}/></div>
                <div className="text-left">
                  <h3 className="font-black text-blue-600 text-lg">ম্যাপ</h3>
                  <p className="text-[10px] uppercase font-bold opacity-50">লাইভ ম্যাপ</p>
                </div>
             </button>
          </div>

          {/* Dynamic Services Grid */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-lg border border-white">
            <h3 className="text-lg font-black mb-5 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
              সকল সেবা
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {data.services && data.services.map((service, index) => (
                <button key={index} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group">
                  <div className={`w-16 h-16 ${service.bg || 'bg-slate-100'} ${service.color || 'text-slate-600'} rounded-2xl flex items-center justify-center shadow-md border-2 border-white group-active:scale-90 transition-transform`}>
                    <IconRender name={service.icon} size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">{service.label}</span>
                </button>
              ))}
              {(!data.services || data.services.length === 0) && <p className="col-span-3 text-center text-xs opacity-50">সার্ভিস লোড হচ্ছে...</p>}
            </div>
          </div>

        </main>
      )}

      {/* MAP TAB */}
      {activeTab === 'map' && (
        <div className="h-[80vh] w-full p-4">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689658245!2d91.328383!3d23.0159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375368686e090a9b%3A0x6b15802377c385a!2sFeni!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
            className="w-full h-full rounded-[2rem] border-4 border-white shadow-xl" 
            allowFullScreen="" 
            loading="lazy">
          </iframe>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-6 inset-x-6 bg-white/90 backdrop-blur-xl border border-white p-3 rounded-[2rem] shadow-2xl flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-xl transition ${activeTab === 'home' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-slate-400'}`}><LucideIcons.Home size={24}/></button>
        <button onClick={() => setActiveTab('blood')} className={`p-3 rounded-xl transition ${activeTab === 'blood' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-slate-400'}`}><LucideIcons.Droplets size={24}/></button>
        <button onClick={() => setActiveTab('news')} className={`p-3 rounded-xl transition ${activeTab === 'news' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-slate-400'}`}><LucideIcons.Newspaper size={24}/></button>
      </nav>

      {/* SERVICE MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="relative bg-[#efe7de] w-full max-w-lg h-[75vh] rounded-t-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
             
             {/* Modal Header */}
             <div className="bg-red-600 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><IconRender name={selectedService.icon} /></div>
                   <h2 className="text-xl font-black">{selectedService.label}</h2>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-white/10 p-2 rounded-full"><X/></button>
             </div>

             {/* Modal List Content */}
             <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selectedService.data && selectedService.data.map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-slate-800">{item.name}</h4>
                        <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1"><LucideIcons.MapPin size={10}/> {item.loc}</p>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"><Phone size={18}/></a>
                  </div>
                ))}
                {(!selectedService.data || selectedService.data.length === 0) && <div className="text-center opacity-50 py-10">কোন তথ্য পাওয়া যায়নি</div>}
             </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;
