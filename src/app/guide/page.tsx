'use client';

import { useState, useCallback } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Download, Eye, MapPin, User, Users, X } from 'lucide-react';

const TEAL = '#5e17eb';
const TEAL_LIGHT = '#f3eeff';
const TEAL_BORDER = '#c4a8f8';

// ── Données contenu ────────────────────────────────────────────

const PILIERS = [
  { ar: 'الشَّهَادَة', nom: 'La Shahada', desc: 'Témoigner qu\'il n\'y a de dieu qu\'Allah et que Muhammad ﷺ est Son messager.' },
  { ar: 'الصَّلَاة', nom: 'La Prière', desc: 'Prier 5 fois par jour en direction de La Mecque.' },
  { ar: 'الزَّكَاة', nom: 'La Zakat', desc: 'Donner une part de ses biens aux nécessiteux (2,5% de l\'épargne annuelle).' },
  { ar: 'الصَّوْم', nom: 'Le Jeûne', desc: 'Jeûner durant le mois de Ramadan, du lever au coucher du soleil.' },
  { ar: 'الْحَج', nom: 'Le Hajj', desc: 'Effectuer le pèlerinage à La Mecque au moins une fois dans sa vie si on en a les moyens.' },
];

const WUDU_STEPS = [
  { num: 1, titre: 'L\'intention (Niyyah)', desc: 'Formule l\'intention dans ton cœur de faire les ablutions pour la prière. Pas besoin de la prononcer à voix haute.', icon: '🤲' },
  { num: 2, titre: 'Bismillah', desc: 'Commence par dire "Bismillah" (Au nom d\'Allah).', icon: '🗣️' },
  { num: 3, titre: 'Se laver les mains', desc: 'Laver les deux mains jusqu\'aux poignets, 3 fois. Commencer par la droite.', icon: '🙌' },
  { num: 4, titre: 'Se rincer la bouche', desc: 'Prendre de l\'eau dans la bouche, la faire tourner puis la cracher, 3 fois.', icon: '💧' },
  { num: 5, titre: 'Se rincer les narines', desc: 'Aspirer de l\'eau dans les narines puis la rejeter, 3 fois.', icon: '💧' },
  { num: 6, titre: 'Se laver le visage', desc: 'Laver tout le visage (du haut du front jusqu\'au menton, d\'une oreille à l\'autre), 3 fois.', icon: '😊' },
  { num: 7, titre: 'Se laver les avant-bras', desc: 'Laver le bras droit jusqu\'au coude inclus, 3 fois. Puis le gauche, 3 fois.', icon: '💪' },
  { num: 8, titre: 'Passer les mains sur la tête', desc: 'Passer les deux mains humides sur la tête (de l\'avant vers l\'arrière), une seule fois.', icon: '🙏' },
  { num: 9, titre: 'Se laver les oreilles', desc: 'Avec la même eau, nettoyer l\'intérieur et l\'extérieur des oreilles, une fois.', icon: '👂' },
  { num: 10, titre: 'Se laver les pieds', desc: 'Laver le pied droit jusqu\'à la cheville incluse, 3 fois (en passant entre les orteils). Puis le gauche.', icon: '🦶' },
];

const PRIERES = [
  { nom: 'Fajr', ar: 'الفجر', heure: 'Avant le lever du soleil', rakat: 2, couleur: '#7c3aed' },
  { nom: 'Dhohr', ar: 'الظهر', heure: 'Début d\'après-midi', rakat: 4, couleur: '#d97706' },
  { nom: 'Asr', ar: 'العصر', heure: 'Fin d\'après-midi', rakat: 4, couleur: '#ea580c' },
  { nom: 'Maghrib', ar: 'المغرب', heure: 'Après le coucher du soleil', rakat: 3, couleur: '#dc2626' },
  { nom: 'Icha', ar: 'العشاء', heure: 'La nuit', rakat: 4, couleur: '#1e3a5f' },
];

