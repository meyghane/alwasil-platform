import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import type { EventCategory } from '@/data/events';

// Stable category artwork, reused automatically for every new event.
const images: Record<EventCategory, string> = {
  conference: '/images/testimonials/evenements.png',
  maraude: '/images/testimonials/solidarite.png',
  cours: '/images/brand/student-library-v2.png',
  iftar: '/images/testimonials/solidarite.png',
  webinaire: '/images/testimonials/evenements.png',
  jeunesse: '/images/brand/student-library-v2.png',
  famille: '/images/brand/mosque-v2.png',
  collecte: '/images/testimonials/solidarite.png',
  autre: '/images/testimonials/evenements.png',
};
type Props = { title: string; date: string; location: string; organizer: string; tag: string; category: EventCategory };
export default function EventCard({title,date,location,organizer,tag,category}: Props) {
  return <article style={{position:'relative',isolation:'isolate',overflow:'hidden',borderRadius:20,background:'#171717',minWidth:0,display:'flex',flexDirection:'column',minHeight:390,border:'1px solid #d8d4dd',scrollSnapAlign:'start'}}>
    <img src={images[category] ?? images.autre} alt="" loading="lazy" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:-2}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.1) 20%,rgba(0,0,0,.85) 65%,#080808 100%)',zIndex:-1}}/>
    <span style={{alignSelf:'flex-start',margin:18,background:'#ECFF58',color:'#080808',borderRadius:99,padding:'7px 12px',fontSize:11,fontWeight:700}}>{tag}</span>
    <div style={{padding:20,marginTop:'auto',color:'white'}}>
      <p style={{color:'#ECFF58',fontSize:12,fontWeight:600,margin:'0 0 9px'}}>{date}</p>
      <h3 style={{fontSize:'clamp(19px,1.7vw,25px)',lineHeight:1.12,fontWeight:500,letterSpacing:'-.035em',margin:'0 0 14px',overflowWrap:'anywhere'}}>{title}</h3>
      <p style={{display:'flex',gap:6,fontSize:13,lineHeight:1.5,color:'#dedede',margin:'0 0 8px'}}><MapPin size={14} style={{flexShrink:0}}/>{location}</p>
      <p style={{fontSize:12,color:'#bdbdbd',margin:0}}>Par {organizer}</p>
      <Link href="/events" style={{display:'inline-flex',alignItems:'center',gap:10,minHeight:44,color:'white',textDecoration:'none',borderBottom:'1px solid #ECFF58',fontSize:12,marginTop:10}}>Voir l’événement <ArrowUpRight size={16}/></Link>
    </div>
  </article>;
}
