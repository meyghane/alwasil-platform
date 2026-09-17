'use client';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
const links=[['/events','Événements'],['/solidarity','Solidarité'],['/education','Apprentissage'],['/hajj','Hajj & Omra']];
const services=[['/jobs','Emploi'],['/sante','Santé'],['/justice','Droit & justice'],['/librairies','Librairies'],['/piscines','Piscines']];
export default function Navigation(){
 const [open,setOpen]=useState(false); const [wide,setWide]=useState(false);
 useEffect(()=>{const m=window.matchMedia('(min-width: 1050px)');const update=()=>{setWide(m.matches);setOpen(false);};update();m.addEventListener('change',update);return()=>m.removeEventListener('change',update);},[]);
 const style:React.CSSProperties={color:'#080808',textDecoration:'none',fontSize:14,padding:'12px 8px',fontWeight:500};
 return <header style={{position:'sticky',top:0,zIndex:50,background:'#fff',borderBottom:'1px solid #eee'}} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>
 <nav aria-label="Navigation principale" style={{maxWidth:1600,margin:'auto',padding:'12px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,minHeight:66}}>
 <Link href="/" aria-label="Al-Wasil, accueil" style={{fontWeight:850,fontSize:21,letterSpacing:'-.06em',color:'#080808',textDecoration:'none',whiteSpace:'nowrap'}}>AL-WASIL</Link>
 {wide&&<div style={{display:'flex',alignItems:'center',gap:12}}>{links.slice(0,3).map(([url,label])=><Link key={url} href={url} style={style}>{label}</Link>)}
 <div style={{position:'relative'}}><button aria-expanded={open} aria-controls="services-menu" onClick={()=>setOpen(!open)} style={{...style,background:'none',border:0,cursor:'pointer',display:'flex',gap:5,alignItems:'center'}}>Services <ChevronDown size={14}/></button>
 {open&&<div id="services-menu" style={{position:'absolute',top:'100%',left:0,width:240,padding:12,background:'white',border:'1px solid #ddd',borderRadius:18,boxShadow:'0 12px 28px #00000012',display:'grid'}}>{services.map(([url,label])=><Link key={url} href={url} onClick={()=>setOpen(false)} style={style}>{label}</Link>)}</div>}</div>
 <Link href="/hajj" style={style}>Hajj & Omra</Link></div>}
 <div style={{display:'flex',alignItems:'center',gap:10}}><Link href="/contact" style={{background:'#080808',color:'white',textDecoration:'none',borderRadius:99,padding:'12px 18px',fontSize:12,fontWeight:600}}>Nous contacter</Link>
 {!wide&&<button aria-label={open?'Fermer le menu':'Ouvrir le menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)} style={{background:'white',border:'1px solid #ddd',borderRadius:99,padding:11,display:'flex',color:'#080808'}}>{open?<X size={20}/>:<Menu size={20}/>}</button>}</div></nav>
 {!wide&&open&&<nav id="mobile-navigation" aria-label="Toutes les rubriques" style={{display:'grid',padding:20,maxHeight:'75vh',overflowY:'auto',borderTop:'1px solid #eee'}}>{[...links,...services].map(([url,label])=><Link key={url} href={url} onClick={()=>setOpen(false)} style={style}>{label}</Link>)}</nav>}
 </header>;
}
