import { getEvents } from '@/lib/db-queries';
import EventsClient from './EventsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Événements musulmans en France | Al-Wasil',
  description: 'Découvrez des événements, rencontres et cours proposés par des organisateurs musulmans en France. Filtrez par date, ville et format.',
  alternates: { canonical: 'https://al-wasil.fr/events' },
  openGraph: { title: 'Événements musulmans en France | Al-Wasil', description: 'Rencontres, cours et événements par date, ville et format.', url: 'https://al-wasil.fr/events', type: 'website' },
};

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
