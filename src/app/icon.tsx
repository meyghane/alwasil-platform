import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
 return new ImageResponse(
 (
 <div
 style={{
 width: 32,
 height: 32,
 position: 'relative',
 overflow: 'hidden',
 background: '#080808',
 borderRadius: 9,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 color: '#ffffff',
 fontSize: 14,
 fontWeight: 900,
 fontFamily: 'sans-serif',
 letterSpacing: '-1.5px',
 }}
 >
 <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: 99, background: '#7652CA', top: -7, right: -5, display: 'flex' }} />
 <div style={{ position: 'absolute', width: 22, height: 5, borderRadius: 99, background: '#ECFF58', left: 5, bottom: 4, display: 'flex' }} />
 <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: -2 }}>
  <span style={{ color: '#ffffff' }}>A</span><span style={{ color: '#ECFF58' }}>W</span>
 </div>
 </div>
 ),
 { ...size }
 );
}
