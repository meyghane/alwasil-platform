import { getPiscines } from '@/lib/sheets';
import { piscines as staticPiscines } from '@/data/piscines';
import PiscinesClient from './PiscinesClient';
import type { PiscineSheet } from '@/lib/sheets';

export default async function PiscinesPage() {
  // Fetch depuis Google Sheets — fallback sur données statiques si erreur
  let data: PiscineSheet[] = await getPiscines();

  if (data.length === 0) {
    // Fallback : convertir les données statiques au format PiscineSheet
    data = staticPiscines.map(p => ({
      id:           p.id,
      name:         p.name,
      type:         p.type,
      adresse:      p.adresse,
      ville:        p.ville,
      department:   p.department,
      creneaux:     p.creneaux,
      tarif:        p.tarif ?? '',
      phone:        p.phone ?? '',
      website:      p.website ?? '',
      maps:         p.maps ?? '',
      description:  p.description,
      confirmed:    p.confirmed,
      lastVerified: p.lastVerified ?? '',
      tags:         p.tags,
      note:         p.note ?? '',
      active:       true,
    }));
  }

  return <PiscinesClient piscines={data} />;
}
