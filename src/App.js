import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import { Menu, Bell, X, Phone, CloudSun, AlertCircle, Map as MapIcon, Home, Droplets, Newspaper } from 'lucide-react';

const DATA_URL = "https://raw.githubusercontent.com/mxonlive/smart-feni/refs/heads/main/content_data.json";

const App = () => {
  const [appData, setAppData] = useState({ services: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${DATA_URL}?t=${Date.now()}`); // Cache busting
      if (response.data) {
        setAppData(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("ইন্টারনেট সংযোগ চেক করুন");
      setLoading(false);
    }
  };

  // ফিক্সড আইকন রেন্ডারার
  const IconRender = ({ name, size = 20, className }) => {
    // JSON থেকে আসা নাম যদি Lucide এ না থাকে, তাহলে ডিফল্ট আইকন দেখাবে
    const IconComponent = LucideIcons[name] || LucideIcons.CircleDot; 
    return <IconComponent size={size} className={className} />;
  };

  // লোডিং স্ক্রিন
  if (loading) return (
    <div className="h-screen w-full bg-[#cc0000] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
      <h1 className="text-white font-black text-2xl uppercase tracking-widest">Smart Feni</h1>
    </div>
  );

  // এরর স্ক্রিন
  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={48} className="text-red-600 mb-4" />
      <h2 className="text-xl font-bold">{error}</h2>
      <button onClick={fetchData} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full">আবার চেষ্টা করুন</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#efe7de] font-sans text-slate-900 overflow-x-hidden pb-24 relative">
      
      {/* HEADER (Fixed Z-Index) */}
      <header className="sticky top-0 z-[50] bg-[#cc0000] text-white px-5 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          {/* Menu Button Fixed */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="p-2 bg-white/10 rounded-lg active:scale-95 transition-transform"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-black uppercase tracking-tight">{appData.app_name || "Smart Feni"}</h1>
        </div>
        <div className="relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 border-2 border-red-600 rounded-full"></span>
        </div>
      </header>

      {/* DRAWER / SIDEBAR (Fixed Overlay & Animation) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in duration-200">
          {/* Overlay Click to Close */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* Sidebar Content */}
          <div className="relative bg-white w-[280px] h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-black text-red-600">Smart Feni</h2>
               <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <nav className="space-y-2">
              <button onClick={() => {setActiveTab('home'); setIsDrawerOpen(false)}} className="w-full flex items-center gap-4 p-3 hover:bg-red-50 text-slate-700 rounded-xl font-bold transition"><Home size={20}/> হোম</button>
              <button onClick={() => {setActiveTab('blood'); setIsDrawerOpen(false)}} className="w-full flex items-center gap-4 p-3 hover:bg-red-50 text-slate-700 rounded-xl font-bold transition"><Droplets size={20}/> ব্লাড ব্যাংক</button>
              <button onClick={() => {setActiveTab('map'); setIsDrawerOpen(false)}} className="w-full flex items-center gap-4 p-3 hover:bg-red-50 text-slate-700 rounded-xl font-bold transition"><MapIcon size={20}/> ম্যাপ</button>
              <button onClick={() => window.open('tel:999')} className="w-full flex items-center gap-4 p-3 bg-red-50 text-red-600 rounded-xl font-bold transition mt-4"><Phone size={20}/> ইমার্জেন্সি ৯৯৯</button>
            </nav>
            <div className="mt-auto text-xs text-center text-slate-400 font-bold">Version 1.0.0</div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {activeTab === 'home' && (
        <main className="p-5 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-2xl font-black">স্বাগতম!</h2>
               <p className="opacity-90 text-sm mt-1">{appData.welcome_msg || "ফেনী জেলার ডিজিটাল গাইড"}</p>
             </div>
             <CloudSun className="absolute -right-2 -top-2 opacity-20 rotate-12" size={100} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
             <button onClick={() => window.open('tel:999')} className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center gap-3 border border-red-50 active:scale-95 transition">
                <div className="bg-red-100 p-3 rounded-full text-red-600"><AlertCircle size={24}/></div>
                <div><h3 className="font-black text-red-600">৯৯৯</h3><p className="text-[10px] font-bold opacity-50">কল করুন</p></div>
             </button>
             <button onClick={() => setActiveTab('map')} className="bg-white p-5 rounded-[2rem] shadow-sm flex items-center gap-3 border border-blue-50 active:scale-95 transition">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapIcon size={24}/></div>
                <div><h3 className="font-black text-blue-600">ম্যাপ</h3><p className="text-[10px] font-bold opacity-50">দেখুন</p></div>
             </button>
          </div>

          {/* SERVICES GRID (Fixed Rendering) */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-lg border border-white">
            <h3 className="text-lg font-black mb-5 pl-2 border-l-4 border-red-600 text-slate-800">সকল সেবা</h3>
            
            {appData.services && appData.services.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {appData.services.map((service, index) => (
                  <button key={index} onClick={() => setSelectedService(service)} className="flex flex-col items-center gap-2 group active:scale-90 transition-all">
                    <div className={`w-16 h-16 ${service.bg || 'bg-slate-100'} ${service.color || 'text-slate-600'} rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:shadow-md transition-all`}>
                      <IconRender name={service.icon} size={24} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 text-center leading-tight px-1">{service.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-50 text-sm">কোন সেবা পাওয়া যায়নি!</div>
            )}
          </div>
        </main>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab === 'blood' && <div className="p-10 text-center font-bold text-red-600">ব্লাড ব্যাংক সেকশন</div>}
      {activeTab === 'map' && <div className="h-[80vh] p-4"><iframe className="w-full h-full rounded-3xl shadow-xl border-4 border-white" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14602.25427218428!2d91.399!3d23.015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1" allowFullScreen loading="lazy"></iframe></div>}
      
      {/* BOTTOM NAV */}
      <nav className="fixed bottom-6 inset-x-6 bg-white/95 backdrop-blur-md border border-white p-2 rounded-[2.5rem] shadow-2xl flex justify-around items-center z-40">
        <button onClick={() => setActiveTab('home')} className={`p-4 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-110' : 'text-slate-400 hover:bg-red-50'}`}><Home size={22}/></button>
        <button onClick={() => setActiveTab('blood')} className={`p-4 rounded-2xl transition-all ${activeTab === 'blood' ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-110' : 'text-slate-400 hover:bg-red-50'}`}><Droplets size={22}/></button>
        <button onClick={() => setActiveTab('map')} className={`p-4 rounded-2xl transition-all ${activeTab === 'map' ? 'bg-red-600 text-white shadow-lg shadow-red-200 scale-110' : 'text-slate-400 hover:bg-red-50'}`}><MapIcon size={22}/></button>
      </nav>

      {/* SERVICE DETAILS MODAL */}
      {selectedService && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedService(null)}></div>
          <div className="relative bg-[#efe7de] w-full max-w-lg h-[80vh] rounded-t-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
             
             {/* Header */}
             <div className="bg-red-600 text-white p-6 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/20"><IconRender name={selectedService.icon} /></div>
                   <div>
                     <h2 className="text-xl font-black">{selectedService.label}</h2>
                     <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Service Details</p>
                   </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="bg-black/20 p-2.5 rounded-full hover:bg-black/40 transition"><X size={20}/></button>
             </div>

             {/* List */}
             <div className="flex-1 overflow-y-auto p-5 space-y-3 pb-20">
                {selectedService.data && selectedService.data.map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between group">
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-1 flex items-center gap-1 opacity-70"><MapIcon size={10}/> {item.loc}</p>
                     </div>
                     <a href={`tel:${item.phone}`} className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"><Phone size={18}/></a>
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
