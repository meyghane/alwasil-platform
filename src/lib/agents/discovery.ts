import type { Source, AgentCategory } from './contracts';
export const REGION_ZONES = [
  ['75','77','78','91','92','93','94','95'], ['18','28','36','37','41','45'],
  ['21','25','39','58','70','71','89','90'], ['14','27','50','61','76'], ['02','59','60','62','80'],
  ['08','10','51','52','54','55','57','67','68','88'], ['44','49','53','72','85'], ['22','29','35','56'],
  ['16','17','19','23','24','33','40','47','64','79','86','87'], ['09','11','12','30','31','32','34','46','48','65','66','81','82'],
  ['01','03','07','15','26','38','42','43','63','69','73','74'], ['04','05','06','13','83','84'], ['2A','2B'], ['971','972','973','974','976'],
] as const;

export function discoverSources(sources: Source[], categories: readonly AgentCategory[], budget: number, day: number) {
  const zones = [...REGION_ZONES[((day % REGION_ZONES.length) + REGION_ZONES.length) % REGION_ZONES.length]];
  const eligible = sources.filter(s => s.enabled && s.trust === 'trusted' && categories.includes(s.category) && s.departments.some(d => zones.includes(d as never)));
  const selected = eligible.slice(0, Math.max(0, Math.min(budget, 5)));
  return { selected, plannedZones: zones, quotaReached: eligible.length > selected.length,
    uncovered: categories.filter(category => !selected.some(s => s.category === category)).map(category => `${category} : aucune source exécutée dans ${zones.join(', ')}`) };
}
