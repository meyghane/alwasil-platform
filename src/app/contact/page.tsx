'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Send, ArrowRight } from 'lucide-react';

type FormType =
  | 'initiative' | 'evenement' | 'profil-emploi' | 'offre-emploi'
  | 'cagnotte' | 'librairie' | 'revendiquer-librairie' | 'piscine'
  | 'correction' | 'question-juridique' | 'hajj-devis' | 'avis'
  | 'mosquee' | 'suggestion' | 'annonceur' | 'general';

// ── Catégories du menu déroulant ──────────────────────────────
const SUJET_OPTIONS: { value: string; label: string; redirectTo?: string }[] = [
  // Contenus à soumettre
  { value: 'evenement',             label: '📅 Proposer un événement',          redirectTo: 'evenement' },
  { value: 'cagnotte',              label: '🤲 Proposer une cagnotte',           redirectTo: 'cagnotte' },
  { value: 'initiative',            label: '🍲 Proposer une maraude / initiative', redirectTo: 'initiative' },
  { value: 'offre-emploi',          label: '💼 Publier une offre d\'emploi',     redirectTo: 'offre-emploi' },
  { value: 'profil-emploi',         label: '⭐ Ajouter mon profil (vivier talents)', redirectTo: 'profil-emploi' },
  { value: 'librairie',             label: '📖 Signaler une librairie islamique', redirectTo: 'librairie' },
  { value: 'revendiquer-librairie', label: '🏪 Je gère une librairie référencée', redirectTo: 'revendiquer-librairie' },
  { value: 'piscine',               label: '🏊 Signaler un créneau burkini',     redirectTo: 'piscine' },
  { value: 'hajj-devis',            label: '🕋 Demander un devis Hajj / Omra',   redirectTo: 'hajj-devis' },
  // Corrections & questions
  { value: 'correction',            label: '✏️ Corriger une information erronée', redirectTo: 'correction' },
  { value: 'question-juridique',    label: '⚖️ Proposer une question juridique',  redirectTo: 'question-juridique' },
  // Avis & communauté
  { value: 'avis',      label: '⭐ Laisser un avis sur une ressource' },
  { value: 'mosquee',   label: '🕌 Référencer / corriger une mosquée' },
  // Partenariats
  { value: 'annonceur', label: '📣 Annonce publicitaire / partenariat', redirectTo: 'annonceur' },
  // Divers
  { value: 'suggestion', label: '💡 Suggestion d\'amélioration du site' },
  { value: 'autre',      label: '✉️ Autre (préciser)' },
];

