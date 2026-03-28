'use client';

import { useState } from 'react';
import { ShieldCheck, ExternalLink, Search, ChevronDown, ChevronUp, AlertTriangle, Scale, FileText, Phone } from 'lucide-react';

// ============================================================
// TYPES
// ============================================================
type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  sources?: { label: string; url: string }[];
};

type FaqCategory = 'voile' | 'priere' | 'discrimination' | 'laicite' | 'recours' | 'famille';

type LienUtile = {
  id: string;
  name: string;
  description: string;
  url: string;
  type: 'signalement' | 'juridique' | 'association' | 'officiel';
  emoji: string;
};

// ============================================================
// DONNÉES — FAQ
// ============================================================
const FAQ: FaqItem[] = [
  // Voile
  {
    id: 'voile-travail-prive',
    question: 'Puis-je porter le voile dans le secteur privé ?',
    category: 'voile',
    answer: `Oui, dans le secteur privé, le port du voile est légal et protégé par défaut. Un employeur ne peut l'interdire que par une clause de "neutralité" dans le règlement intérieur, et uniquement si cette restriction est justifiée par la nature du poste (contact direct et régulier avec des clients) et proportionnée à l'objectif visé.

La Cour de Justice de l'Union Européenne (CJUE) et la Cour de Cassation française ont confirmé que l'interdiction du voile ne peut être générale et automatique : elle doit être justifiée au cas par cas.

Si vous avez signé une clause de neutralité, vérifiez qu'elle concerne bien votre poste et qu'elle est proportionnée. En cas de doute, consultez un avocat spécialisé en droit du travail.`,
    sources: [
      { label: 'CJUE — Arrêt Micropole (2017)', url: 'https://curia.europa.eu' },
      { label: 'Cour de Cassation — Soc. 22 nov. 2017', url: 'https://www.legifrance.gouv.fr' },
    ],
  },
  {
    id: 'voile-travail-public',
    question: 'Puis-je porter le voile dans la fonction publique ?',
    category: 'voile',
    answer: `Non. Les agents de la fonction publique (État, collectivités, hôpitaux publics) sont soumis au principe de neutralité religieuse et ne peuvent pas porter de signes religieux ostensibles dans l'exercice de leurs fonctions.

Cette règle s'applique à tous les agents en contact ou non avec le public. Elle découle de la loi du 13 juillet 1983 (article 25) et de la jurisprudence du Conseil d'État.

Exception : les entreprises publiques à caractère commercial (comme La Poste ou SNCF) sont soumises aux mêmes règles que le privé.`,
    sources: [
      { label: 'Loi n°83-634 du 13 juillet 1983', url: 'https://www.legifrance.gouv.fr' },
      { label: 'Circulaire DGT 2013-11', url: 'https://www.legifrance.gouv.fr' },
    ],
  },
  {
    id: 'voile-etudiant',
    question: 'Puis-je porter le voile à l\'université ?',
    category: 'voile',
    answer: `Oui, absolument. La loi du 15 mars 2004 qui interdit les signes religieux ostensibles ne s'applique qu'aux écoles, collèges et lycées publics — pas aux universités.

Les étudiantes à l'université et dans les grandes écoles publiques ont le droit de porter le voile. Un règlement intérieur ne peut pas l'interdire dans l'espace universitaire commun.

En revanche, lors des examens, certaines règles spécifiques peuvent s'appliquer pour la vérification d'identité.`,
    sources: [
      { label: 'Loi n°2004-228 du 15 mars 2004', url: 'https://www.legifrance.gouv.fr' },
    ],
  },
  {
    id: 'voile-client',
    question: 'Peut-on me refuser un service à cause de mon voile ?',
    category: 'voile',
    answer: `Non. Refuser un service (restaurant, commerce, administration) à une personne en raison de sa religion constitue une discrimination religieuse, punie par le Code pénal (art. 225-1 et suivants) jusqu'à 3 ans d'emprisonnement et 45 000€ d'amende.

Si cela vous arrive : notez la date, l'heure, le lieu, le nom de l'établissement et les témoins éventuels. Vous pouvez saisir le Défenseur des Droits ou porter plainte.`,
    sources: [
      { label: 'Code pénal — Art. 225-1 à 225-3', url: 'https://www.legifrance.gouv.fr' },
      { label: 'Défenseur des Droits', url: 'https://www.defenseurdesdroits.fr' },
    ],
  },
  // Prière
  {
    id: 'priere-travail',
    question: 'Ai-je droit à un espace de prière au travail ?',
    category: 'priere',
    answer: `La loi ne crée pas d'obligation pour l'employeur de prévoir un espace de prière. Cependant, rien ne l'interdit non plus.

Dans la pratique : certains employeurs accordent des pauses ou aménagements à titre de tolérance. Le refus catégorique d'une telle demande peut, selon les circonstances, être qualifié de discrimination religieuse.

La négociation directe et courtoise avec votre employeur est la première étape. Plusieurs entreprises (Microsoft, Renault, Orange, etc.) ont mis en place des salles de prière dans leurs locaux.`,
    sources: [
      { label: 'Code du travail — Art. L1132-1', url: 'https://www.legifrance.gouv.fr' },
    ],
  },
  {
    id: 'priere-heure-ramadan',
    question: 'Puis-je demander un aménagement d\'horaires pour la prière ou le Ramadan ?',
    category: 'priere',
    answer: `Vous pouvez en faire la demande, mais l'employeur n'est pas légalement tenu d'accepter si cela perturbe l'organisation du travail.

Cependant, refuser systématiquement toute demande d'aménagement religieux peut constituer une discrimination indirecte. L'employeur doit au moins examiner la demande et justifier son refus.

Pour le Ramadan : vous pouvez demander à décaler vos horaires, à poser des congés, ou à télétravailler si votre poste le permet. La plupart des employeurs de bonne foi accèdent à ces demandes.`,
  },
  // Discrimination
  {
    id: 'discrimination-embauche',
    question: 'Comment prouver une discrimination à l\'embauche ?',
    category: 'discrimination',
    answer: `La discrimination à l'embauche en raison de la religion est interdite par l'article L1132-1 du Code du travail. La preuve est difficile mais pas impossible.

Méthodes de preuve reconnues :
• Le testing (CV avec et sans patronyme/photo, envoyés pour le même poste) : accepté par les tribunaux
• Les témoignages directs ou indirects
• Les statistiques comparatives (si vous pouvez les obtenir)
• Les incohérences dans les justifications de refus

Le Défenseur des Droits peut vous accompagner gratuitement dans la constitution de votre dossier.`,
    sources: [
      { label: 'Code du travail — Art. L1132-1', url: 'https://www.legifrance.gouv.fr' },
      { label: 'Défenseur des Droits', url: 'https://www.defenseurdesdroits.fr' },
    ],
  },
  {
    id: 'islamophobie-media',
    question: 'Comment signaler des propos islamophobes dans les médias ?',
    category: 'discrimination',
    answer: `Plusieurs voies de signalement existent :

1. **ARCOM (ex-CSA)** : pour les propos tenus à la télévision ou à la radio. Signalement en ligne sur arcom.fr. L'ARCOM peut sanctionner les chaînes.

2. **Presse écrite** : vous pouvez saisir la Commission de la carte de presse (CCIJP) ou porter plainte pour provocation à la haine raciale (Loi Pleven, art. 24 de la loi 1881).

3. **Réseaux sociaux** : signalement directement sur la plateforme + signalement au Parquet via PHAROS (plateforme gouvernementale).

4. **CCIF (Collectif contre l'Islamophobie)** : documentation et suivi des actes islamophobes.

Pour un impact maximal, signalez collectivement : une mobilisation de 1 000 signalements ARCOM sur le même sujet a beaucoup plus de poids qu'un signalement isolé.`,
    sources: [
      { label: 'Signalement ARCOM', url: 'https://www.arcom.fr/nous-contacter/adresser-une-plainte' },
      { label: 'PHAROS — Signalement internet', url: 'https://www.internet-signalement.gouv.fr' },
    ],
  },
  // Laïcité
  {
    id: 'laicite-definition',
    question: 'Qu\'est-ce que la laïcité ? À qui s\'applique-t-elle vraiment ?',
    category: 'laicite',
    answer: `La laïcité française est souvent mal comprise. Voici ce qu'elle dit vraiment :

**La laïcité s'applique à l'État, pas aux citoyens.**

Concrètement :
- L'État ne favorise ni ne pénalise aucune religion
- Les agents publics dans l'exercice de leurs fonctions doivent être neutres
- Les citoyens, eux, ont le droit absolu de pratiquer leur religion, de porter des signes religieux dans l'espace public (hors exceptions légales), de se réunir, de prier, etc.

La loi de 1905 (séparation Église-État) garantit la liberté de conscience et le libre exercice du culte. C'est une loi protectrice, pas une loi qui interdit le religieux dans l'espace public.

Les restrictions légales : lycées publics (loi 2004), fonction publique, certains services judiciaires.`,
    sources: [
      { label: 'Loi de séparation des Églises et de l\'État — 9 déc. 1905', url: 'https://www.legifrance.gouv.fr' },
      { label: 'Observatoire de la Laïcité — Guide pratique', url: 'https://www.gouvernement.fr/la-laicite-dans-la-fonction-publique' },
    ],
  },
  // Recours
  {
    id: 'recours-discrimination',
    question: 'Quelles sont mes voies de recours en cas de discrimination ?',
    category: 'recours',
    answer: `**1. Le Défenseur des Droits (gratuit)**
Saisine en ligne ou en courrier. Il instruit votre dossier, peut demander des explications à l'employeur/organisme concerné et émettre des recommandations. Très efficace pour les discriminations emploi et services.

**2. La plainte pénale**
Pour la discrimination (art. 225-1 Code pénal) ou les propos haineux (Loi Pleven). Dépôt de plainte au commissariat ou directement au Parquet. La charge de la preuve est allégée en matière de discrimination.

**3. Prud'hommes (emploi)**
En cas de discrimination au travail, licenciement abusif ou harcèlement discriminatoire. Délai de prescription : 5 ans à compter des faits.

**4. Tribunal administratif**
Pour les décisions prises par des administrations publiques (refus de permis de construire une mosquée, interdiction arbitraire, etc.).

**5. Associations de défense**
Le CCIF, la LICRA et SOS Racisme peuvent vous accompagner et co-ester en justice dans certains cas.`,
    sources: [
      { label: 'Défenseur des Droits — Saisine', url: 'https://www.defenseurdesdroits.fr/fr/saisir-le-defenseur-des-droits' },
      { label: 'Code pénal — Art. 225-1 à 225-4', url: 'https://www.legifrance.gouv.fr' },
    ],
  },
  // Famille
  {
    id: 'mariage-islam-france',
    question: 'Le mariage islamique est-il reconnu en France ?',
    category: 'famille',
    answer: `Non, le mariage religieux seul n'a aucune valeur juridique en France. Seul le mariage civil célébré en mairie crée des effets légaux (droits successoraux, autorité parentale, protection en cas de séparation).

Le mariage religieux peut être célébré en plus du mariage civil, mais jamais à la place.

Conséquences pratiques si vous n'êtes mariés que religieusement :
- En cas de décès du conjoint : aucun droit à l'héritage automatique
- En cas de séparation : aucune pension alimentaire entre conjoints, pas de partage du patrimoine commun
- Les enfants sont reconnus (si déclarés à la naissance) mais le couple n'a pas de droits l'un envers l'autre

Conseil : si vous avez un mariage religieux sans mariage civil, envisagez au minimum un PACS pour vous protéger mutuellement.`,
  },
];

