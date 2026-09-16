'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Sunrise, Sunset, Clock, MapPin } from 'lucide-react';

type Timings = {
 Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
};

const PRAYERS = [
 { key: 'Fajr', label: 'Fajr', icon: Moon, ar: 'الفجر' },
 { key: 'Dhuhr', label: 'Dhuhr', icon: Sun, ar: 'الظهر' },
 { key: 'Asr', label: 'Asr', icon: Sunrise, ar: 'العصر' },
 { key: 'Maghrib', label: 'Maghrib', icon: Sunset, ar: 'المغرب' },
 { key: 'Isha', label: 'Isha', icon: Moon, ar: 'العشاء' },
] as const;

// Méthode 12 = Union des organisations islamiques de France (UOIF)
const API = 'https://api.aladhan.com/v1/timingsByCity?city=Paris&country=France&method=12';

function toMinutes(hhmm: string): number {
 const [h, m] = hhmm.replace(/\s.*/, '').split(':').map(Number);
 return h * 60 + m;
}

function getCurrentPrayer(timings: Timings): string {
 const now = new Date();
 const cur = now.getHours() * 60 + now.getMinutes();
 const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
 let current = 'Isha';
 for (const p of order) {
 if (cur >= toMinutes(timings[p])) current = p;
 }
 return current;
}

function getNextPrayer(timings: Timings): { name: string; inMin: number } {
 const now = new Date();
 const cur = now.getHours() * 60 + now.getMinutes();
 const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
 for (const p of order) {
 const pm = toMinutes(timings[p]);
 if (pm > cur) return { name: p, inMin: pm - cur };
 }
 return { name: 'Fajr', inMin: 0 };
}

export default function PrayerTimesBar() {
 const [timings, setTimings] = useState<Timings | null>(null);
 const [now, setNow] = useState(new Date());

 useEffect(() => {
 fetch(API)
 .then(r => r.json())
 .then(d => setTimings(d?.data?.timings || null))
 .catch(() => {});
 }, []);

 // Refresh current time every minute
 useEffect(() => {
 const t = setInterval(() => setNow(new Date()), 60_000);
 return () => clearInterval(t);
 }, []);

 const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
 const current = timings ? getCurrentPrayer(timings) : null;
 const next = timings ? getNextPrayer(timings) : null;
 const nextLabel = next ? `${next.name} dans ${Math.floor(next.inMin / 60)}h${String(next.inMin % 60).padStart(2, '0')}` : '';

 return (
 <section aria-label="Horaires de prière à Paris" style={{
 background: '#080808', color: '#fff', padding: '1.1rem 0',
 borderTop: '1px solid #222', borderBottom: '1px solid #222',
 }}>
 <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

 {/* Date + prochaine prière */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
 <Clock size={14} color="#ECFF58" strokeWidth={2} />
 <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.68)', fontFamily: 'Poppins, sans-serif' }}>
 {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
 </span>
 </div>
 {next && (
 <div style={{
 fontSize: '0.72rem', fontWeight: 800, color: '#080808',
 backgroundColor: '#ECFF58',
 border: '1px solid #ECFF58',
 padding: '2px 10px', borderRadius: '99px',
 fontFamily: 'Poppins, sans-serif',
 }}>
 {nextLabel}
 </div>
 )}
 </div>

 {/* Horaires */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
 {PRAYERS.map(({ key, label, icon: Icon }) => {
 const isActive = current === key;
 const time = timings ? timings[key].replace(/\s.*/, '') : '--:--';
 return (
 <div key={key} style={{
 display: 'flex', alignItems: 'center', gap: '0.3rem',
 padding: '0.25rem 0.65rem',
 borderRadius: '8px',
 backgroundColor: isActive ? '#7652CA' : 'transparent',
 border: isActive ? '1px solid #8f72dc' : '1px solid rgba(255,255,255,0.1)',
 transition: 'all 0.3s',
 }}>
 <Icon size={12} color={isActive ? '#ECFF58' : 'rgba(255,255,255,0.42)'} strokeWidth={2} />
 <div>
 <div style={{ fontSize: '0.62rem', color: isActive ? '#ECFF58' : 'rgba(255,255,255,0.5)', fontWeight: 700, fontFamily: 'Poppins, sans-serif', lineHeight: 1 }}>
 {label}
 </div>
 <div style={{ fontSize: '0.75rem', color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: isActive ? 700 : 500, fontFamily: 'Poppins, sans-serif', lineHeight: 1.2 }}>
 {time}
 </div>
 </div>
 </div>
 );
 })}
 </div>

 <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap' }}>
 <MapPin size={12} color="#ECFF58" /> Paris · Méthode UOIF
 </div>
 </div>
 </section>
 );
}