// ── Formulaires spécialisés ───────────────────────────────────
const FORM_CONFIG: Record<FormType, {
  title: string; emoji: string; color: string; description: string;
  fields: { name: string; label: string; type: string; placeholder?: string; required?: boolean; options?: string[] }[];
}> = {
  initiative: {
    title: 'Proposer une initiative solidaire', emoji: '🤲', color: '#ef4444',
    description: 'Maraude, visite de malades, repas solidaire… Décrivez votre initiative et nous la publions gratuitement.',
    fields: [
      { name: 'nom', label: 'Votre nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'titre', label: 'Nom de l\'initiative', type: 'text', placeholder: 'Ex: Maraude Gare du Nord', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['Maraude', 'Visite de malades', 'Repas solidaire', 'Voyage humanitaire', 'Collecte vêtements', 'Autre'], required: true },
      { name: 'ville', label: 'Ville', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'contact', label: 'Lien de contact (WhatsApp, site, etc.)', type: 'text' },
    ],
  },
  evenement: {
    title: 'Proposer un événement', emoji: '📅', color: '#d97706',
    description: 'Conférence, séminaire, porte ouverte… Soumettez votre événement pour qu\'il apparaisse sur Al-Wasil.',
    fields: [
      { name: 'nom', label: 'Votre nom / Organisation', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'titre', label: 'Titre de l\'événement', type: 'text', required: true },
      { name: 'date', label: 'Date et heure', type: 'text', placeholder: 'Ex: Samedi 15 avril à 14h', required: true },
      { name: 'lieu', label: 'Lieu', type: 'text', placeholder: 'Ex: Grande Mosquée de Paris / En ligne', required: true },
      { name: 'lien', label: 'Lien d\'inscription ou d\'info', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  'profil-emploi': {
    title: 'Ajouter mon profil au vivier', emoji: '⭐', color: '#2563eb',
    description: 'Rejoignez le vivier de talents de la communauté. Votre profil sera visible des recruteurs.',
    fields: [
      { name: 'nom', label: 'Prénom + initiale du nom (ex: Aicha B.)', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Poste / Métier', type: 'text', placeholder: 'Ex: Data Analyst', required: true },
      { name: 'secteur', label: 'Secteur', type: 'select', options: ['Tech & Digital', 'Santé', 'Éducation', 'Juridique', 'Finance', 'Humanitaire', 'Communication', 'Autre'], required: true },
      { name: 'localisation', label: 'Ville / Région', type: 'text', required: true },
      { name: 'remote', label: 'Disponible en remote ?', type: 'select', options: ['Oui', 'Non', 'Hybride'] },
      { name: 'competences', label: 'Compétences clés (séparées par des virgules)', type: 'text', placeholder: 'Ex: Python, SQL, Power BI' },
      { name: 'bio', label: 'Courte présentation (2–3 lignes)', type: 'textarea', required: true },
      { name: 'cmn', label: 'Êtes-vous membre du CMN ?', type: 'select', options: ['Non', 'Oui'] },
    ],
  },
  'offre-emploi': {
    title: 'Publier une offre d\'emploi', emoji: '💼', color: '#2563eb',
    description: 'Publiez gratuitement une offre voile accepté, prière OK ou Muslim-friendly.',
    fields: [
      { name: 'nom', label: 'Votre nom / RH', type: 'text', required: true },
      { name: 'email', label: 'Email professionnel', type: 'email', required: true },
      { name: 'entreprise', label: 'Nom de l\'entreprise', type: 'text', required: true },
      { name: 'titre', label: 'Intitulé du poste', type: 'text', required: true },
      { name: 'contrat', label: 'Type de contrat', type: 'select', options: ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance', 'Bénévolat'] },
      { name: 'localisation', label: 'Lieu', type: 'text', required: true },
      { name: 'friendly', label: 'Ce qui est accepté', type: 'select', options: ['Voile accepté', 'Prière acceptée', 'Les deux', '100% Muslim Friendly'] },
      { name: 'salaire', label: 'Rémunération (optionnel)', type: 'text', placeholder: 'Ex: 35–42k€' },
      { name: 'description', label: 'Description du poste', type: 'textarea', required: true },
      { name: 'lien', label: 'Lien vers l\'offre ou email de candidature', type: 'text', required: true },
    ],
  },
  cagnotte: {
    title: 'Proposer une cagnotte', emoji: '🤲', color: '#ef4444',
    description: 'Référencez votre collecte de fonds pour la faire connaître à la communauté.',
    fields: [
      { name: 'nom', label: 'Votre nom / Organisation', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'titre', label: 'Titre de la cagnotte', type: 'text', required: true },
      { name: 'plateforme', label: 'Plateforme', type: 'select', options: ['LaunchGood', 'HelloAsso', 'Leetchi', 'GoFundMe', 'Autre'] },
      { name: 'lien', label: 'Lien direct vers la cagnotte', type: 'text', required: true },
      { name: 'categorie', label: 'Catégorie', type: 'select', options: ['Palestine / Gaza', 'Urgence humanitaire', 'Eau & Puits', 'Orphelins', 'Mosquée', 'Éducation', 'Famille', 'Afrique', 'Autre'] },
      { name: 'description', label: 'Description courte', type: 'textarea', required: true },
    ],
  },
  librairie: {
    title: 'Signaler une librairie islamique', emoji: '📖', color: '#7c3aed',
    description: 'Vous connaissez une librairie islamique non référencée ? Signalez-la en quelques clics.',
    fields: [
      { name: 'email', label: 'Votre email', type: 'email', required: true },
      { name: 'nom', label: 'Nom de la librairie', type: 'text', required: true },
      { name: 'adresse', label: 'Adresse complète', type: 'text', required: true },
      { name: 'ville', label: 'Ville', type: 'text', required: true },
      { name: 'phone', label: 'Téléphone', type: 'text' },
      { name: 'website', label: 'Site web', type: 'text' },
      { name: 'horaires', label: 'Horaires d\'ouverture', type: 'text' },
      { name: 'specialites', label: 'Spécialités (livres, vêtements, arabe…)', type: 'text' },
    ],
  },
  'revendiquer-librairie': {
    title: 'Je gère cette librairie', emoji: '🏪', color: '#7c3aed',
    description: 'Revendiquez votre fiche pour la mettre à jour, ajouter vos horaires et votre photo.',
    fields: [
      { name: 'nom', label: 'Votre nom', type: 'text', required: true },
      { name: 'email', label: 'Email professionnel de la librairie', type: 'email', required: true },
      { name: 'librairie', label: 'Nom de la librairie', type: 'text', required: true },
      { name: 'role', label: 'Votre rôle', type: 'select', options: ['Gérant / Propriétaire', 'Employé', 'Communication'] },
      { name: 'message', label: 'Ce que vous souhaitez modifier ou ajouter', type: 'textarea' },
    ],
  },
  piscine: {
    title: 'Signaler un créneau burkini', emoji: '🏊', color: '#0284c7',
    description: 'Vous connaissez une piscine ou un créneau burkini non référencé ? Aidez la communauté.',
    fields: [
      { name: 'email', label: 'Votre email', type: 'email', required: true },
      { name: 'nom', label: 'Nom de la piscine', type: 'text', required: true },
      { name: 'adresse', label: 'Adresse', type: 'text', required: true },
      { name: 'ville', label: 'Ville', type: 'text', required: true },
      { name: 'creneaux', label: 'Jours et horaires des créneaux', type: 'text', placeholder: 'Ex: Samedi 10h–12h, Mardi 19h–21h' },
      { name: 'tarif', label: 'Tarif indicatif', type: 'text' },
      { name: 'note', label: 'Informations complémentaires', type: 'textarea' },
    ],
  },
  correction: {
    title: 'Corriger une information', emoji: '✏️', color: '#f59e0b',
    description: 'Une information est incorrecte ou obsolète ? Signalez-la pour que nous la corrigions.',
    fields: [
      { name: 'email', label: 'Votre email', type: 'email', required: true },
      { name: 'page', label: 'Quelle page / section ?', type: 'select', options: ['Piscines burkini', 'Librairies', 'Éducation', 'Événements', 'Emploi', 'Santé', 'Hajj & Omra', 'Solidarité', 'Justice', 'Autre'] },
      { name: 'element', label: 'Quel élément doit être corrigé ?', type: 'text', placeholder: 'Ex: Horaires de la Piscine des Roches', required: true },
      { name: 'correction', label: 'Quelle est la correction ?', type: 'textarea', required: true },
      { name: 'source', label: 'Source / preuve (lien, téléphone…)', type: 'text' },
    ],
  },
  'question-juridique': {
    title: 'Proposer une question juridique', emoji: '⚖️', color: '#7c3aed',
    description: 'Une question sur vos droits en France qui n\'est pas encore dans notre FAQ ? Proposez-la.',
    fields: [
      { name: 'email', label: 'Votre email (optionnel)', type: 'email' },
      { name: 'question', label: 'Votre question', type: 'textarea', required: true, placeholder: 'Ex: Mon employeur peut-il m\'interdire de prier pendant la pause déjeuner ?' },
      { name: 'contexte', label: 'Contexte (optionnel)', type: 'textarea', placeholder: 'Précisez le contexte si utile…' },
    ],
  },
  'hajj-devis': {
    title: 'Demander un devis Hajj / Omra', emoji: '🕋', color: '#059669',
    description: 'Nous transmettons votre demande directement à l\'agence. Réponse sous 24–48h.',
    fields: [
      { name: 'nom', label: 'Nom complet', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Téléphone', type: 'text' },
      { name: 'type', label: 'Type de voyage', type: 'select', options: ['Hajj 2026', 'Omra Ramadan', 'Omra hors saison', 'Omra Express'], required: true },
      { name: 'personnes', label: 'Nombre de personnes', type: 'select', options: ['1', '2', '3–4', '5+'] },
      { name: 'budget', label: 'Budget indicatif / personne', type: 'select', options: ['< 1 500€', '1 500–3 000€', '3 000–6 000€', '6 000€+'] },
      { name: 'depart', label: 'Ville de départ souhaitée', type: 'select', options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Autre'] },
      { name: 'message', label: 'Demandes particulières', type: 'textarea' },
    ],
  },
  avis: {
    title: 'Laisser un avis', emoji: '⭐', color: '#f59e0b',
    description: 'Vous avez testé un praticien, une librairie ou une agence Hajj ? Partagez votre expérience.',
    fields: [
      { name: 'nom', label: 'Votre prénom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'ressource', label: 'Nom de la ressource', type: 'text', placeholder: 'Ex: Dr. Amina Ben Salem, Librairie Tawhid', required: true },
      { name: 'categorie', label: 'Catégorie', type: 'select', options: ['Psychologue / Psy', 'Hijama', 'Roqya', 'Librairie', 'Agence Hajj / Omra', 'Piscine burkini', 'Institut / Cours', 'Autre'] },
      { name: 'note', label: 'Note', type: 'select', options: ['⭐⭐⭐⭐⭐ Excellent', '⭐⭐⭐⭐ Très bien', '⭐⭐⭐ Bien', '⭐⭐ Moyen', '⭐ Déçu(e)'], required: true },
      { name: 'message', label: 'Votre avis', type: 'textarea', required: true, placeholder: 'Décrivez votre expérience…' },
    ],
  },
  mosquee: {
    title: 'Référencer / corriger une mosquée', emoji: '🕌', color: '#059669',
    description: 'Une mosquée dynamique non référencée, ou des infos incorrectes ? Aidez-nous à compléter.',
    fields: [
      { name: 'email', label: 'Votre email', type: 'email', required: true },
      { name: 'nom', label: 'Nom de la mosquée', type: 'text', required: true },
      { name: 'ville', label: 'Ville et département', type: 'text', required: true },
      { name: 'adresse', label: 'Adresse complète', type: 'text' },
      { name: 'instagram', label: 'Compte Instagram (@…)', type: 'text', placeholder: '@mosqueedegennevilliers' },
      { name: 'tiktok', label: 'Compte TikTok (@…)', type: 'text' },
      { name: 'website', label: 'Site web', type: 'text' },
      { name: 'note', label: 'Informations complémentaires ou correction', type: 'textarea' },
    ],
  },
  suggestion: {
    title: 'Suggérer une amélioration', emoji: '💡', color: '#0d9488',
    description: 'Une idée pour améliorer Al-Wasil ? Une fonctionnalité manquante ? On est à l\'écoute.',
    fields: [
      { name: 'nom', label: 'Votre prénom (optionnel)', type: 'text' },
      { name: 'email', label: 'Email (optionnel)', type: 'email' },
      { name: 'section', label: 'Quelle section est concernée ?', type: 'select', options: ['Site en général', 'Éducation', 'Événements', 'Solidarité', 'Emploi', 'Santé', 'Librairies', 'Piscines', 'Hajj & Omra', 'Justice', 'Design / UX', 'Nouvelle page à créer', 'Autre'] },
      { name: 'suggestion', label: 'Votre suggestion', type: 'textarea', required: true, placeholder: 'Décrivez votre idée…' },
    ],
  },
  annonceur: {
    title: 'Partenariat & publicité', emoji: '📣', color: '#0d9488',
    description: 'Intéressé par un emplacement publicitaire ou un partenariat ? Consultez notre page annonceurs.',
    fields: [
      { name: 'nom', label: 'Votre nom / Organisation', type: 'text', required: true },
      { name: 'email', label: 'Email professionnel', type: 'email', required: true },
      { name: 'type', label: 'Type de demande', type: 'select', options: ['Publicité banner', 'Article sponsorisé', 'Partenariat contenu', 'Autre'] },
      { name: 'message', label: 'Votre demande', type: 'textarea', required: true },
    ],
  },
  general: {
    title: 'Nous contacter', emoji: '✉️', color: '#0d9488',
    description: 'Une question, une suggestion ou une demande ? Écrivez-nous.',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'sujet', label: 'Sujet', type: 'sujet-select', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
    ],
  },
};

// ── Composant principal ───────────────────────────────────────
function ContactForm() {
  const params = useSearchParams();
  const router = useRouter();
  const rawType = params.get('type') ?? 'general';
  const type = (FORM_CONFIG[rawType as FormType] ? rawType : 'general') as FormType;
  const config = FORM_CONFIG[type];

  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sujetAutre, setSujetAutre] = useState('');

  useEffect(() => { setValues({}); setSent(false); setSujetAutre(''); }, [type]);

  // Quand le dropdown sujet change → redirection si catégorie spécialisée
  function handleSujetChange(val: string) {
    setValues(p => ({ ...p, sujet: val }));
    const opt = SUJET_OPTIONS.find(o => o.value === val);
    if (opt?.redirectTo) {
      router.push(`/contact?type=${opt.redirectTo}`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connecter à Formspree / Resend
    setSent(true);
  }

  const ACCENT = config.color;
  const needsAutreField = values['sujet'] === 'autre' || values['sujet'] === 'suggestion' || values['sujet'] === 'avis' || values['sujet'] === 'mosquee';

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '640px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{config.emoji}</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>{config.title}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{config.description}</p>
      </div>

      {sent ? (
        <div style={{ padding: '2.5rem', borderRadius: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <CheckCircle size={40} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Message envoyé !</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Nous avons bien reçu votre demande. Barak Allahou fikoum !<br />
            Réponse sous 24–48h ouvrées.
          </p>
          <button onClick={() => setSent(false)} className="btn btn-outline" style={{ marginRight: '0.75rem' }}>
            Envoyer une autre demande
          </button>
          <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Retour à l&apos;accueil
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {config.fields.map(field => (
            <div key={field.name}>
              <label style={{ fontSize: '0.83rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                {field.label}{field.required && <span style={{ color: ACCENT }}> *</span>}
              </label>

              {/* ── Cas spécial : dropdown sujet intelligent ── */}
              {field.type === 'sujet-select' ? (
                <>
                  <select
                    required={field.required}
                    value={values[field.name] ?? ''}
                    onChange={e => handleSujetChange(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                  >
                    <option value="">-- Choisir un sujet --</option>
                    <optgroup label="📬 Soumettre un contenu">
                      {SUJET_OPTIONS.slice(0, 9).map(o => (
                        <option key={o.value} value={o.value}>
                          {o.label}{o.redirectTo ? ' →' : ''}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🔧 Corrections & Questions">
                      {SUJET_OPTIONS.slice(9, 11).map(o => (
                        <option key={o.value} value={o.value}>{o.label}{o.redirectTo ? ' →' : ''}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💬 Avis & Communauté">
                      {SUJET_OPTIONS.slice(11, 13).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📣 Partenariats">
                      {SUJET_OPTIONS.slice(13, 14).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="💡 Divers">
                      {SUJET_OPTIONS.slice(14).map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Redirect hint */}
                  {values['sujet'] && SUJET_OPTIONS.find(o => o.value === values['sujet'])?.redirectTo && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: ACCENT }}>
                      <ArrowRight size={13} /> Redirection vers le formulaire dédié…
                    </div>
                  )}

                  {/* Champ libre si "avis", "mosquee", "suggestion" ou "autre" */}
                  {needsAutreField && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={{ fontSize: '0.83rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                        Préciser le sujet <span style={{ color: ACCENT }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Décrivez en quelques mots…"
                        value={sujetAutre}
                        onChange={e => setSujetAutre(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </>
              ) : field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  rows={4}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={e => setValues(p => ({ ...p, [field.name]: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={e => setValues(p => ({ ...p, [field.name]: e.target.value }))}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                >
                  <option value="">-- Choisir --</option>
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ''}
                  onChange={e => setValues(p => ({ ...p, [field.name]: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              )}
            </div>
          ))}

          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: ACCENT, color: 'white', border: 'none', padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
            <Send size={16} /> Envoyer ma demande
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Vos données sont utilisées uniquement pour traiter votre demande. Aucune revente.
          </p>
        </form>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1rem' }}>Chargement…</div>}>
      <ContactForm />
    </Suspense>
  );
}
