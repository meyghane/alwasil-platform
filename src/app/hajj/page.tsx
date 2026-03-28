'use client';

import { useState } from 'react';
import { Plane, ExternalLink, Search, Star, MapPin, CheckCircle, XCircle, Phone, Globe, Users } from 'lucide-react';
import {
  hajjAgences, hajjPackages,
  VOYAGE_TYPE_LABELS, VOYAGE_TYPE_COLORS,
  type VoyageType, type StarRating, type DepartCity,
} from '@/data/hajj';

type Tab = 'packages' | 'agences' | 'guide';

const TABS: { key: Tab; label: string }[] = [
  { key: 'packages', label: '🕋 Comparer les offres' },
  { key: 'agences', label: '🏢 Agences de confiance' },
  { key: 'guide', label: '📋 Guide du pèlerin' },
];

const TYPE_FILTERS: { key: VoyageType | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Tous' },
  { key: 'hajj', label: '🕋 Hajj 2026' },
  { key: 'omra-ramadan', label: '🌙 Omra Ramadan' },
  { key: 'omra-hors-saison', label: '✈️ Omra hors saison' },
  { key: 'omra-express', label: '⚡ Omra Express' },
];

const DEPART_CITIES: (DepartCity | 'Tous')[] = ['Tous', 'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'];

const STAR_FILTERS: { key: StarRating | 0; label: string }[] = [
  { key: 0, label: '⭐ Tous' },
  { key: 5, label: '5★' },
  { key: 4, label: '4★' },
  { key: 3, label: '3★' },
];

const BUDGET_FILTERS: { key: string; label: string; min: number; max: number }[] = [
  { key: 'all', label: '💰 Tous budgets', min: 0, max: Infinity },
  { key: '-1500', label: '< 1 500€', min: 0, max: 1500 },
  { key: '1500-3000', label: '1 500–3 000€', min: 1500, max: 3000 },
  { key: '3000-6000', label: '3 000–6 000€', min: 3000, max: 6000 },
  { key: '6000+', label: '6 000€+', min: 6000, max: Infinity },
];

