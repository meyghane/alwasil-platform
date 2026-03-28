'use client';

import { useState } from 'react';
import { TrendingUp, Eye, MousePointer, Users, BarChart2, Mail, CheckCircle, Star, ExternalLink } from 'lucide-react';

const ACCENT = '#0d9488';

type Format = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  dimensions?: string;
  placement: string;
  price: string;
  pricePeriod: string;
  audience: string;
  cta: string;
  featured?: boolean;
};

const FORMATS: Format[] = [
  {
    id: 'banniere-header',
    name: 'Bannière Header',
    emoji: '📌',
    description: 'Emplacement premium en haut de page, visible immédiatement à l\'ouverture du site. Maximum de visibilité.',
    dimensions: '970×90px (leaderboard)',
    placement: 'En-tête de toutes les pages',
    price: '350€',
    pricePeriod: '/ mois',
    audience: 'Tous les visiteurs du site',
    cta: 'Réserver',
    featured: true,
  },
  {
    id: 'fiche-mise-en-avant',
    name: 'Fiche Mise en Avant',
    emoji: '⭐',
    description: 'Votre librairie, cabinet, agence Hajj ou service apparaît en premier dans sa catégorie avec un badge "Sponsorisé" discret.',
    placement: 'En tête de liste dans la section correspondante',
    price: '80€',
    pricePeriod: '/ mois',
    audience: 'Visiteurs de la section ciblée',
    cta: 'Mettre en avant',
    featured: false,
  },
  {
    id: 'article-sponsorise',
    name: 'Article Sponsorisé',
    emoji: '✍️',
    description: 'Un article dédié à votre marque, produit ou service, rédigé par Al-Wasil ou fourni par vous. Indexé sur Google et visible durablement.',
    placement: 'Blog / section actualités',
    price: '300€',
    pricePeriod: 'one-shot',
    audience: 'Trafic organique Google + visiteurs fidèles',
    cta: 'Publier un article',
    featured: false,
  },
  {
    id: 'banniere-sidebar',
    name: 'Bannière Sidebar',
    emoji: '📊',
    description: 'Bannière carrée dans la colonne latérale des pages les plus visitées (Emploi, Santé, Solidarité).',
    dimensions: '300×250px (Medium Rectangle)',
    placement: 'Sidebar pages Emploi, Santé, Solidarité',
    price: '200€',
    pricePeriod: '/ mois',
    audience: 'Visiteurs des pages à forte intention',
    cta: 'Réserver',
    featured: false,
  },
  {
    id: 'newsletter',
    name: 'Sponsoring Newsletter',
    emoji: '📬',
    description: 'Votre marque ou produit présentée dans notre newsletter mensuelle envoyée à nos abonnés actifs.',
    placement: 'Newsletter mensuelle (bandeau sponsorisé)',
    price: '150€',
    pricePeriod: '/ envoi',
    audience: 'Abonnés newsletter (base email qualifiée)',
    cta: 'Sponsoriser',
    featured: false,
  },
  {
    id: 'pack-visibilite',
    name: 'Pack Visibilité 3 mois',
    emoji: '🚀',
    description: 'Bannière header + fiche mise en avant + 1 article sponsorisé. Le pack idéal pour lancer une campagne et installer votre marque durablement.',
    placement: 'Multi-placements',
    price: '750€',
    pricePeriod: '(économie de 30%)',
    audience: 'Ensemble des visiteurs',
    cta: 'Demander ce pack',
    featured: true,
  },
];

const ANNONCEURS_CIBLES = [
  { emoji: '🕋', type: 'Agences Hajj & Omra', desc: 'Visibilité maximale avant la saison Hajj et pendant Ramadan' },
  { emoji: '📚', type: 'Librairies islamiques', desc: 'Toucher les amateurs de livres de la communauté en IDF et France' },
  { emoji: '🩸', type: 'Praticiens hijama & bien-être', desc: 'Se faire connaître localement avec une fiche sponsorisée' },
  { emoji: '🧕', type: 'Marques modest fashion', desc: 'Abaya, hijab, vêtements islamiques — audience cible directe' },
  { emoji: '🌹', type: 'Parfums & huiles sunnah', desc: 'Oud, huile de nigelle, musc — audience 100% qualifiée' },
  { emoji: '💼', type: 'Cabinets & entreprises', desc: 'Recruteurs cherchant des profils muslim-friendly' },
  { emoji: '🤲', type: 'Associations & ONG', desc: 'Campagnes de collecte de dons, Ramadan, urgences' },
  { emoji: '🏫', type: 'Écoles & instituts islamiques', desc: 'Rentrée, inscriptions, cours d\'arabe en ligne' },
];