const ETAPES_PRIERE = [
  { titre: 'La direction (Qibla)', desc: 'Oriente-toi vers La Mecque. En France, c\'est approximativement vers le sud-est. Utilise une app comme Muslim Pro pour être précis.' },
  { titre: 'La pureté', desc: 'Assure-toi d\'avoir fait les ablutions (wudu) et que tes vêtements et l\'endroit sont propres.' },
  { titre: 'L\'intention (Niyyah)', desc: 'Dans ton cœur, formule l\'intention de prier telle prière (ex: "J\'ai l\'intention de prier le Dhohr").' },
  { titre: 'Takbiratul ihram', desc: 'Lève les mains à hauteur des oreilles et dis : "Allahu Akbar" (Allah est le plus Grand). La prière commence.' },
  { titre: 'La récitation', desc: 'Récite Al-Fatiha debout, puis une autre sourate ou quelques versets que tu connais.' },
  { titre: 'Le Ruku (inclination)', desc: 'Incline-toi, dos horizontal, mains sur les genoux. Dis 3 fois : "Subhana Rabbiyal Adhim".' },
  { titre: 'Le Sujud (prosternation)', desc: 'Pose le front, le nez, les deux paumes, les deux genoux et les orteils au sol. Dis 3 fois : "Subhana Rabbiyal A\'la".' },
  { titre: 'Le Tachahoud', desc: 'Assis entre les prosternations et en fin de prière. Récite le Tachahoud et la Salat Ibrahimiyya.' },
  { titre: 'Le Salam', desc: 'Tourne la tête à droite en disant "Assalamu alaykum wa rahmatullah", puis à gauche. La prière est terminée.' },
];

const FATIHA = {
  ar: ['بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'الرَّحْمَٰنِ الرَّحِيمِ', 'مَالِكِ يَوْمِ الدِّينِ', 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'],
  translit: ['Bismillahi r-rahmani r-rahim', 'Al-hamdu lillahi rabbi l-\'alamin', 'Ar-rahmani r-rahim', 'Maliki yawmi d-din', 'Iyyaka na\'budu wa-iyyaka nasta\'in', 'Ihdina s-sirata l-mustaqim', 'Sirata lladhina an\'amta \'alayhim ghayri l-maghdubi \'alayhim wa-la d-dallin'],
  fr: ['Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux', 'Louange à Allah, Seigneur des mondes', 'Le Tout Miséricordieux, le Très Miséricordieux', 'Maître du Jour du Jugement', 'C\'est Toi [seul] que nous adorons, et c\'est Toi [seul] dont nous implorons le secours', 'Guide-nous dans le droit chemin', 'Le chemin de ceux que Tu as comblés de Tes bienfaits, non pas de ceux qui ont encouru Ta colère, ni des égarés'],
};

