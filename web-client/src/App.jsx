import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Trash2, Search, MapPin, History, LogOut, ShieldCheck } from 'lucide-react';

//  moves map view when IP changes
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [ipData, setIpData] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. LOGIN 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login', auth);
      if (res.data.success) {
        setIsLoggedIn(true);
        fetchIpInfo(); 
      }
    } catch (err) {
      alert("Unauthorized: Please check credentials.");
    }
  };

  // 2. IP INFO 
  const fetchIpInfo = async (ip = '') => {
    setError('');
    setLoading(true);
    
    if (ip && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
      setError("Please enter a valid IPv4 address.");
      setLoading(false);
      return;
    }

    try {
      const url = ip ? `https://ipinfo.io/${ip}/json` : `https://ipinfo.io/json`;
      const res = await axios.get(url);
      setIpData(res.data);
      
      if (ip) {
        const newEntry = { id: Date.now(), ...res.data };
        setHistory(prev => [newEntry, ...prev.filter(item => item.ip !== res.data.ip)]);
      }
    } catch (err) {
      setError("Failed to fetch IP data.");
    } finally {
      setLoading(false);
    }
  };

  // --- CENTERED LOGIN SCREEN -attempt- ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md border border-white">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 p-5 rounded-[1.5rem] shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white" size={36}/>
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">JLabs Assessment</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Full Stack Entry Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-tighter">Account Email</label>
              <input 
                type="email" 
                placeholder="admin@test.com" 
                required 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-blue-500 focus:bg-white transition-all"
                onChange={(e) => setAuth({...auth, email: e.target.value})} 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-tighter">Security Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-blue-500 focus:bg-white transition-all"
                onChange={(e) => setAuth({...auth, password: e.target.value})} 
              />
            </div>

            <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.97] mt-4 uppercase tracking-widest text-sm">
              Sign In
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-50">
             <p className="text-[9px] text-slate-300 font-bold text-center italic tracking-tight uppercase">Technical Assessment Session</p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-[1000]">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><MapPin size={20} /></div>
          <span className="font-black text-xl tracking-tight text-slate-800 uppercase">IP_LOCATOR <span className="text-blue-600">PRO</span></span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 px-5 py-2 rounded-full text-sm font-bold transition-all">
          <LogOut size={18}/> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20}/>
                <input value={searchIp} onChange={(e) => setSearchIp(e.target.value)}
                  placeholder="Enter IP address..." className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"/>
              </div>
              <button onClick={() => fetchIpInfo(searchIp)} disabled={loading} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all">
                {loading ? '...' : 'Locate'}
              </button>
              <button onClick={() => {setSearchIp(''); fetchIpInfo();}} className="text-slate-400 hover:text-blue-600 underline text-sm px-2">Clear</button>
            </div>
            {error && <p className="text-red-500 text-[10px] mt-3 ml-1 font-black uppercase">{error}</p>}
            
            {ipData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 border-t border-slate-50 pt-6">
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">IP Address</p><p className="font-bold text-slate-700">{ipData.ip}</p></div>
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Location</p><p className="font-bold text-slate-700">{ipData.city}</p></div>
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Region</p><p className="font-bold text-slate-700">{ipData.region}</p></div>
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">ISP</p><p className="font-bold text-slate-700 truncate">{ipData.org}</p></div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border-8 border-white overflow-hidden ring-1 ring-slate-100">
            {ipData?.loc ? (
              <MapContainer center={ipData.loc.split(',')} zoom={13} className="h-[480px]">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <Marker position={ipData.loc.split(',')}>
                  <Popup className="font-bold">{ipData.ip}</Popup>
                </Marker>
                <ChangeView center={ipData.loc.split(',')} />
              </MapContainer>
            ) : <div className="h-[480px] bg-slate-50 flex items-center justify-center font-bold text-slate-300 italic tracking-widest">Awaiting Geospatial Data...</div>}
          </section>
        </div>

        <aside className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-5">
            <History size={20} className="text-blue-600"/>
            <h2 className="font-black text-slate-700 uppercase tracking-tighter">History</h2>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {history.length === 0 && <p className="text-slate-300 text-[10px] font-black text-center py-10 uppercase tracking-[0.2em] italic">Empty Logs</p>}
            {history.map((item) => (
              <div key={item.id} onClick={() => setIpData(item)} className="group flex justify-between items-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-black text-slate-700 group-hover:text-white transition-colors">{item.ip}</p>
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-200 transition-colors uppercase">{item.city}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setHistory(history.filter(h => h.id !== item.id))}} className="p-2 rounded-lg text-slate-300 hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}