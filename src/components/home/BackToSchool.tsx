import Link from 'next/link';
import { ArrowRight, GraduationCap, Library, Sparkles } from 'lucide-react';

export default function BackToSchool() {
  return <section className="back-to-school">
    <div className="back-to-school__banner">
      <div className="back-to-school__visual">
        <img src="/images/brand/rentree-students-v1.webp" alt="Des étudiants apprennent ensemble dans un institut" loading="lazy" />
        <span><Sparkles size={14} /> Rentrée 2026</span>
      </div>
      <div className="back-to-school__copy">
        <div>
          <span className="back-to-school__eyebrow">Apprendre · progresser · transmettre</span>
          <h2>La rentrée approche.<br/><mark>Trouve ton prochain cours.</mark></h2>
          <p>Cours d&apos;arabe, Coran, tajwid ou lectures pour toute la famille : Al-Wasil réunit les bonnes adresses pour préparer une rentrée qui a du sens.</p>
        </div>
        <div className="back-to-school__actions">
          <Link href="/education"><GraduationCap size={18} /> Voir les instituts <ArrowRight size={17} /></Link>
          <Link href="/librairies"><Library size={18} /> Librairies islamiques <ArrowRight size={17} /></Link>
        </div>
      </div>
    </div>
  </section>;
}