const SOURATES = [
  {
    nom: 'Al-Ikhlas (Le Monothéisme pur)', num: '112', rakat: 'Prière courante',
    ar: ['قُلْ هُوَ اللَّهُ أَحَدٌ', 'اللَّهُ الصَّمَدُ', 'لَمْ يَلِدْ وَلَمْ يُولَدْ', 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ'],
    translit: ['Qul huwa llahu ahad', 'Allahu s-samad', 'Lam yalid wa-lam yulad', 'Wa-lam yakun lahu kufuwan ahad'],
    fr: ['Dis : "Il est Allah, [le] Seul"', 'Allah, L\'Absolu', 'Il n\'a pas engendré et n\'a pas été engendré', 'Et nul n\'est égal à Lui'],
  },
  {
    nom: 'Al-Kawthar (L\'Abondance)', num: '108', rakat: 'Courte, idéale pour débuter',
    ar: ['إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ'],
    translit: ['Inna a\'tayna ka l-kawthar', 'Fa-salli li-rabbika wa-nhar', 'Inna sha\'ni\'aka huwa l-abtar'],
    fr: ['Nous t\'avons certes donné l\'Abondance', 'Accomplis donc la prière pour ton Seigneur et sacrifie', 'C\'est bien ton ennemi qui est le sans postérité'],
  },
  {
    nom: 'An-Nas (Les Hommes)', num: '114', rakat: 'Protection — souvent récitée',
    ar: ['قُلْ أَعُوذُ بِرَبِّ النَّاسِ', 'مَلِكِ النَّاسِ', 'إِلَٰهِ النَّاسِ', 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', 'مِنَ الْجِنَّةِ وَالنَّاسِ'],
    translit: ['Qul a\'udhu bi-rabbi n-nas', 'Maliki n-nas', 'Ilahi n-nas', 'Min sharri l-waswasi l-khannas', 'Alladhi yuwaswisu fi suduri n-nas', 'Mina l-jinnati wa-n-nas'],
    fr: ['Dis : "Je cherche refuge auprès du Seigneur des hommes"', 'Le Roi des hommes', 'Le Dieu des hommes', 'Contre le mal du mauvais conseiller qui se dérobe', 'Qui souffle le mal dans les poitrines des hommes', 'Qu\'il soit djinn ou homme'],
  },
];

const DEPARTEMENTS_MOSQUEES: Record<string, { nom: string; ville: string; lien: string }> = {
  '75': { nom: 'Grande Mosquée de Paris', ville: 'Paris 5e', lien: 'https://www.mosqueedeparis.net' },
  '92': { nom: 'Mosquée de Gennevilliers', ville: 'Gennevilliers', lien: 'https://mawaqit.net' },
  '93': { nom: 'Mosquée de Stains', ville: 'Stains', lien: 'https://mawaqit.net' },
  '94': { nom: 'Mosquée de Créteil', ville: 'Créteil', lien: 'https://mawaqit.net' },
  '91': { nom: 'Mosquée d\'Évry', ville: 'Évry-Courcouronnes', lien: 'https://mawaqit.net' },
  '78': { nom: 'Mosquée de Versailles', ville: 'Versailles', lien: 'https://mawaqit.net' },
  '95': { nom: 'Mosquée de Cergy', ville: 'Cergy', lien: 'https://mawaqit.net' },
  '77': { nom: 'Mosquée de Meaux', ville: 'Meaux', lien: 'https://mawaqit.net' },
  '69': { nom: 'Grande Mosquée de Lyon', ville: 'Lyon 8e', lien: 'https://mosquee-de-lyon.org' },
  '13': { nom: 'Grande Mosquée de Marseille', ville: 'Marseille', lien: 'https://mawaqit.net' },
  '67': { nom: 'Grande Mosquée de Strasbourg', ville: 'Strasbourg', lien: 'https://mawaqit.net' },
  '59': { nom: 'Grande Mosquée de Lille', ville: 'Lille', lien: 'https://mawaqit.net' },
  '33': { nom: 'Grande Mosquée de Bordeaux', ville: 'Bordeaux', lien: 'https://mawaqit.net' },
  '31': { nom: 'Grande Mosquée de Toulouse', ville: 'Toulouse', lien: 'https://mawaqit.net' },
  '06': { nom: 'Grande Mosquée de Nice', ville: 'Nice', lien: 'https://mawaqit.net' },
  '44': { nom: 'Grande Mosquée de Nantes', ville: 'Nantes', lien: 'https://mawaqit.net' },
  '76': { nom: 'Grande Mosquée de Rouen', ville: 'Rouen', lien: 'https://mawaqit.net' },
  '34': { nom: 'Grande Mosquée de Montpellier', ville: 'Montpellier', lien: 'https://mawaqit.net' },
};

// ── Composant accordéon ────────────────────────────────────────

function Section({ title, emoji, children, defaultOpen = false }: { title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.875rem', overflow: 'hidden', marginBottom: '0.75rem' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: open ? TEAL_LIGHT : 'white', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 700, fontSize: '0.95rem', color: open ? TEAL : '#1c1917' }}>
          <span style={{ fontSize: '1.2rem' }}>{emoji}</span> {title}
        </span>
        {open ? <ChevronUp size={18} color={TEAL} /> : <ChevronDown size={18} color="#78716c" />}
      </button>
      {open && (
        <div style={{ padding: '1.25rem', borderTop: `1px solid ${TEAL_BORDER}`, backgroundColor: 'white' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────

export default function GuidePage() {
  const [gender, setGender] = useState<'h' | 'f' | null>(null);
  const [dept, setDept] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleDownloadPDF = useCallback(() => {
    // Ouvre une nouvelle fenêtre avec le guide en mode impression propre
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) { window.print(); return; }
    w.document.write(`<!DOCTYPE html><html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Guide - Mes Premiers Pas en Islam — Al-Wasil</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Poppins, sans-serif; color: #1c1917; background: #fff; padding: 2rem; max-width: 700px; margin: 0 auto; }
  h1 { font-size: 2rem; font-weight: 900; color: #7c3aed; margin-bottom: 0.5rem; }
  h2 { font-size: 1.1rem; font-weight: 700; color: #7c3aed; margin: 1.5rem 0 0.75rem; border-bottom: 2px solid #ede9fe; padding-bottom: 0.4rem; }
  p { font-size: 0.9rem; line-height: 1.7; margin-bottom: 0.75rem; color: #44403c; }
  .item { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; align-items: flex-start; }
  .num { width: 28px; height: 28px; border-radius: 50%; background: #7c3aed; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
  .badge { background: #f5f3ff; border: 1px solid #ddd6fe; color: #7c3aed; padding: 2px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-bottom: 0.5rem; }
  footer { margin-top: 3rem; text-align: center; color: #a8a29e; font-size: 0.75rem; border-top: 1px solid #e7e5e4; padding-top: 1rem; }
  @media print { body { padding: 1rem; } }
</style>
</head>
<body>
<div class="badge">Al-Wasil — Mes Premiers Pas</div>
<h1>Guide pour débuter en Islam</h1>
<p>Les fondamentaux sur lesquels tous les savants s'accordent, sans divergences d'écoles.</p>

<h2>Les 5 piliers de l'Islam</h2>
${PILIERS.map((p, i) => `<div class="item"><div class="num">${i+1}</div><div><strong>${p.nom}</strong> <em style="color:#a8a29e">${p.ar}</em><br/><span style="font-size:0.85rem;color:#57534e">${p.desc}</span></div></div>`).join('')}

<h2>L'ablution (Wudu) — étapes</h2>
${WUDU_STEPS.map(s => `<div class="item"><div class="num">${s.num}</div><div><strong>${s.titre}</strong><br/><span style="font-size:0.85rem;color:#57534e">${s.desc}</span></div></div>`).join('')}

<footer>© Al-Wasil — alwasil-platform.vercel.app — Guide généré le ${new Date().toLocaleDateString('fr-FR')}</footer>
<script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
</body></html>`);
    w.document.close();
  }, []);

  const mosquee = DEPARTEMENTS_MOSQUEES[dept];

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '760px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <BookOpen size={28} color={TEAL} />
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Mes Premiers Pas</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Tu découvres l&apos;islam ou tu souhaites (re)apprendre les bases ? Ce guide couvre l&apos;essentiel — les points sur lesquels tous les savants s&apos;accordent, sans divergences d&apos;écoles.
        </p>
      </div>

      {/* Sélecteur genre */}
      <div style={{ backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL_BORDER}`, borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: TEAL, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Pour personnaliser le guide
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setGender('h')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: `2px solid ${gender === 'h' ? TEAL : 'var(--border-color)'}`, backgroundColor: gender === 'h' ? TEAL : 'white', color: gender === 'h' ? 'white' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            <User size={16} /> Frère
          </button>
          <button onClick={() => setGender('f')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: `2px solid ${gender === 'f' ? TEAL : 'var(--border-color)'}`, backgroundColor: gender === 'f' ? TEAL : 'white', color: gender === 'f' ? 'white' : 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            <Users size={16} /> Sœur
          </button>
        </div>
      </div>

      {/* Bouton PDF */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: '0.625rem', backgroundColor: 'white', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500 }}>
          <Download size={14} /> Télécharger en PDF
        </button>
      </div>

      {/* ── SECTION 1 : Les 5 Piliers ── */}
      <Section title="Les 5 piliers de l'Islam" emoji="🕌" defaultOpen>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {PILIERS.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.875rem', backgroundColor: '#fafaf9', borderRadius: '0.625rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: TEAL, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.25rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{p.nom}</strong>
                  <span style={{ fontSize: '1.1rem', fontFamily: 'serif', color: TEAL, direction: 'rtl' }}>{p.ar}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 2 : La Shahada ── */}
      <Section title="La Shahada — Le témoignage de foi" emoji="🤲">
        <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: TEAL_LIGHT, borderRadius: '0.75rem', border: `1px solid ${TEAL_BORDER}`, marginBottom: '1rem' }}>
          <p style={{ fontSize: '1.8rem', fontFamily: 'serif', direction: 'rtl', lineHeight: 1.8, color: '#1c1917', margin: '0 0 0.75rem' }}>
            أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ
          </p>
          <p style={{ fontSize: '0.85rem', color: '#78716c', fontStyle: 'italic', margin: '0 0 0.5rem' }}>
            Ashhadu an la ilaha illa llah wa-ashhadu anna Muhammadan rasulu llah
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: TEAL, margin: 0 }}>
            "Je témoigne qu'il n'y a de dieu qu'Allah et je témoigne que Muhammad est le messager d'Allah."
          </p>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          La Shahada est le premier pilier de l'Islam. La prononcer sincèrement, en comprenant son sens, marque l'entrée en Islam. Il est recommandé de la prononcer devant des témoins et idéalement dans une mosquée pour être accompagné.
        </p>
      </Section>

      {/* ── SECTION 3 : Les Ablutions ── */}
      <Section title="Les Ablutions (Wudu — الوُضُوء)" emoji="💧">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.65 }}>
          Les ablutions sont obligatoires avant la prière, le toucher du Coran et la circumambulation (tawaf). Elles sont invalidées par : les selles/urines, les gaz intestinaux, le sommeil profond, le saignement abondant.
        </p>
        {gender === 'f' && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fdf2f8', border: '1px solid #f9a8d4', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.83rem', color: '#9d174d' }}>
            🧕 <strong>Pour les sœurs :</strong> L'étape 8 (passage sur la tête) se fait par-dessus le voile si tu es en wudu et que tu le portes déjà. Si tu n'as pas de voile, passe les mains sur les cheveux normalement.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {WUDU_STEPS.map(step => (
            <div key={step.num} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.75rem', backgroundColor: '#fafaf9', borderRadius: '0.625rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: TEAL, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{step.num}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{step.icon} {step.titre}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 4 : Les 5 Prières ── */}
      <Section title="Les 5 Prières obligatoires" emoji="🕐">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {PRIERES.map(p => (
            <div key={p.nom} style={{ padding: '0.875rem', backgroundColor: '#fafaf9', borderRadius: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontFamily: 'serif', direction: 'rtl', color: p.couleur, marginBottom: '0.25rem' }}>{p.ar}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1c1917' }}>{p.nom}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{p.heure}</div>
              <div style={{ marginTop: '0.4rem', display: 'inline-block', backgroundColor: p.couleur + '18', color: p.couleur, padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                {p.rakat} rak'at
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          💡 Les heures exactes varient selon les saisons et ta ville. Utilise une application comme <strong>Muslim Pro</strong>, <strong>Adan</strong> ou <strong>Mawaqit</strong> pour avoir les horaires précis en temps réel.
        </p>
      </Section>

      {/* ── SECTION 5 : Comment prier ── */}
      <Section title="Comment faire sa prière — les étapes" emoji="🙏">
        {gender === 'f' && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fdf2f8', border: '1px solid #f9a8d4', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.83rem', color: '#9d174d' }}>
            🧕 <strong>Pour les sœurs :</strong> La position des bras, des mains et des pieds diffère légèrement (par exemple, les bras restent plus proches du corps). Un guide spécifique avec images est recommandé — recherche "comment prier pour les femmes" sur YouTube.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ETAPES_PRIERE.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem', backgroundColor: '#fafaf9', borderRadius: '0.625rem', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: TEAL + '20', color: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{e.titre}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 6 : Al-Fatiha ── */}
      <Section title="Al-Fatiha — La sourate à réciter dans chaque rak'at" emoji="📖">
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Al-Fatiha est obligatoire dans chaque rak'at de chaque prière. La mémoriser est la première chose à apprendre.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {FATIHA.ar.map((verset, i) => (
            <div key={i} style={{ padding: '0.875rem 1rem', backgroundColor: i === 0 ? TEAL_LIGHT : '#fafaf9', borderRadius: '0.625rem', border: `1px solid ${i === 0 ? TEAL_BORDER : 'var(--border-color)'}` }}>
              <p style={{ fontSize: '1.25rem', fontFamily: 'serif', direction: 'rtl', textAlign: 'right', color: '#1c1917', margin: '0 0 0.35rem', lineHeight: 1.8 }}>{verset}</p>
              <p style={{ fontSize: '0.78rem', color: '#78716c', fontStyle: 'italic', margin: '0 0 0.2rem' }}>{FATIHA.translit[i]}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{FATIHA.fr[i]}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 7 : Premières sourates ── */}
      <Section title="Premières sourates à apprendre" emoji="✨">
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Après Al-Fatiha, voici 3 sourates courtes à mémoriser pour enrichir ta prière.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {SOURATES.map((s, si) => (
            <div key={si} style={{ border: '1px solid var(--border-color)', borderRadius: '0.875rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fafaf9', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Sourate {s.nom}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>Coran {s.num}</span>
                </div>
                <span style={{ fontSize: '0.72rem', backgroundColor: TEAL + '15', color: TEAL, padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{s.rakat}</span>
              </div>
              <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {s.ar.map((v, vi) => (
                  <div key={vi} style={{ padding: '0.5rem 0.75rem', backgroundColor: '#fafaf9', borderRadius: '0.5rem' }}>
                    <p style={{ fontSize: '1.1rem', fontFamily: 'serif', direction: 'rtl', textAlign: 'right', color: '#1c1917', margin: '0 0 0.2rem', lineHeight: 1.8 }}>{v}</p>
                    <p style={{ fontSize: '0.75rem', color: '#78716c', fontStyle: 'italic', margin: '0 0 0.15rem' }}>{s.translit[vi]}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{s.fr[vi]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SECTION 8 : Trouver une mosquée ── */}
      <Section title="Trouver une mosquée près de chez toi" emoji="🕌">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.65 }}>
          Nous te recommandons de te rapprocher d'une mosquée pour être accompagné dans ton apprentissage. Sélectionne ton département :
        </p>
        <select
          value={dept}
          onChange={e => setDept(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', fontSize: '0.9rem', marginBottom: '1rem', backgroundColor: 'white' }}>
          <option value="">-- Choisir ton département --</option>
          {Object.entries(DEPARTEMENTS_MOSQUEES).map(([code, m]) => (
            <option key={code} value={code}>{code} — {m.ville}</option>
          ))}
          <option value="autre">Autre département</option>
        </select>

        {mosquee && (
          <div style={{ padding: '1.25rem', backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL_BORDER}`, borderRadius: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={16} color={TEAL} />
              <strong style={{ color: TEAL }}>{mosquee.nom}</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.875rem' }}>{mosquee.ville}</p>
            <a href={mosquee.lien} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: TEAL, color: 'white', padding: '0.5rem 1rem', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Voir les horaires & infos →
            </a>
          </div>
        )}

        {dept === 'autre' && (
          <div style={{ padding: '1rem', backgroundColor: TEAL_LIGHT, border: `1px solid ${TEAL_BORDER}`, borderRadius: '0.875rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>
              Recherche la mosquée la plus proche de chez toi sur Mawaqit, la référence pour les horaires de prière en France :
            </p>
            <a href="https://mawaqit.net/fr" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: TEAL, color: 'white', padding: '0.5rem 1rem', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Ouvrir Mawaqit →
            </a>
          </div>
        )}
      </Section>

      {/* Message final */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fafaf9', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤲</div>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Qu&apos;Allah facilite ton chemin</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem' }}>
          L&apos;apprentissage de la religion est un chemin, pas une destination. Prends-le étape par étape, avec sincérité. La communauté Al-Wasil est là pour t&apos;aider à trouver des ressources, des cours et des praticiens de confiance.
        </p>
        <a href="/education" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: TEAL, color: 'white', padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
          Trouver des cours près de chez moi →
        </a>
      </div>

      {/* CSS print */}
      <style>{`
        @media print {
          nav, footer, button, .no-print { display: none !important; }
          body { font-size: 12pt; }
          .container { max-width: 100%; padding: 0; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