// ============================================================
// DONNÉES — LIENS UTILES
// ============================================================
const LIENS_UTILES: LienUtile[] = [
  // Signalement
  {
    id: 'arcom',
    name: 'ARCOM — Signalement médias',
    description: 'Signaler des propos islamophobes ou discriminatoires à la télévision ou la radio. Gratuit, en ligne, 5 minutes.',
    url: 'https://www.arcom.fr/nous-contacter/adresser-une-plainte',
    type: 'signalement',
    emoji: '📺',
  },
  {
    id: 'pharos',
    name: 'PHAROS — Signalement Internet',
    description: 'Signaler des contenus haineux, islamophobes ou illicites sur internet. Plateforme gouvernementale officielle.',
    url: 'https://www.internet-signalement.gouv.fr',
    type: 'signalement',
    emoji: '🌐',
  },
  {
    id: 'service-public-discrimination',
    name: 'Service-public.fr — Signalement discrimination',
    description: 'Guide officiel pour signaler une discrimination et connaître ses droits. Toutes situations couvertes.',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F19448',
    type: 'signalement',
    emoji: '🏛️',
  },
  // Juridique
  {
    id: 'defenseur-droits',
    name: 'Défenseur des Droits',
    description: 'Organisme public indépendant. Saisine gratuite pour toute discrimination (emploi, logement, services). Très efficace.',
    url: 'https://www.defenseurdesdroits.fr/fr/saisir-le-defenseur-des-droits',
    type: 'juridique',
    emoji: '⚖️',
  },
  {
    id: 'aide-juridictionnelle',
    name: 'Aide juridictionnelle',
    description: 'Si vos revenus sont modestes, l\'État prend en charge les frais d\'avocat. Simulateur et demande en ligne.',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F18074',
    type: 'juridique',
    emoji: '💼',
  },
  {
    id: 'legifrance',
    name: 'Légifrance — Textes de loi',
    description: 'La source officielle pour tous les textes de loi français. Codes du travail, pénal, civil. Gratuit.',
    url: 'https://www.legifrance.gouv.fr',
    type: 'officiel',
    emoji: '📜',
  },
  // Associations
  {
    id: 'ccif',
    name: 'CCIF — Collectif contre l\'Islamophobie',
    description: 'Observation et documentation des actes islamophobes. Accompagnement juridique des victimes. Rapport annuel.',
    url: 'https://www.islamophobie.net',
    type: 'association',
    emoji: '🛡️',
  },
  {
    id: 'laligue-droits',
    name: 'LDH — Ligue des Droits de l\'Homme',
    description: 'Organisation historique de défense des libertés fondamentales. Sections locales dans toute la France.',
    url: 'https://www.ldh-france.org',
    type: 'association',
    emoji: '🤝',
  },
  {
    id: 'gisti',
    name: 'GISTI — Droits des étrangers',
    description: 'Groupe d\'information et de soutien des immigré·es. Droits des étrangers, titre de séjour, naturalisation.',
    url: 'https://www.gisti.org',
    type: 'association',
    emoji: '📋',
  },
  {
    id: 'cfcm',
    name: 'CFCM — Conseil Français du Culte Musulman',
    description: 'Instance représentative de l\'islam en France. Interlocuteur officiel des pouvoirs publics. Avis, communiqués.',
    url: 'https://www.cfcm-officiel.fr',
    type: 'officiel',
    emoji: '🕌',
  },
  // Officiel
  {
    id: 'service-public-religion',
    name: 'Service-public.fr — Religion et travail',
    description: 'Guide officiel complet sur les droits des salariés en matière de religion : voile, prière, fêtes religieuses.',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F33472',
    type: 'officiel',
    emoji: '📖',
  },
  {
    id: 'arcom-observatoire',
    name: 'ARCOM — Observatoire diversité',
    description: 'Rapports annuels sur la représentation de la diversité dans les médias audiovisuels français.',
    url: 'https://www.arcom.fr/nos-ressources/etudes-et-donnees/notre-mediatheque/bilan-de-la-representation-de-la-diversite',
    type: 'officiel',
    emoji: '📊',
  },
];

