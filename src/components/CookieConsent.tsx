'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const KEY = 'alwasil-cookie-consent';

export default function CookieConsent() {
 const [choice, setChoice] = useState<string | null>(null);
 useEffect(() => setChoice(window.localStorage.getItem(KEY)), []);
 if (choice === 'accepted') return <Script id="alwasil-gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PD96NMKQ');`}</Script>;
 if (choice) return null;
 const save = (value: string) => { window.localStorage.setItem(KEY, value); setChoice(value); };
 return <div role="dialog" aria-label="Choix des cookies" style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 100, background: '#fff', border: '1px solid #d6c27a', borderRadius: 14, padding: '1rem', boxShadow: '0 8px 30px rgba(0,0,0,.16)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}><div style={{ flex: 1, minWidth: 240, fontSize: '.82rem', lineHeight: 1.5 }}><strong>Votre confidentialité compte.</strong><br />Nous utilisons des cookies de mesure d’audience uniquement avec votre accord. <a href="/legal#confidentialite" style={{ color: '#8a6723' }}>En savoir plus</a>.</div><div style={{ display: 'flex', gap: '.5rem' }}><button onClick={() => save('refused')} style={{ padding: '.55rem .8rem', border: '1px solid #cfc7ad', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Refuser</button><button onClick={() => save('accepted')} style={{ padding: '.55rem .8rem', border: 0, borderRadius: 8, background: '#7652CA', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Accepter</button></div></div>;
}
