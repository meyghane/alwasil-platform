import { getEvents } from '@/lib/db-queries';
import EventsClient from './EventsClient';

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