function StarsDisplay({ count }: { count: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function AgenceNameById({ id }: { id: string }) {
  const agence = hajjAgences.find(a => a.id === id);
  return <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{agence?.name ?? '—'}</span>;
}

export default function HajjPage() {
  const [tab, setTab] = useState<Tab>('packages');
  const [typeFilter, setTypeFilter] = useState<VoyageType | 'all'>('all');
  const [starsFilter, setStarsFilter] = useState<StarRating | 0>(0);
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [departFilter, setDepartFilter] = useState<DepartCity | 'Tous'>('Tous');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const budgetObj = BUDGET_FILTERS.find(b => b.key === budgetFilter) ?? BUDGET_FILTERS[0];

  const filteredPackages = hajjPackages.filter(p => {
    const q = search.toLowerCase();
    return (typeFilter === 'all' || p.type === typeFilter) &&
      (starsFilter === 0 || p.stars === starsFilter) &&
      (p.price >= budgetObj.min && p.price <= budgetObj.max) &&
      (departFilter === 'Tous' || p.departCities.includes(departFilter as DepartCity)) &&
      (!q || p.name.toLowerCase().includes(q) || (hajjAgences.find(a => a.id === p.agenceId)?.name.toLowerCase() ?? '').includes(q));
  });

  // Sort: featured first
  const sorted = [...filteredPackages].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Plane size={28} color="#059669" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Hajj & Omra — الحج والعمرة</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Comparez les offres d&apos;agences de confiance, trouvez le package qui vous correspond et préparez votre voyage spirituel.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '0.75rem 1.25rem', border: 'none', borderBottom: tab === t.key ? '2px solid #059669' : '2px solid transparent', backgroundColor: 'transparent', color: tab === t.key ? '#059669' : 'var(--text-secondary)', fontWeight: tab === t.key ? 700 : 400, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '-2px', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── COMPARATEUR PACKAGES ─── */}
      {tab === 'packages' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            {TYPE_FILTERS.map(f => {
              const color = f.key !== 'all' ? VOYAGE_TYPE_COLORS[f.key] : '#059669';
              const isActive = typeFilter === f.key;
              return (
                <button key={f.key} onClick={() => setTypeFilter(f.key)}
                  style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? color : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {f.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem', alignItems: 'center' }}>
            {/* Étoiles */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {STAR_FILTERS.map(f => (
                <button key={f.key} onClick={() => setStarsFilter(f.key)}
                  style={{ padding: '0.3rem 0.7rem', borderRadius: '6px', border: starsFilter === f.key ? '2px solid #f59e0b' : '1.5px solid var(--border-color)', backgroundColor: starsFilter === f.key ? '#fffbeb' : 'transparent', color: starsFilter === f.key ? '#b45309' : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: starsFilter === f.key ? 700 : 400, cursor: 'pointer' }}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Budget */}
            <select value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-primary)', backgroundColor: 'white', cursor: 'pointer', outline: 'none' }}>
              {BUDGET_FILTERS.map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
            </select>

            {/* Ville départ */}
            <select value={departFilter} onChange={e => setDepartFilter(e.target.value as DepartCity | 'Tous')}
              style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-primary)', backgroundColor: 'white', cursor: 'pointer', outline: 'none' }}>
              {DEPART_CITIES.map(c => <option key={c} value={c}>✈️ {c}</option>)}
            </select>

            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Chercher..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.4rem 0.75rem 0.4rem 2rem', borderRadius: '6px', border: '1.5px solid var(--border-color)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> offre{sorted.length > 1 ? 's' : ''} trouvée{sorted.length > 1 ? 's' : ''}
          </p>

          {/* Package cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {sorted.map(pkg => {
              const typeColor = VOYAGE_TYPE_COLORS[pkg.type];
              const agence = hajjAgences.find(a => a.id === pkg.agenceId);
              const placesRatio = pkg.placesRestantes && pkg.places ? pkg.placesRestantes / pkg.places : 1;
              return (
                <div key={pkg.id} className="card" style={{ padding: 0, overflow: 'hidden', borderTop: `3px solid ${typeColor}` }}>
                  {/* Top */}
                  <div style={{ padding: '1.25rem 1.25rem 0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div>
                        <span style={{ backgroundColor: `${typeColor}18`, color: typeColor, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {VOYAGE_TYPE_LABELS[pkg.type]}
                        </span>
                        {pkg.featured && (
                          <span style={{ marginLeft: '0.35rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                            ⭐ Mis en avant
                          </span>
                        )}
                      </div>
                      <StarsDisplay count={pkg.stars} />
                    </div>

                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.2 }}>{pkg.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      par <AgenceNameById id={pkg.agenceId} />
                      {agence?.agrée && <span style={{ marginLeft: '0.4rem', fontSize: '0.68rem', backgroundColor: '#d1fae5', color: '#065f46', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>✅ Agréé</span>}
                    </p>

                    {/* Prix */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: typeColor }}>
                        {pkg.price.toLocaleString('fr-FR')}€
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ personne</span>
                      {pkg.priceDouble && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                          ({pkg.priceDouble.toLocaleString('fr-FR')}€ en double)
                        </span>
                      )}
                    </div>

                    {pkg.promo && (
                      <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                        {pkg.promo}
                      </div>
                    )}

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{pkg.description}</p>

                    {/* Infos clés */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.875rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>📅 {pkg.duration} jours</span>
                      <span>✈️ {pkg.departCities.join(', ')}</span>
                      {pkg.distanceMasjidHaram && <span>🕋 {pkg.distanceMasjidHaram}m du Haram</span>}
                      {pkg.distanceMasjidNabawi && <span>🌿 {pkg.distanceMasjidNabawi}m du Nabawi</span>}
                      {pkg.departure && <span>🗓️ {pkg.departure}</span>}
                      {pkg.hotelMakkah && <span>🏨 {pkg.hotelMakkah.length > 22 ? pkg.hotelMakkah.slice(0, 22) + '…' : pkg.hotelMakkah}</span>}
                    </div>
                  </div>

                  {/* Includes/Excludes */}
                  <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafaf9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                      {pkg.includes.slice(0, 6).map(inc => (
                        <div key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem', fontSize: '0.72rem', color: '#065f46' }}>
                          <CheckCircle size={11} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{inc}</span>
                        </div>
                      ))}
                      {pkg.excludes.slice(0, 2).map(exc => (
                        <div key={exc} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem', fontSize: '0.72rem', color: '#7f1d1d' }}>
                          <XCircle size={11} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{exc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '0.875rem 1.25rem' }}>
                    {pkg.placesRestantes !== undefined && pkg.places && (
                      <div style={{ marginBottom: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Users size={11} /> {pkg.placesRestantes} places restantes
                          </span>
                          <span>{pkg.places - pkg.placesRestantes}/{pkg.places} réservées</span>
                        </div>
                        <div style={{ height: '5px', backgroundColor: '#f5f5f4', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(1 - placesRatio) * 100}%`, backgroundColor: placesRatio < 0.2 ? '#ef4444' : typeColor, borderRadius: '999px' }} />
                        </div>
                        {placesRatio < 0.2 && (
                          <p style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginTop: '0.25rem' }}>⚠️ Dernières places !</p>
                        )}
                      </div>
                    )}

                    <a href="/contact?type=hajj-devis" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: typeColor, color: 'white', padding: '0.6rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                      Demander un devis <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {sorted.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Plane size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Aucune offre ne correspond à vos critères.</p>
            </div>
          )}
        </>
      )}

      {/* ─── AGENCES ─── */}
      {tab === 'agences' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {hajjAgences.map(a => (
              <div key={a.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                    {a.logoEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{a.name}</h3>
                      {a.agrée && <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>✅ Agréé</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', color: '#f59e0b' }}>
                        <Star size={13} fill="#f59e0b" />
                        <strong style={{ color: 'var(--text-primary)' }}>{a.rating}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}>({a.reviews.toLocaleString('fr-FR')} avis)</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>depuis {a.since}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      <MapPin size={10} style={{ display: 'inline' }} /> {a.location}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.875rem' }}>{a.description}</p>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {a.tags.map(tag => (
                    <span key={tag} style={{ backgroundColor: '#f0fdf4', color: '#059669', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>#{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {a.website && (
                    <a href={a.website} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', backgroundColor: '#059669', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                      <Globe size={14} /> Visiter <ExternalLink size={12} />
                    </a>
                  )}
                  {a.phone && (
                    <a href={`tel:${a.phone}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                      <Phone size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── GUIDE DU PÈLERIN ─── */}
      {tab === 'guide' && (
        <div style={{ maxWidth: '720px' }}>
          {[
            {
              icon: '📋',
              title: 'Documents obligatoires',
              color: '#0ea5e9',
              items: [
                'Passeport valide (min. 6 mois après le retour)',
                'Visa Hajj ou Omra (obtenu via votre agence)',
                'Vaccin méningite ACWY (obligatoire)',
                'Vaccin COVID selon conditions en vigueur',
                'Assurance voyage internationale',
                'Acte de mariage (pour les couples)',
                'Mahram obligatoire pour les femmes (Hajj)',
              ],
            },
            {
              icon: '💰',
              title: 'Budget à prévoir (en plus du package)',
              color: '#f59e0b',
              items: [
                'Vaccins : 50–100€',
                'Ihram (2 pièces) : 20–50€',
                'Argent de poche (Makkah/Madinah) : 300–500€',
                'Sacrifices/Udhiyya si non inclus : 100–150€',
                'Cadeaux/souvenirs : selon budget',
                'Médicaments (anti-douleur, antidiarrhéique) : 30€',
              ],
            },
            {
              icon: '📅',
              title: 'Calendrier — Hajj 2026',
              color: '#059669',
              items: [
                '8 Dhul Hijja : Départ vers Mina (Yawm al-Tarwiyah)',
                '9 Dhul Hijja : Arafat — Le jour le plus important du Hajj',
                '10 Dhul Hijja : Muzdalifah, lapidation, sacrifice, tawaf',
                '11–12 Dhul Hijja : Jours de Tachrik (nuit à Mina)',
                '13 Dhul Hijja : Départ progressif',
                '📌 Dates estimées 2026 : 5–10 juin 2026 (à confirmer)',
              ],
            },
            {
              icon: '🧳',
              title: 'Essentiels à emporter',
              color: '#8b5cf6',
              items: [
                'Ihram (hommes) ou vêtements couvrants (femmes)',
                'Chaussures légères/sandales pour le Haram',
                'Spray eau de ZamZam pour la chaleur',
                'Ventilateur portable (été = 40°C+)',
                'Poche de prière (tapis léger)',
                'Chapelet (subha)',
                'Livre de doua\' du Hajj/Omra',
                'Médicaments personnels x2 (réserve)',
              ],
            },
            {
              icon: '⚠️',
              title: 'Erreurs fréquentes à éviter',
              color: '#ef4444',
              items: [
                'Choisir uniquement sur le prix sans vérifier l\'agrément',
                'Partir sans apprendre les rites du Hajj/Omra',
                'Ne pas prendre d\'assurance voyage',
                'Oublier les vaccins obligatoires (refus à l\'aéroport)',
                'Emporter trop de bagages (chaleur + déplacements fréquents)',
                'Négliger sa santé avant le départ (bilan médical conseillé)',
              ],
            },
          ].map(section => (
            <div key={section.title} className="card" style={{ marginBottom: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: section.color }}>
                <span style={{ fontSize: '1.35rem' }}>{section.icon}</span>
                {section.title}
              </h3>
              <ul style={{ paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: section.color, flexShrink: 0, marginTop: '2px' }}>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