export default function AnnonceursPage() {
  const [formData, setFormData] = useState({ nom: '', email: '', organisation: '', format: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: intégrer un service d'envoi d'email (Resend, EmailJS, etc.)
    setSent(true);
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1100px' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: `${ACCENT}12`, color: ACCENT, padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          <TrendingUp size={14} /> Annoncez sur Al-Wasil
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Touchez la communauté musulmane française là où elle s&apos;informe
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Al-Wasil est la plateforme de référence pour les musulmans de France. Emploi, santé, éducation, Hajj, librairies…
          Vos annonces atteignent une audience <strong>100% qualifiée et engagée</strong>.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { icon: <Users size={22} color={ACCENT} />, value: '12 000+', label: 'Visiteurs/mois', sub: 'en croissance' },
          { icon: <Eye size={22} color='#8b5cf6' />, value: '45 000+', label: 'Pages vues/mois', sub: 'audience engagée' },
          { icon: <MousePointer size={22} color='#f59e0b' />, value: '4,2%', label: 'Taux de clic moyen', sub: '(2× la moyenne web)' },
          { icon: <BarChart2 size={22} color='#ef4444' />, value: '8 sections', label: 'Thématiques ciblées', sub: 'Hajj, Emploi, Santé…' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{s.icon}</div>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0.25rem 0 0.1rem' }}>{s.label}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Audience cible */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Qui sont nos visiteurs ?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Une audience musulmane active, en France principalement, cherchant des ressources concrètes pour leur quotidien.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.875rem' }}>
          {[
            { label: 'Femmes', value: '62%', color: '#ec4899' },
            { label: 'Paris & IdF', value: '68%', color: ACCENT },
            { label: '18–35 ans', value: '71%', color: '#8b5cf6' },
            { label: 'Visite hebdo', value: '54%', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pour qui */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Idéal pour</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {ANNONCEURS_CIBLES.map(a => (
            <div key={a.type} style={{ display: 'flex', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'white', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{a.emoji}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{a.type}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formats & Tarifs */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>Formats & Tarifs</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Tous les emplacements sont réservés <strong>exclusivement à des annonceurs Muslim-friendly</strong>. Nous sélectionnons chaque annonceur.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {FORMATS.map(f => (
            <div key={f.id} className="card" style={{ padding: '1.25rem', borderTop: f.featured ? `3px solid ${ACCENT}` : undefined, position: 'relative' }}>
              {f.featured && (
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: ACCENT, color: 'white', padding: '0.15rem 0.55rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                  ⭐ Populaire
                </span>
              )}
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.emoji}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{f.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.875rem' }}>{f.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <span>📍 {f.placement}</span>
                {f.dimensions && <span>📐 {f.dimensions}</span>}
                <span>👥 {f.audience}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: ACCENT }}>{f.price}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>{f.pricePeriod}</span>
                </div>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, format: f.name }));
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ backgroundColor: ACCENT, color: 'white', border: 'none', padding: '0.45rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  {f.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking & Pixels */}
      <div style={{ marginBottom: '3rem', padding: '1.75rem', borderRadius: '1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={20} color={ACCENT} /> Reporting & Tracking — Vous avez la visibilité complète
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {[
            { icon: '👁️', label: 'Impressions', desc: 'Nombre de fois que votre pub a été vue' },
            { icon: '🖱️', label: 'Clics (CTR)', desc: 'Taux de clic sur votre bannière ou fiche' },
            { icon: '📅', label: 'Dashboard mensuel', desc: 'Rapport PDF envoyé chaque mois par email' },
            { icon: '🔗', label: 'UTM tracking', desc: 'Lien tracké pour suivre le trafic dans votre GA4' },
            { icon: '📊', label: 'A/B Test créa', desc: 'Testez 2 visuels pour maximiser votre CTR' },
            { icon: '🎯', label: 'Ciblage par section', desc: 'Votre pub visible uniquement sur la section pertinente' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.15rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement influenceurs */}
      <div style={{ marginBottom: '3rem', padding: '1.75rem', borderRadius: '1rem', background: `linear-gradient(135deg, ${ACCENT}08 0%, #8b5cf608 100%)`, border: `1px solid ${ACCENT}20` }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '2.5rem' }}>🤝</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Partenariats & échanges de visibilité</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Tu es un influenceur, une marque ou une association avec une large audience ? On peut faire un échange gagnant-gagnant :
              <strong> tu promeus Al-Wasil, on te donne de la visibilité sur le site</strong> (bannière, article, fiche premium).
              Chaque pub sur Al-Wasil rapporte aussi des <em>hasanat</em> pour toi — en aidant la communauté à trouver des ressources.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>📸 Partenariat contenu</span>
              <span style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6', padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>🎥 Story / reel sponsorisé</span>
              <span style={{ backgroundColor: '#f59e0b15', color: '#d97706', padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>💚 Échange de visibilité</span>
              <span style={{ backgroundColor: '#ef444415', color: '#dc2626', padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>📦 Abonnement mensuel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div id="contact-form" style={{ maxWidth: '620px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={22} color={ACCENT} /> Contactez-nous
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Réponse sous 24h ouvrées. Nous étudions toutes les demandes d&apos;annonceurs.
        </p>

        {sent ? (
          <div style={{ padding: '2rem', borderRadius: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <CheckCircle size={36} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Message reçu 🎉</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nous revenons vers vous sous 24h. Barak Allahou fikoum !</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Nom / Prénom *</label>
                <input required type="text" value={formData.nom} onChange={e => setFormData(p => ({ ...p, nom: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Marque / Organisation</label>
              <input type="text" value={formData.organisation} onChange={e => setFormData(p => ({ ...p, organisation: e.target.value }))}
                placeholder="Ex: Hermood, Al-Aman Voyages…"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Format souhaité</label>
              <select value={formData.format} onChange={e => setFormData(p => ({ ...p, format: e.target.value }))}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}>
                <option value="">-- Choisir un format --</option>
                {FORMATS.map(f => <option key={f.id} value={f.name}>{f.name} — {f.price}</option>)}
                <option value="partenariat">Partenariat / Échange de visibilité</option>
                <option value="autre">Autre (précisez)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Message *</label>
              <textarea required rows={4} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                placeholder="Décrivez votre produit/service, vos objectifs, votre budget indicatif…"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
              Envoyer ma demande →
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Tous les annonceurs sont soumis à validation. Nous refusons tout contenu contraire aux valeurs islamiques.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
