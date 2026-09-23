import { getRaw } from '@/lib/db-queries';
import type { Mosquee, PiscineSheet } from '@/lib/sheets';
const list = (value: unknown): string[] => Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
const text = (value: unknown) => typeof value === 'string' ? value : '';
export async function getPublicMosques(): Promise<Mosquee[]> {
  const records = await getRaw<Record<string,unknown>>('institute','institut');
  return records.filter(raw=>raw.type==='mosquee').map(raw=>({
    id_osm:text(raw.id),nom:text(raw.name || raw.title),adresse:text(raw.address),ville:text(raw.city),code_postal:text(raw.postalCode),departement:text(raw.department),territoire:text(raw.territoire),
    latitude:Number(raw.latitude)||0,longitude:Number(raw.longitude)||0,website:text(raw.website),telephone:text(raw.phone),horaires:text(raw.horaires),instagram:text(raw.instagram),facebook:text(raw.facebook),
    has_courses:list(raw.courses).length>0,cours_types:list(raw.courses),cours_audience:list(raw.audience),cours_format:list(raw.format).join(', '),cours_description:text(raw.description),cours_verified:raw.verified===true,
  }));
}
export async function getPublicPools(): Promise<PiscineSheet[]> {
  const records = await getRaw<Record<string,unknown>>('pool','piscine');
  return records.filter(raw=>['municipale','privee','associative'].includes(text(raw.type))).map(raw=>({
    id:text(raw.id),name:text(raw.name || raw.title),type:raw.type as PiscineSheet['type'],adresse:text(raw.adresse || raw.address),ville:text(raw.ville || raw.city),department:text(raw.department),
    creneaux:Array.isArray(raw.creneaux) ? raw.creneaux.filter((entry): entry is { jour:string;horaire:string }=>!!entry && typeof entry==='object' && typeof entry.jour==='string' && typeof entry.horaire==='string') : [],tarif:text(raw.tarif),phone:text(raw.phone),website:text(raw.website),maps:text(raw.maps),description:text(raw.description),confirmed:raw.confirmed===true,
    lastVerified:text(raw.lastVerified || raw.lastVerifiedAt),tags:list(raw.tags),note:text(raw.note),active:true,
  }));
}
