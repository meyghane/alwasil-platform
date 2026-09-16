'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useRef } from 'react';

const stories = [
  { title: 'Événements', image: '/images/testimonials/evenements.png', quote: "J’ai trouvé une conférence près de chez moi en quelques minutes. C’était exactement le rendez-vous communautaire que je cherchais.", name: 'Sarah, Paris', href: '/events', color: '#7652CA' },
  { title: 'Solidarité', image: '/images/testimonials/solidarite.png', quote: "Je cherchais une action concrète à rejoindre. Al-Wasil m’a permis de trouver une maraude à laquelle je peux participer quand je suis disponible.", name: 'Yasmine, Lyon', href: '/solidarity', color: '#ECFF58' },
  { title: 'Hajj & Omra', image: '/images/testimonials/hajj-omra.png', quote: "L’équipe m’a aiguillée vers une agence sérieuse et à l’écoute. Ce n’est pas seulement un comparateur : j’ai reçu de vraies réponses pour préparer mon voyage.", name: 'Nadia, Île-de-France', href: '/hajj', color: '#080808' },
  { title: 'Éducation', image: '/images/testimonials/evenements.png', quote: "J’ai enfin trouvé un institut avec des horaires compatibles avec mon travail et un programme clair pour reprendre l’arabe.", name: 'Inès, Lille', href: '/education', color: '#7652CA' },
  { title: 'Santé', image: '/images/testimonials/solidarite.png', quote: "J’ai pu identifier une psychologue qui comprend mes repères culturels et religieux. Cela m’a évité des semaines de recherches.", name: 'Meryem, Seine-Saint-Denis', href: '/sante', color: '#ECFF58' },
];

export default function CommunityStories() {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: number) => rail.current?.scrollBy({ left: direction * Math.min(860, window.innerWidth * .82), behavior: 'smooth' });
  return <section className="community-stories" aria-labelledby="community-stories-title">
    <div className="community-stories__head">
      <div><span className="community-stories__eyebrow"><MessageCircle size={15}/> AVIS DE LA COMMUNAUTÉ</span><h2 id="community-stories-title">Trouvé grâce à Al-Wasil.</h2></div>
      <div className="community-stories__controls"><button onClick={() => move(-1)} aria-label="Avis précédents"><ChevronLeft/></button><button onClick={() => move(1)} aria-label="Avis suivants"><ChevronRight/></button></div>
    </div>
    <div className="community-stories__rail" ref={rail}>
      {stories.map((story, index) => <article className="community-story" key={`${story.title}-${index}`}>
        <div className="community-story__image"><Image src={story.image} alt={`Ambiance ${story.title.toLowerCase()}`} fill sizes="(max-width: 720px) 82vw, 340px" style={{objectFit:'cover'}}/><span>{story.title}</span><Link href={story.href} aria-label={`Découvrir ${story.title}`}><ArrowUpRight/></Link></div>
        <div className="community-story__copy"><p>“{story.quote}”</p><div><strong>{story.name}</strong><span>Expérience partagée</span></div></div>
      </article>)}
      <Link href="/contact?type=temoignage" className="community-stories__more"><span>PLUS D’AVIS<br/>DE LA COMMUNAUTÉ</span><ArrowRight size={36}/><small>Partagez aussi votre expérience</small></Link>
    </div>
  </section>;
}
