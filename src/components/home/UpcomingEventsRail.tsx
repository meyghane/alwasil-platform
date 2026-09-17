'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import type { EventCategory } from '@/data/events';
import EventCard from './EventCard';

export type UpcomingEventItem = {
  title: string;
  date: string;
  location: string;
  organizer: string;
  tag: string;
  category: EventCategory;
};

export default function UpcomingEventsRail({ events }: { events: UpcomingEventItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  // Le premier événement doit commencer après le panneau, même si le navigateur
  // restaure une ancienne position de défilement lors du retour sur l'accueil.
  useLayoutEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: 'instant' });
  }, []);

  const move = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 344, behavior: 'smooth' });
  };

  return (
    <div className="upcoming-events">
      <aside className="upcoming-events__intro">
        <CalendarDays size={26} strokeWidth={1.7} aria-hidden="true" />
        <div>
          <span>Notre agenda</span>
          <h2>Les événements<br />à venir.</h2>
          <p>Une sélection de rencontres, conférences, ateliers et actions communautaires.</p>
        </div>
        <Link href="/events">Voir tout l’agenda <ArrowRight size={16} /></Link>
      </aside>

      <div ref={railRef} className="upcoming-events__rail" aria-label="Les six prochains événements">
        {events.map(event => <EventCard key={`${event.title}-${event.date}`} {...event} />)}
        <Link href="/events" className="upcoming-events__more">
          <ArrowRight size={36} aria-hidden="true" />
          <strong>Voir plus<br />d’événements</strong>
          <span>Ouvrir tout l’agenda</span>
        </Link>
      </div>

      <div className="upcoming-events__controls" aria-label="Faire défiler les événements">
        <button type="button" onClick={() => move(-1)} aria-label="Événements précédents"><ArrowLeft size={20} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Événements suivants"><ArrowRight size={20} /></button>
        <span>Faire défiler</span>
      </div>
    </div>
  );
}
