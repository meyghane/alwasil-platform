'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const V = '#c9973a';

type Soumission = {
  id: string;
  categorie: string;
  destinationTab: string;
  status: string;
  soumis_le: string;
  soumis_par?: string;
  name?: string;
  titre?: string;
  ville?: string;
  description?: string;
  [key: string]: string | undefined;
};

const STATUS_CONFIG = {
  'à vérifier': { color: '#f59e0b', bg: '#fffbeb', label: 'À vérifier', dot: '🟡' },
  'en ligne':    { color: '#c9973a', bg: '#f0fdf4', label: 'En ligne',   dot: '🟢' },
  'pas en ligne':{ color: '#6b7280', bg: '#f9fafb', label: 'Rejeté',    dot: '⚫' },
};

export default function SoumissionsClient() {
  const [items, setItems] = useState<Soumission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'à vérifier' | 'en ligne' | 'pas en ligne'>('à vérifier');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/soumissions');
      const json = await res.json();
      setItems(json.soumissions || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: 'en ligne' | 'pas en ligne') {
    setActionLoading(id);
    try {
      await fetch('/api/admin/soumissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const pending = items.filter(i => i.status === 'à vérifier').length;

  return (
    <div>
      {/* Filtres */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {(['à vérifier', 'en ligne', 'pas en ligne', 'all'] as const).map(f => {
          const isActive = filter === f;
          const count = f === 'all' ? items.length : items.filter(i => i.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                border: isActive ? `2px solid ${V}` : '1.5px solid #fdfbf0',
                backgroundColor: isActive ? V : 'white',
                color: isActive ? 'white' : '#6b7280',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              }}>
              {f === 'all' ? 'Tout' : f === 'à vérifier' ? 'À vérifier' : f === 'en ligne' ? 'En ligne' : 'Rejeté'}
              <span style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#fdfbf0', color: isActive ? 'white' : V, borderRadius: '20px', padding: '0 6px', fontSize: '0.72rem', fontWeight: 800 }}>{count}</span>
            </button>
          );
        })}

        <button onClick={load} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.875rem', borderRadius: '8px', border: '1px solid #fdfbf0', backgroundColor: 'white', color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer' }}>
          <RefreshCw size={12} /> Rafraîchir
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#a8a29e' }}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem', display: 'block' }} />
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#a8a29e' }}>
          <CheckCircle size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>Aucune soumission {filter !== 'all' ? `"${filter}"` : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(item => {
            const sc = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG['à vérifier'];
            const isExpanded = expanded === item.id;
            const isLoading = actionLoading === item.id;
            const nom = item.name || item.titre || item.nom || '(Sans titre)';

            return (
              <div key={item.id} style={{
                backgroundColor: 'white', borderRadius: '12px',
                border: `1px solid ${item.status === 'à vérifier' ? '#fde68a' : '#fdfbf0'}`,
                overflow: 'hidden',
                boxShadow: item.status === 'à vérifier' ? '0 2px 8px rgba(245,158,11,0.08)' : '0 1px 4px rgba(109,40,217,0.05)',
              }}>
                {/* Row principal */}
                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Status dot */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: sc.color,
                  }} />

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917' }}>{nom}</span>
                      <span style={{ backgroundColor: '#fdfbf0', color: V, padding: '1px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700 }}>
                        {item.categorie}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#a8a29e', marginTop: '2px' }}>
                      {item.ville && <span>{item.ville} · </span>}
                      {item.soumis_le && <span>{new Date(item.soumis_le).toLocaleDateString('fr-FR')} à {new Date(item.soumis_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                    {item.status === 'à vérifier' && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, 'en ligne')}
                          disabled={isLoading}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.875rem', backgroundColor: '#c9973a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
                          <CheckCircle size={13} /> Valider
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'pas en ligne')}
                          disabled={isLoading}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.45rem 0.875rem', backgroundColor: '#fdfbf0', color: '#6b7280', border: '1px solid #fdfbf0', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
                          <XCircle size={13} /> Rejeter
                        </button>
                      </>
                    )}
                    {item.status === 'en ligne' && (
                      <span style={{ fontSize: '0.75rem', color: '#c9973a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={13} /> En ligne
                      </span>
                    )}
                    <button onClick={() => setExpanded(isExpanded ? null : item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e', padding: '0.25rem' }}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Détails dépliables */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #fdfbf0', padding: '1rem 1.25rem', backgroundColor: '#faf9ff' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {Object.entries(item)
                        .filter(([k]) => !['id', 'status', 'soumis_le', 'soumis_par', 'categorie', 'destinationTab', 'sheetTab'].includes(k))
                        .filter(([, v]) => v && v !== '')
                        .map(([k, v]) => (
                          <div key={k} style={{ fontSize: '0.78rem' }}>
                            <span style={{ color: '#a8a29e', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em' }}>{k}</span>
                            <div style={{ color: '#1c1917', marginTop: '1px' }}>{v}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
