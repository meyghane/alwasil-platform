import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Users } from 'lucide-react';

const lime='#ECFF58';
export default function EditorialHero(){
 const pill:React.CSSProperties={borderRadius:999,padding:'16px 24px',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:18,textDecoration:'none',fontWeight:700,color:'#080808',background:lime};
 return <section aria-label="Découvrir Al-Wasil" className="editorial-hero">
 <div className="editorial-hero__intro">
 <div className="editorial-hero__title">
 <h1 style={{fontSize:'clamp(26px, 3.15vw, 52px)',lineHeight:1.3,letterSpacing:'-.055em',fontWeight:700,margin:0}}>APPRENDRE.<br/><span style={{display:'inline-block',background:lime,border:'2px solid #080808',borderRadius:100,padding:'0 10px',transform:'rotate(-3deg)',whiteSpace:'nowrap'}}>SE RETROUVER.</span><br/>S’ENTRAIDER.</h1>
 </div>
 <Link href="/education" aria-label="Trouver un institut ou un cours" className="editorial-hero__student">
 <img src="/images/brand/student-library-v2.png" alt="Étudiante dans une bibliothèque" className="editorial-hero__student-image" />
 <span style={{position:'absolute',top:18,right:18,borderRadius:'50%',background:'white',padding:12,color:'#080808',display:'flex'}}><ArrowUpRight size={24}/></span>
 <span style={{...pill,position:'absolute',bottom:28,left:'8%',right:'8%'}}>Trouver un institut <ArrowRight size={22}/></span>
 </Link>
 </div>
 <div className="editorial-hero__services">
 <div style={{padding:'24px 22px 42px'}}>
 <span style={{display:'flex',alignItems:'center',gap:10,background:'#7652CA',color:'white',borderRadius:99,padding:'12px 14px',fontSize:11,fontWeight:600}}><Users size={18} style={{flexShrink:0}}/>LA COMMUNAUTÉ, À PORTÉE DE MAIN</span>
 <Link href="/events" style={{display:'block',color:'#080808',textDecoration:'none',marginTop:60}}><h2 style={{fontSize:'clamp(28px, 2.8vw, 44px)',letterSpacing:'-.06em',margin:'0 0 14px',fontWeight:800}}>ÉVÉNEMENTS <ArrowUpRight size={22}/></h2><p style={{lineHeight:1.5,margin:0}}>Rencontres, conférences et ateliers : trouvez votre prochain rendez-vous.</p></Link>
 <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:18,marginTop:36}}>{[['/education','Cours & instituts'],['/sante','Santé & accompagnement'],['/hajj','Hajj & Omra']].map(([href,label])=><Link key={href} href={href} style={{color:'#080808',textUnderlineOffset:7,fontWeight:600}}>{label}</Link>)}</div>
 </div>
 <div style={{background:'#080808',borderRadius:'65% 0 0 0',marginTop:'auto',padding:'64px 24px 36px 42px',color:'white'}}>
 <Link href="/solidarity" style={{textDecoration:'none',color:lime}}><h2 style={{fontSize:'clamp(28px, 2.3vw, 36px)',letterSpacing:'-.04em',margin:'0 0 12px'}}>SOLIDARITÉ</h2></Link>
 <p style={{lineHeight:1.5,margin:'0 0 24px'}}>Découvrez les cagnottes et les associations. Contribuez aux projets qui vous tiennent à cœur.</p>
 <Link href="/solidarity" style={{...pill,background:'transparent',color:'white',border:'1px solid white',padding:'12px 20px'}}>Voir les cagnottes <ArrowRight size={16}/></Link>
 </div>
 </div>
 <div role="img" aria-label="Mosquée lumineuse découpée en mosaïque" className="editorial-hero__mosque">
  <img src="/images/brand/mosque-v2.png" alt="" className="editorial-hero__mosque-image" />
  <div className="editorial-hero__mosaic" aria-hidden="true">{Array.from({length:12},(_,i)=><span key={i}/>)}</div>
 </div>
 </section>;
}