// ============================================================
// CATÉGORIES FAQ
// ============================================================
const FAQ_CATS: { key: FaqCategory | 'all'; label: string }[] = [
  { key: 'all', label: '🌐 Tout' },
  { key: 'voile', label: '🧕 Voile & Tenue' },
  { key: 'priere', label: '🕌 Prière & Ramadan' },
  { key: 'discrimination', label: '🚫 Discrimination' },
  { key: 'laicite', label: '⚖️ Laïcité' },
  { key: 'recours', label: '📋 Recours' },
  { key: 'famille', label: '👨‍👩‍👧 Famille' },
];

const LIEN_TYPE_LABELS: Record<string, string> = {
  signalement: '🚨 Signalement',
  juridique: '⚖️ Juridique',
  association: '🤝 Association',
  officiel: '🏛️ Officiel',
};

const LIEN_TYPE_COLORS: Record<string, string> = {
  signalement: '#ef4444',
  juridique: '#8b5cf6',
  association: '#0d9488',
  officiel: '#3b82f6',
};

type MainTab = 'faq' | 'liens' | 'arcom';

export default function JusticePage() {
  const [mainTab, setMainTab] = useState<MainTab>('faq');
  const [faqCat, setFaqCat] = useState<FaqCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [lienType, setLienType] = useState<string>('all');

  const filteredFaq = FAQ.filter(f => {
    const q = search.toLowerCase();
    return (faqCat === 'all' || f.category === faqCat) &&
      (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  });

  const filteredLiens = LIENS_UTILES.filter(l => {
    const q = search.toLowerCase();
    return (lienType === 'all' || l.type === lienType) &&
      (!q || l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  });

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={28} color="#8b5cf6" />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Justice & Droits — Adl (عَدْل)</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Connaître ses droits en France en tant que musulman·e. FAQ claire, liens de signalement et ressources juridiques.
        </p>
      </div>

      {/* Bannière ARCOM */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', backgroundColor: 'rgba(239,68,68,0.07)', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={20} color="#ef4444" />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444', marginBottom: '0.15rem' }}>Islamophobie dans les médias ? Signalez à l'ARCOM.</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Chaque signalement compte. Plus on est nombreux, plus l'impact est fort.</p>
          </div>
        </div>
        <a href="https://www.arcom.fr/nous-contacter/adresser-une-plainte" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ef4444', color: 'white', padding: '0.55rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Signaler maintenant <ExternalLink size={13} />
        </a>
      </div>

      {/* Tabs principaux */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)' }}>
        {([
          { key: 'faq' as MainTab, label: `❓ FAQ (${FAQ.length} questions)` },
          { key: 'liens' as MainTab, label: `🔗 Liens utiles (${LIENS_UTILES.length})` },
          { key: 'arcom' as MainTab, label: '📺 Signalement ARCOM' },
        ]).map(t => (
          <button key={t.key} onClick={() => { setMainTab(t.key); setSearch(''); }}
            style={{
              padding: '0.75rem 1.25rem', border: 'none',
              borderBottom: mainTab === t.key ? '2px solid #8b5cf6' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: mainTab === t.key ? '#8b5cf6' : 'var(--text-secondary)',
              fontWeight: mainTab === t.key ? 700 : 400,
              fontSize: '0.88rem', cursor: 'pointer', marginBottom: '-2px', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Recherche */}
      {mainTab !== 'arcom' && (
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      )}

      {/* ─── FAQ ─── */}
      {mainTab === 'faq' && (
        <>
          {/* Filtres catégories */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {FAQ_CATS.map(cat => {
              const isActive = faqCat === cat.key;
              return (
                <button key={cat.key} onClick={() => setFaqCat(cat.key)}
                  style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? '2px solid #8b5cf6' : '1.5px solid var(--border-color)', backgroundColor: isActive ? '#8b5cf6' : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredFaq.map(f => {
              const isOpen = openFaq === f.id;
              return (
                <div key={f.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : f.id)}
                    style={{ width: '100%', padding: '1.25rem', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'inline-block', backgroundColor: '#f3f0ff', color: '#8b5cf6', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        {FAQ_CATS.find(c => c.key === f.category)?.label ?? f.category}
                      </span>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4, margin: 0, color: 'var(--text-primary)' }}>{f.question}</p>
                    </div>
                    <div style={{ flexShrink: 0, color: '#8b5cf6', marginTop: '0.25rem' }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ paddingTop: '1rem' }}>
                        {f.answer.split('\n').map((line, i) => {
                          if (!line.trim()) return <br key={i} />;
                          const isBold = line.startsWith('**') && line.includes('**');
                          if (isBold) {
                            const parts = line.split('**');
                            return (
                              <p key={i} style={{ fontSize: '0.88rem', lineHeight: 1.65, margin: '0.4rem 0', color: 'var(--text-primary)' }}>
                                {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
                              </p>
                            );
                          }
                          const isBullet = line.startsWith('•') || line.startsWith('-');
                          return (
                            <p key={i} style={{ fontSize: '0.88rem', lineHeight: 1.65, margin: '0.3rem 0', color: 'var(--text-secondary)', paddingLeft: isBullet ? '0.5rem' : 0 }}>
                              {line}
                            </p>
                          );
                        })}
                      </div>

                      {f.sources && f.sources.length > 0 && (
                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.4rem' }}>📚 Sources :</p>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {f.sources.map(s => (
                              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#8b5cf6', backgroundColor: '#f3f0ff', padding: '0.2rem 0.6rem', borderRadius: '4px', textDecoration: 'none' }}>
                                {s.label} <ExternalLink size={10} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFaq.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <Scale size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>Aucune question pour ces filtres.</p>
            </div>
          )}
        </>
      )}

      {/* ─── LIENS UTILES ─── */}
      {mainTab === 'liens' && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { key: 'all', label: '🌐 Tout' },
              { key: 'signalement', label: '🚨 Signalement' },
              { key: 'juridique', label: '⚖️ Juridique' },
              { key: 'association', label: '🤝 Associations' },
              { key: 'officiel', label: '🏛️ Officiel' },
            ].map(t => {
              const color = t.key !== 'all' ? LIEN_TYPE_COLORS[t.key] : '#8b5cf6';
              const isActive = lienType === t.key;
              return (
                <button key={t.key} onClick={() => setLienType(t.key)}
                  style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', border: isActive ? `2px solid ${color}` : '1.5px solid var(--border-color)', backgroundColor: isActive ? color : 'white', color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredLiens.map(l => {
              const color = LIEN_TYPE_COLORS[l.type];
              return (
                <div key={l.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>{l.emoji}</div>
                    <div>
                      <span style={{ display: 'inline-block', backgroundColor: color + '18', color: color, padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                        {LIEN_TYPE_LABELS[l.type]}
                      </span>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{l.name}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem' }}>{l.description}</p>
                  <a href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: color, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
                    Accéder <ExternalLink size={12} />
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ─── GUIDE SIGNALEMENT ARCOM ─── */}
      {mainTab === 'arcom' && (
        <div>
          <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'rgba(139,92,246,0.06)', borderRadius: '0.75rem', border: '1px solid rgba(139,92,246,0.2)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>📺 Pourquoi signaler à l'ARCOM ?</h2>
            <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              L'ARCOM (Autorité de Régulation de la Communication Audiovisuelle et Numérique) régule toutes les chaînes de télévision et radios françaises. Elle peut les <strong>sanctionner financièrement</strong> et les obliger à diffuser un <strong>communiqué de mise en demeure</strong> en cas de manquement.
              <br /><br />
              Un signalement isolé a peu d'impact. Mais une <strong>mobilisation collective de centaines ou milliers de personnes</strong> sur le même sujet force l'ARCOM à agir. C'est un levier de pression légal, gratuit et efficace.
            </p>
          </div>

          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Comment signaler en 3 étapes</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {[
              {
                step: '1',
                title: 'Notez les informations précises',
                content: 'Chaîne ou radio, date et heure de diffusion, nom de l\'émission, et citations exactes des propos tenus. Une capture vidéo ou un enregistrement renforce votre dossier.',
                color: '#ef4444',
              },
              {
                step: '2',
                title: 'Remplissez le formulaire ARCOM',
                content: 'Rendez-vous sur arcom.fr → "Nous contacter" → "Adresser une plainte". Choisissez la catégorie "Discours de haine / Discriminations". Soyez factuel et précis.',
                color: '#f59e0b',
                url: 'https://www.arcom.fr/nous-contacter/adresser-une-plainte',
              },
              {
                step: '3',
                title: 'Partagez et mobilisez',
                content: 'Plus le même signalement est envoyé par de nombreuses personnes, plus l\'ARCOM est contrainte d\'agir. Partagez le lien de signalement dans vos groupes et réseaux.',
                color: '#10b981',
              },
            ].map(s => (
              <div key={s.step} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{s.content}</p>
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.75rem', backgroundColor: s.color, color: 'white', padding: '0.45rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                      Aller sur ARCOM <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>📋 Autres types de signalement</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Propos haineux sur internet', url: 'https://www.internet-signalement.gouv.fr', desc: 'Plateforme PHAROS (Police nationale)' },
                { label: 'Discrimination dans l\'emploi', url: 'https://www.defenseurdesdroits.fr/fr/saisir-le-defenseur-des-droits', desc: 'Défenseur des Droits (gratuit)' },
                { label: 'Acte islamophobe (physique ou verbal)', url: 'https://www.islamophobie.net', desc: 'CCIF — Documentation et suivi' },
                { label: 'Plainte pénale', url: 'https://www.service-public.fr/particuliers/vosdroits/F1435', desc: 'Service-public.fr — Guide dépôt de plainte' },
              ].map(item => (
                <div key={item.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.1rem 0 0' }}>{item.desc}</p>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Accéder <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '1.25rem', backgroundColor: 'rgba(239,68,68,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.15)', textAlign: 'center' }}>
            <FileText size={24} color="#ef4444" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Signalement ARCOM — Accès direct</h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Gardez ce lien en favoris pour signaler rapidement la prochaine fois.
            </p>
            <a href="https://www.arcom.fr/nous-contacter/adresser-une-plainte" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ef4444', color: 'white', padding: '0.65rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>
              Signaler à l'ARCOM <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* CTA bas */}
      <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1rem', backgroundColor: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Vous avez une question juridique non couverte ?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Proposez une question à ajouter dans la FAQ ou prenez contact avec un avocat de confiance.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}>
            Proposer une question
          </button>
          <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noopener noreferrer" className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            Défenseur des droits <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
