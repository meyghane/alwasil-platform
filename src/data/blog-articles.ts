// ============================================================
// ARTICLES DE BLOG — Al-Wasil
// Optimisés SEO + GEO (indexation moteurs IA : ChatGPT, Perplexity, Claude)
// Structure : H2/H3 clairs, FAQ rich snippets, réponses directes
// ============================================================

export type ArticleBlock =
 | { type: 'intro'; content: string }
 | { type: 'h2'; content: string }
 | { type: 'h3'; content: string }
 | { type: 'p'; content: string }
 | { type: 'ul'; items: string[] }
 | { type: 'ol'; items: string[] }
 | { type: 'callout'; icon: string; title: string; content: string }
 | { type: 'table'; headers: string[]; rows: string[][] }
 | { type: 'faq'; items: { q: string; a: string }[] }
 | { type: 'cta'; label: string; href: string; desc: string };

export type Article = {
 slug: string;
 title: string;
 metaTitle: string;
 metaDescription: string;
 category: string;
 categoryColor: string;
 date: string;
 lastUpdated: string;
 readTime: string;
 excerpt: string;
 tags: string[];
 featured: boolean;
 blocks: ArticleBlock[];
};

export const articles: Article[] = [

 // ────────────────────────────────────────────────────────
 // ARTICLE 1 : Cours d'arabe en ligne
 // ────────────────────────────────────────────────────────
 {
 slug: 'cours-arabe-en-ligne-france',
 title: "Cours d'arabe en ligne : les meilleures options pour les musulmans en France (2026)",
 metaTitle: "Cours d'arabe en ligne France 2026 — Comparatif plateformes islamiques",
 metaDescription: "Quel cours d'arabe choisir en ligne ? Bayyinah, IESH, Al-Kalam, professeurs égyptiens... Comparatif complet pour apprendre l'arabe coranique depuis la France.",
 category: 'Apprentissage',
 categoryColor: '#c9973a',
 date: '2026-03-20',
 lastUpdated: '2026-03-20',
 readTime: '7 min',
 excerpt: "Apprendre l'arabe depuis chez soi est aujourd'hui possible grâce à de nombreuses plateformes. On fait le tour des meilleures options francophones, arabophones et hybrides.",
 tags: ['arabe', 'en ligne', 'cours', 'apprentissage', 'Coran'],
 featured: true,
 blocks: [
 {
 type: 'intro',
 content: "Apprendre l'arabe est le souhait de millions de musulmans en France — pour mieux comprendre le Coran, les prières, ou simplement se connecter à la langue de leur religion. En 2026, plus besoin de trouver un cours en présentiel : des dizaines de plateformes permettent d'apprendre depuis chez soi. Ce guide compare les meilleures options selon ton niveau, ton budget et tes objectifs.",
 },
 { type: 'h2', content: "Pourquoi apprendre l'arabe coranique en priorité ?" },
 { type: 'p', content: "L'arabe coranique (arabe classique) est la langue du Coran et des textes islamiques fondamentaux. Il diffère de l'arabe dialectal (égyptien, marocain, syrien…). Si ton objectif est de comprendre ta prière, mémoriser le Coran ou suivre des cours de sciences islamiques, c'est par l'arabe coranique qu'il faut commencer." },
 {
 type: 'ul',
 items: [
 "Comprendre les sourates récitées en prière",
 "Accéder aux textes islamiques en langue d'origine",
 "Prérequis pour tout parcours en sciences islamiques",
 "Enrichir la récitation du Coran et la correction du Tajwid",
 ],
 },
 { type: 'h2', content: "Comparatif des meilleures plateformes en ligne (2026)" },
 {
 type: 'table',
 headers: ['Plateforme', 'Langue', 'Format', 'Prix', 'Pour qui'],
 rows: [
 ['Bayyinah TV', 'Anglais', 'Vidéos + live', '~13€/mois', 'Intermédiaire–avancé'],
 ['IESH en ligne', 'Français', 'Cours structurés', 'Sur devis', 'Tous niveaux'],
 ['Al-Kalam Institut', 'Français', 'Vidéos + exercices', 'Abonnement', 'Débutant–intermédiaire'],
 ['Al-Hadith.fr', 'Français', 'Cours gratuits', 'Gratuit', 'Tous niveaux'],
 ['Professeur particulier (Égypte)', 'Arabe/Français', 'Zoom/Skype', '5–15€/h', 'Tous niveaux'],
 ['YouTube mosquées françaises', 'Français', 'Live + replay', 'Gratuit', 'Débutant'],
 ],
 },
 { type: 'h2', content: "Bayyinah TV — La référence mondiale pour l'arabe coranique" },
 { type: 'p', content: "Fondée par Nouman Ali Khan, Bayyinah TV est la plateforme la plus reconnue au monde pour l'arabe coranique et le tafsir. Le contenu est en anglais, mais la qualité pédagogique est exceptionnelle. Le programme « Dream » est particulièrement recommandé pour les débutants qui maîtrisent l'anglais. Abonnement autour de 13$/mois avec accès à des centaines d'heures de contenu." },
 {
 type: 'callout',
 icon: '',
 title: 'Astuce',
 content: "Si tu n'es pas à l'aise en anglais, commence par Al-Kalam ou les cours YouTube des mosquées françaises. Reviens sur Bayyinah quand tu auras les bases.",
 },
 { type: 'h2', content: "Les cours particuliers avec des professeurs égyptiens — le bon plan caché" },
 { type: 'p', content: "Des centaines de professeurs arabophones basés en Égypte, Syrie ou Maroc proposent des cours particuliers via Zoom ou Skype. La qualité est souvent excellente (professeurs diplômés d'Al-Azhar ou d'universités islamiques), et les tarifs sont imbattables : entre 5€ et 15€ de l'heure. Idéal pour la correction de Tajwid et la mémorisation du Coran. On trouve ces professeurs sur des groupes Facebook, des plateformes comme Preply, ou via le bouche-à-oreille dans les mosquées." },
 { type: 'h2', content: "Les mosquées françaises sur YouTube — gratuit et communautaire" },
 { type: 'p', content: "De nombreuses mosquées d'Île-de-France diffusent leurs cours en direct sur YouTube : Grande Mosquée de Paris, Mosquée de Stains, Institut Al-Ghazali, Oussoul Eddine… Ces cours sont entièrement gratuits, en français, et le replay est souvent disponible. Excellent point de départ avant d'investir dans une formation payante." },
 { type: 'h2', content: "Comment choisir selon ton profil ?" },
 {
 type: 'ul',
 items: [
 "Débutant complet, budget limité → YouTube mosquées françaises + Al-Hadith.fr (gratuit)",
 "Débutant avec budget → Al-Kalam Institut ou IESH en ligne",
 "Tu maîtrises l'anglais → Bayyinah TV (meilleur rapport qualité/prix mondial)",
 "Tu veux corriger ta récitation → Cours particulier avec professeur égyptien (5-15€/h)",
 "Objectif diplôme → IESH (présentiel Paris + distanciel), seul à délivrer des attestations reconnues en France",
 ],
 },
 {
 type: 'cta',
 label: 'Voir tous les instituts et cours en IDF',
 href: '/education',
 desc: 'Cours en présentiel, en ligne, mosquées et professeurs particuliers référencés sur Al-Wasil',
 },
 {
 type: 'faq',
 items: [
 { q: "Combien de temps pour apprendre l'arabe coranique ?", a: "Avec 30 min/jour régulières, on peut lire l'arabe phonétiquement en 3 à 6 mois. La compréhension réelle du Coran demande 2 à 4 ans de travail régulier. L'objectif court terme atteignable : reconnaître les mots fréquents du Coran en 6 mois." },
 { q: "Quelle différence entre arabe coranique et arabe parlé ?", a: "L'arabe coranique (fusha classique) est la langue du Coran, figée dans sa forme. L'arabe dialectal (égyptien, marocain, algérien…) est la langue parlée au quotidien, qui varie selon les pays. Les deux ont une base commune mais des différences notables. Pour les musulmans, le coranique est prioritaire." },
 { q: "Peut-on apprendre l'arabe sans professeur ?", a: "Oui, pour les bases phonétiques et la lecture. Mais la correction de la prononciation (Tajwid) nécessite un professeur. Les applications et vidéos suffisent pour débuter, mais un professeur même occasionnel améliore considérablement la progression." },
 { q: "Bayyinah TV est-il adapté aux débutants ?", a: "Oui, le programme 'Arabic with Husna' est pensé pour les débutants absolus. Le programme 'Dream' est pour les intermédiaires. Le contenu est en anglais — si c'est un obstacle, commence par Al-Kalam en français." },
 ],
 },
 ],
 },

 // ────────────────────────────────────────────────────────
 // ARTICLE 2 : Voile au travail
 // ────────────────────────────────────────────────────────
 {
 slug: 'porter-voile-travail-droits-france',
 title: "Porter le voile au travail en France : vos droits expliqués clairement (2026)",
 metaTitle: "Voile au travail France 2026 — Droits, loi, que faire si refus",
 metaDescription: "Peut-on porter le voile au travail en France ? Secteur privé, public, clause de neutralité... Vos droits expliqués clairement avec les recours en cas de discrimination.",
 category: 'Justice & Droits',
 categoryColor: '#6366f1',
 date: '2026-03-15',
 lastUpdated: '2026-03-15',
 readTime: '9 min',
 excerpt: "Secteur privé, public, client final — les règles ne sont pas les mêmes partout. Ce guide résume vos droits, les cas de discrimination et les recours possibles.",
 tags: ['voile', 'travail', 'droits', 'laïcité', 'discrimination', 'hijab'],
 featured: true,
 blocks: [
 {
 type: 'intro',
 content: "La question du port du voile au travail revient constamment dans les discussions de la communauté musulmane française. Les règles varient selon que tu travailles dans le secteur public, le secteur privé, ou en contact avec des clients. Ce guide fait le point sur ce que dit la loi en 2026, dans un langage clair et direct.",
 },
 {
 type: 'callout',
 icon: '',
 title: 'Réponse courte',
 content: "Dans le secteur privé : le voile est autorisé par défaut. Un employeur ne peut l'interdire que s'il a une clause de neutralité dans son règlement intérieur, justifiée par un contact direct avec des clients. Dans le secteur public : le port de signes religieux est interdit pour les agents publics (fonctionnaires). Il ne s'applique pas aux usagers.",
 },
 { type: 'h2', content: "Secteur privé : le voile est légal sauf clause de neutralité" },
 { type: 'p', content: "En France, le Code du travail interdit toute discrimination basée sur la religion. Un employeur privé ne peut donc pas interdire le voile uniquement pour des raisons personnelles ou de politique d'entreprise. La seule exception : une clause de neutralité rédigée dans le règlement intérieur, applicable à tous les signes religieux, politiques et philosophiques de manière égale, et justifiée par des contraintes opérationnelles (contact direct avec la clientèle, nécessité de cohésion d'image)." },
 { type: 'h3', content: "Les conditions pour qu'une clause de neutralité soit légale" },
 {
 type: 'ul',
 items: [
 "Elle doit figurer dans le règlement intérieur (pas seulement dans un email ou une consigne orale)",
 "Elle doit s'appliquer à TOUS les signes religieux, pas seulement islamiques",
 "Elle doit être justifiée par des contraintes réelles (pas juste l'image de marque subjective)",
 "Elle ne peut s'appliquer qu'aux postes avec contact direct avec la clientèle (pas aux postes back-office)",
 "Elle doit être proportionnée — l'employeur doit d'abord envisager un reclassement interne",
 ],
 },
 { type: 'h2', content: "Secteur public : la laïcité s'applique aux agents, pas aux usagers" },
 { type: 'p', content: "Si tu es fonctionnaire ou agent contractuel de la fonction publique (État, hôpital, collectivité), le port de signes religieux t'est interdit dans l'exercice de tes fonctions. C'est le principe de neutralité des services publics, confirmé par la loi de 1905 et la jurisprudence. En revanche, les usagers des services publics (patients, administrés, parents d'élèves accompagnateurs de sorties scolaires dans certains cas) ont le droit de porter le voile." },
 {
 type: 'callout',
 icon: '',
 title: 'Cas particulier : les accompagnatrices scolaires',
 content: "Depuis 2019, la circulaire Blanquer recommande aux établissements scolaires de demander aux parents accompagnateurs de ne pas porter de signes religieux. Cette recommandation n'a pas force de loi — un tribunal administratif a rappelé en 2023 que les parents accompagnateurs ne sont pas soumis au principe de neutralité. Mais la pratique varie selon les établissements.",
 },
 { type: 'h2', content: "Que faire si ton employeur refuse ton voile illégalement ?" },
 {
 type: 'ol',
 items: [
 "Demande d'abord à voir le règlement intérieur par écrit",
 "Si aucune clause de neutralité n'existe, la demande est illégale — signale-le à ton employeur par écrit (mail ou courrier recommandé)",
 "Contacte le Défenseur des Droits (formulaire en ligne, gratuit, anonyme) — c'est l'autorité indépendante pour les discriminations",
 "Contacte une association spécialisée : Lallab, le CCIF/CCIE, ou un avocat en droit social",
 "Si ça persiste : saisine des prud'hommes pour discrimination religieuse (délit puni jusqu'à 3 ans de prison et 45 000€ d'amende pour l'employeur)",
 ],
 },
 {
 type: 'cta',
 label: 'Ressources juridiques — Justice & Droits',
 href: '/justice',
 desc: 'Associations, avocats, Défenseur des Droits, signalement ARCOM… Tous les recours disponibles sur Al-Wasil',
 },
 {
 type: 'faq',
 items: [
 { q: "Un employeur peut-il refuser d'embaucher une femme voilée ?", a: "Non, c'est illégal. Refuser une embauche en raison du port du voile constitue une discrimination à l'embauche basée sur la religion, sanctionnée par le Code pénal. Difficile à prouver mais possible avec des preuves (mails, témoins). Le Défenseur des Droits peut accompagner la démarche." },
 { q: "La laïcité s'applique-t-elle aux entreprises privées ?", a: "Non. La laïcité est un principe qui s'applique à l'État et ses institutions, pas aux entreprises privées. Une entreprise privée ne peut imposer la neutralité religieuse qu'à travers une clause légalement encadrée dans son règlement intérieur." },
 { q: "Peut-on porter le voile dans une école ou université ?", a: "Dans les lycées et collèges publics, le port de signes religieux ostensibles est interdit pour les élèves depuis la loi de 2004. Dans l'enseignement supérieur (universités, grandes écoles), le voile est autorisé pour les étudiantes. Dans les établissements privés hors contrat, chaque établissement fixe ses règles." },
 { q: "Mon employeur peut-il m'affecter à un poste sans contact client pour cause de voile ?", a: "Si une clause de neutralité existe pour les postes en contact client, l'employeur doit d'abord vous proposer un reclassement sur un poste non concerné avant toute autre mesure. Il ne peut pas vous licencier directement." },
 ],
 },
 ],
 },

 // ────────────────────────────────────────────────────────
 // ARTICLE 3 : Piscines burkini IDF
 // ────────────────────────────────────────────────────────
 {
 slug: 'piscines-burkini-ile-de-france-2026',
 title: "Piscines burkini en Île-de-France 2026 : créneaux, horaires et bons plans",
 metaTitle: "Piscines burkini Île-de-France 2026 — Créneaux et horaires",
 metaDescription: "Toutes les piscines qui acceptent le burkini en Île-de-France avec les créneaux réservés, horaires et tarifs 2026. Paris, 93, 94, 91, 78, 77, 95.",
 category: 'Bien-être',
 categoryColor: '#3b82f6',
 date: '2026-03-10',
 lastUpdated: '2026-03-10',
 readTime: '5 min',
 excerpt: "Trouver un créneau burkini en IDF n'est pas toujours simple. On recense toutes les piscines qui proposent des créneaux réservés, avec horaires et tarifs à jour.",
 tags: ['piscine', 'burkini', 'IDF', 'sport', 'femmes', 'natation'],
 featured: false,
 blocks: [
 {
 type: 'intro',
 content: "Le burkini est un maillot de bain couvrant (combinaison + bonnet) légal en France. Depuis 2022, plusieurs piscines publiques d'Île-de-France ont mis en place des créneaux dédiés, suite à une évolution des règlements intérieurs des centres nautiques. Ce guide centralise les informations à jour pour 2026.",
 },
 {
 type: 'callout',
 icon: '',
 title: 'Le burkini est légal en France',
 content: "Aucune loi française n'interdit le burkini dans les piscines publiques. Les interdictions locales ont été annulées par les tribunaux administratifs. Depuis 2023, plusieurs villes ont officiellement mis en place des créneaux dédiés. Un refus d'accès avec un burkini conforme (bonnet de bain inclus) peut constituer une discrimination.",
 },
 { type: 'h2', content: "Piscines avec créneaux burkini réguliers en IDF" },
 { type: 'p', content: "Les créneaux varient selon les saisons et peuvent changer — vérifiez toujours auprès de la piscine avant de vous déplacer. Al-Wasil met à jour ces informations régulièrement." },
 {
 type: 'cta',
 label: 'Voir la liste complète des piscines burkini',
 href: '/piscines',
 desc: 'Créneaux, horaires, tarifs et adresses — toutes les piscines référencées en temps réel sur Al-Wasil',
 },
 { type: 'h2', content: "Ce qu'il faut savoir avant d'y aller" },
 {
 type: 'ul',
 items: [
 "Le bonnet de bain est obligatoire dans toutes les piscines publiques françaises, y compris avec un burkini — prévoyez-en un adapté",
 "Le burkini doit être réservé à la baignade (pas porté ailleurs dans l'établissement)",
 "Certaines piscines demandent que le burkini soit neuf ou clairement dédié à la natation",
 "Les créneaux dédiés sont souvent mixtes mais à majorité féminine — renseignez-vous sur la composition",
 "Hors créneaux dédiés, le règlement intérieur de chaque piscine s'applique — pas de garantie",
 ],
 },
 { type: 'h2', content: "Créneaux Ramadan : attention aux horaires spéciaux" },
 { type: 'p', content: "Plusieurs piscines ajoutent des créneaux burkini pendant le Ramadan, notamment le soir après le ftour. Ces créneaux temporaires ne sont pas toujours annoncés longtemps à l'avance — suivez les réseaux sociaux des centres nautiques de votre département et vérifiez sur Al-Wasil." },
 { type: 'h2', content: "Que faire si on vous refuse l'accès ?" },
 {
 type: 'ol',
 items: [
 "Demandez la raison du refus par écrit (email à la direction du centre nautique)",
 "Vérifiez le règlement intérieur — s'il n'interdit pas explicitement le burkini, le refus est contestable",
 "Contactez la mairie dont dépend la piscine",
 "En cas de discrimination persistante, saisissez le Défenseur des Droits (formulaire en ligne gratuit)",
 ],
 },
 {
 type: 'faq',
 items: [
 { q: "Le burkini est-il interdit dans les piscines françaises ?", a: "Non. Aucune loi française n'interdit le burkini dans les piscines publiques. Des interdictions locales ont existé mais ont été annulées par les tribunaux. En 2025-2026, plusieurs piscines publiques en IDF ont officiellement ouvert des créneaux dédiés." },
 { q: "Faut-il un bonnet de bain spécial pour le burkini ?", a: "Oui, le bonnet de bain est obligatoire dans toutes les piscines publiques françaises. Des bonnets adaptés aux cheveux couverts et aux formats plus larges existent. Certaines marques (Decathlon, Speedo) proposent des bonnets pour burkini." },
 { q: "Peut-on aller à la piscine en dehors des créneaux dédiés avec un burkini ?", a: "Cela dépend du règlement intérieur de chaque piscine. Certaines l'autorisent à tous les créneaux, d'autres uniquement aux créneaux dédiés. Appelez avant de vous déplacer." },
 ],
 },
 ],
 },

 // ────────────────────────────────────────────────────────
 // ARTICLE 4 : Espace de prière au travail
 // ────────────────────────────────────────────────────────
 {
 slug: 'prayer-space-travail-france',
 title: "Espace de prière au travail en France : droits, demande et alternatives (2026)",
 metaTitle: "Espace prière au travail France 2026 — Droits et comment demander",
 metaDescription: "La loi oblige-t-elle les employeurs à prévoir un espace de prière ? Comment demander, négocier, et quelles alternatives en cas de refus. Guide complet 2026.",
 category: 'Justice & Droits',
 categoryColor: '#6366f1',
 date: '2026-03-05',
 lastUpdated: '2026-03-05',
 readTime: '7 min',
 excerpt: "La loi française ne prévoit pas d'obligation pour l'employeur, mais rien n'interdit non plus. Voici comment négocier un espace de prière et ce que dit la jurisprudence.",
 tags: ['prière', 'travail', 'droits', 'espace prière', 'emploi', 'muslimfriendly'],
 featured: false,
 blocks: [
 {
 type: 'intro',
 content: "Beaucoup de musulmans français se retrouvent face à un dilemme quotidien au travail : comment prier à l'heure sans déranger, sans se cacher, et sans conflit avec l'employeur ? Ce guide fait le point sur vos droits, les bonnes pratiques pour faire une demande, et les alternatives si votre lieu de travail ne peut pas s'adapter.",
 },
 {
 type: 'callout',
 icon: '',
 title: 'Ce que dit la loi',
 content: "Il n'existe pas en France d'obligation légale pour l'employeur de prévoir un local de prière. Cependant, la liberté de religion est garantie par la Constitution et les engagements internationaux de la France. Un employeur ne peut pas interdire les prières pendant les pauses légales, ni sanctionner pour motif religieux.",
 },
 { type: 'h2', content: "Ce que vous avez le droit de faire sans demande préalable" },
 {
 type: 'ul',
 items: [
 "Prier pendant votre pause déjeuner, dans un espace retiré (voiture, couloir vide, extérieur) — c'est votre temps libre",
 "Utiliser vos pauses réglementaires (10-15 min légales dans la journée) pour prier",
 "Demander un aménagement d'horaires ponctuel pour les prières importantes — à titre personnel",
 "Pratiquer votre religion discrètement sans avoir à vous justifier à vos collègues",
 ],
 },
 { type: 'h2', content: "Comment faire une demande d'espace de prière à son employeur ?" },
 { type: 'p', content: "La demande bien faite augmente considérablement les chances d'obtenir un accord. Voici la méthode qui fonctionne :" },
 {
 type: 'ol',
 items: [
 "Commencez par une conversation informelle avec votre manager direct — pas les RH d'emblée",
 "Formulez comme un besoin pratique : 'J'aurais besoin d'un espace calme 5 minutes à telle heure, une salle de réunion vide ou un bureau libre suffirait'",
 "Proposez une solution concrète déjà identifiée (salle de réunion non occupée, local technique, espace extérieur…)",
 "Soyez flexible sur le lieu — ce n'est pas forcément une pièce dédiée à la religion",
 "Mettez la demande par écrit après l'accord oral, pour formaliser",
 ],
 },
 { type: 'h2', content: "Les entreprises Muslim-Friendly existent" },
 { type: 'p', content: "De plus en plus d'entreprises françaises — notamment dans les secteurs tech, conseil, et start-ups — intègrent des salles de prière dans leurs locaux, au même titre que des salles de méditation ou de bien-être. Sur Al-Wasil, la section Emploi référence les offres d'entreprises qui acceptent le voile et les aménagements religieux." },
 {
 type: 'cta',
 label: 'Offres d\'emploi Muslim-Friendly',
 href: '/jobs',
 desc: 'Entreprises qui acceptent le voile, les aménagements de prière, et valorisent la diversité religieuse',
 },
 { type: 'h2', content: "Trouver un espace de prière près de son lieu de travail" },
 { type: 'p', content: "Si votre lieu de travail ne dispose pas d'espace de prière, de nombreuses mosquées et salles communautaires en Île-de-France ouvrent leurs portes aux travailleurs lors des pauses. Renseignez-vous auprès de la mosquée la plus proche de votre lieu de travail." },
 {
 type: 'faq',
 items: [
 { q: "Un employeur peut-il interdire de prier au travail ?", a: "Il peut encadrer la pratique (pas pendant les heures de travail effectif, pas dans des espaces qui dérangent le flux de travail), mais il ne peut pas interdire de prier pendant les pauses légales ou dans son temps libre. Une interdiction générale serait discriminatoire." },
 { q: "Peut-on être licencié pour avoir prié au travail ?", a: "Un licenciement pour motif religieux est illégal. Si vous étiez en pause, dans un espace approprié, et que cela n'a pas gêné le fonctionnement de l'entreprise, un licenciement serait juridiquement contestable aux prud'hommes." },
 { q: "Comment aborder le Ramadan avec son employeur ?", a: "Anticipez en informant votre manager quelques semaines avant. Proposez des solutions pratiques (décalage d'horaires, télétravail pour les prières du soir). La plupart des managers apprécient d'être prévenus à l'avance plutôt que de découvrir les contraintes au dernier moment." },
 ],
 },
 ],
 },

 // ────────────────────────────────────────────────────────
 // ARTICLE 5 : Comparatif instituts islamiques
 // ────────────────────────────────────────────────────────
 {
 slug: 'instituts-islamiques-france-comparatif',
 title: "Instituts islamiques en France : comparatif IESH, Oussoul Eddine, Al-Kalam (2026)",
 metaTitle: "Comparatif instituts islamiques France 2026 — IESH, Oussoul Eddine, Al-Kalam",
 metaDescription: "Quel institut islamique choisir en France ? Comparatif complet IESH, Oussoul Eddine, IFI, Al-Kalam avec programmes, formats, niveaux et tarifs 2026.",
 category: 'Apprentissage',
 categoryColor: '#c9973a',
 date: '2026-02-28',
 lastUpdated: '2026-02-28',
 readTime: '10 min',
 excerpt: "Quel institut choisir pour apprendre les sciences islamiques ? Comparaison des programmes, formats (présentiel/distanciel), niveaux et tarifs des principaux instituts français.",
 tags: ['instituts', 'sciences islamiques', 'IESH', 'Oussoul Eddine', 'apprentissage', 'France'],
 featured: true,
 blocks: [
 {
 type: 'intro',
 content: "Apprendre les sciences islamiques de manière structurée en France est aujourd'hui possible grâce à plusieurs instituts sérieux. Mais le choix n'est pas toujours simple : programmes différents, formats variés, niveaux et tarifs hétérogènes. Ce comparatif aide à y voir clair pour 2026.",
 },
 { type: 'h2', content: "Les critères pour choisir un institut islamique" },
 {
 type: 'ul',
 items: [
 "Niveau de départ : débutant absolu, bases acquises, ou déjà avancé ?",
 "Format souhaité : présentiel (déplacement nécessaire), distanciel (depuis chez soi), ou hybride",
 "Objectif : Coran/Tajwid, langue arabe, sciences islamiques complètes, ou diplôme certifiant",
 "Budget : de gratuit (YouTube) à plusieurs centaines d'euros/an pour les formations diplômantes",
 "Audience : hommes seuls, femmes seules, ou mixte",
 ],
 },
 { type: 'h2', content: "IESH — Institut Européen des Sciences Humaines" },
 { type: 'p', content: "L'IESH est la référence historique en France pour les sciences islamiques. Fondé dans les années 1990, il propose une formation diplômante complète (5 ans) en arabe, fiqh, aqida, tafsir, hadith et sirah. Basé à Château-Chinon avec une antenne à Paris. Cours en présentiel et à distance. Il délivre des attestations reconnues dans le milieu associatif et académique islamique en Europe." },
 {
 type: 'callout',
 icon: '',
 title: 'IESH en bref',
 content: "Pour : formation diplômante la plus complète de France, sérieux académique reconnu, hommes et femmes. Contre : engagement long (5 ans pour la formation complète), coût plus élevé que des alternatives en ligne.",
 },
 { type: 'h2', content: "Oussoul Eddine" },
 { type: 'p', content: "Oussoul Eddine est l'un des instituts les plus actifs en Île-de-France, avec une forte présence en ligne. Il propose des formations en sciences islamiques par niveaux (initiation, approfondissement, avancé), en arabe, fiqh et aqida. Très apprécié pour la clarté pédagogique et l'accessibilité du contenu. Format hybride (présentiel IDF + distanciel pour toute la France)." },
 {
 type: 'callout',
 icon: '⭐',
 title: 'Oussoul Eddine en bref',
 content: "Pour : très accessible aux débutants, bonne pédagogie, fort ancrage IDF, contenu en ligne de qualité. Contre : moins de reconnaissance formelle que l'IESH pour un cursus certifiant long.",
 },
 { type: 'h2', content: "Al-Kalam Institut" },
 { type: 'p', content: "Al-Kalam est une plateforme 100% en ligne proposant des cours d'arabe classique, Coran, Tajwid et sciences islamiques en français. Points forts : interface moderne, exercices pratiques, flexibilité totale des horaires. Idéal pour les actifs qui ne peuvent pas se déplacer." },
 { type: 'h2', content: "Comparatif synthétique 2026" },
 {
 type: 'table',
 headers: ['Institut', 'Format', 'Spécialité', 'Durée', 'Public'],
 rows: [
 ['IESH', 'Présentiel + distanciel', 'Sciences islamiques complètes', '1 à 5 ans', 'H + F, adultes'],
 ['Oussoul Eddine', 'Hybride', 'Sciences islamiques + arabe', 'Par niveau', 'H + F, adultes'],
 ['Al-Kalam', '100% en ligne', 'Arabe + Coran + SI', 'Flexible', 'H + F, adultes'],
 ['Al-Ghazali (GMP)', 'Présentiel Paris', 'Arabe classique + SI', '1 à 3 ans', 'H + F, adultes'],
 ['Mosquées locales', 'Présentiel', 'Coran, Tajwid, arabe', 'Hebdomadaire', 'H + F + enfants'],
 ],
 },
 {
 type: 'cta',
 label: 'Voir tous les instituts sur Al-Wasil',
 href: '/education',
 desc: 'Filtre par département, type (Institut / Mosquée / Prof particulier / En ligne), cours et format',
 },
 {
 type: 'faq',
 items: [
 { q: "Quel est le meilleur institut islamique en France ?", a: "Il n'y a pas de réponse unique. L'IESH est la référence pour une formation diplômante longue. Oussoul Eddine est idéal pour l'IDF avec une approche accessible. Al-Kalam convient aux actifs qui veulent de la flexibilité. Le choix dépend de votre objectif, de votre lieu de résidence et de votre disponibilité." },
 { q: "Peut-on apprendre les sciences islamiques en ligne sérieusement ?", a: "Oui, absolument. L'IESH, Oussoul Eddine et Al-Kalam proposent tous des cursus en ligne de qualité. La discipline personnelle est plus importante que le format. Beaucoup de musulmans actifs ont complété des formations sérieuses entièrement à distance." },
 { q: "Les formations des instituts français sont-elles reconnues ?", a: "Elles ne sont pas reconnues par l'État français (pas de diplôme d'État). Mais elles sont reconnues dans le milieu islamique français et européen. L'IESH est l'établissement le plus reconnu dans ce cadre." },
 ],
 },
 ],
 },

 // ────────────────────────────────────────────────────────
 // ARTICLE 6 : Hijama
 // ────────────────────────────────────────────────────────
 {
 slug: 'hijama-paris-idf-guide',
 title: "Hijama à Paris et en Île-de-France : trouver un praticien sérieux (guide 2026)",
 metaTitle: "Hijama Paris IDF 2026 — Trouver un praticien sérieux",
 metaDescription: "Comment trouver un praticien hijama sérieux à Paris et en Île-de-France ? Prix, certifications, précautions, bonnes pratiques. Guide complet 2026.",
 category: 'Santé',
 categoryColor: '#ef4444',
 date: '2026-02-20',
 lastUpdated: '2026-02-20',
 readTime: '6 min',
 excerpt: "La hijama connaît un vrai renouveau. Mais comment trouver un praticien formé et sérieux ? Ce guide répond à toutes vos questions.",
 tags: ['hijama', 'santé', 'Paris', 'IDF', 'cupping', 'médecine prophétique'],
 featured: false,
 blocks: [
 {
 type: 'intro',
 content: "La hijama (cupping thérapeutique, ou ventouses) est une pratique de médecine traditionnelle mentionnée dans la Sunnah prophétique. Elle connaît un renouveau important en France, notamment en Île-de-France. Mais entre praticiens sérieux et personnes non formées, il faut savoir comment choisir pour pratiquer en toute sécurité.",
 },
 { type: 'h2', content: "Qu'est-ce que la hijama ?" },
 { type: 'p', content: "La hijama est une technique de thérapie par ventouses qui consiste à créer une dépression sur la peau à l'aide de ventouses (souvent en verre ou en plastique), avec ou sans scarification superficielle pour favoriser l'élimination de sang stagnant. Elle se pratique sur des points précis du corps et est considérée comme une médecine prophétique (tibb an-nabawi) — le Prophète ﷺ l'a recommandée dans plusieurs hadiths authentiques." },
 {
 type: 'callout',
 icon: '',
 title: 'Hijama et Sunnah',
 content: "Le Prophète Mohammed ﷺ a dit : 'La meilleure thérapie que vous utilisiez est la hijama' (Sahih al-Bukhari). Les jours recommandés sont le 17, 19 et 21 du mois lunaire. Consultez le calendrier islamique pour ces dates.",
 },
 { type: 'h2', content: "Comment reconnaître un praticien sérieux ?" },
 {
 type: 'ul',
 items: [
 "Formation certifiée : cherchez des praticiens ayant suivi une formation accréditée (British Cupping Society, formations françaises reconnues)",
 "Matériel à usage unique : les ventouses et les instruments de scarification doivent être nouveaux pour chaque client — demandez-le avant la séance",
 "Localisation propre : le lieu doit répondre à des standards d'hygiène basiques (surface propre, pas d'humidité, matériel stérilisé)",
 "Antécédents médicaux : un praticien sérieux vous demande vos antécédents et contre-indications avant la séance",
 "Pas de diagnostic médical : la hijama est complémentaire, pas un remplacement à la médecine conventionnelle",
 ],
 },
 { type: 'h2', content: "Prix moyens en IDF (2026)" },
 {
 type: 'table',
 headers: ['Type de séance', 'Prix moyen', 'Durée'],
 rows: [
 ['Hijama sèche (ventouses sans scarification)', '30–50€', '45 min'],
 ['Hijama humide (avec scarification — points classiques)', '60–100€', '60–90 min'],
 ['Séance complète (dos + nuque + points spécifiques)', '80–120€', '90 min'],
 ],
 },
 { type: 'h2', content: "Contre-indications importantes" },
 {
 type: 'ul',
 items: [
 "Grossesse (déconseillé sauf sur avis médical)",
 "Prise d'anticoagulants (Warfarine, Aspirine à fortes doses…)",
 "Trouble de la coagulation sanguine",
 "Plaies ouvertes, infection cutanée sur les zones de traitement",
 "Hémophilie",
 "Jeûne strict du Ramadan (selon les avis, la hijama peut rompre le jeûne — consultez votre imam)",
 ],
 },
 {
 type: 'cta',
 label: 'Praticiens hijama référencés en IDF',
 href: '/sante',
 desc: 'Psychologues, hijama, roqya, sage-femmes et médecins muslimah référencés sur Al-Wasil',
 },
 {
 type: 'faq',
 items: [
 { q: "La hijama est-elle remboursée par la Sécurité Sociale ?", a: "Non. La hijama n'est pas reconnue comme acte médical par la Sécurité Sociale française et n'est donc pas remboursée. Certaines mutuelles couvrent partiellement les médecines alternatives — renseignez-vous auprès de votre mutuelle." },
 { q: "La hijama rompt-elle le jeûne du Ramadan ?", a: "Il y a divergence d'opinions entre les savants islamiques. Le Comité de la Grande Mosquée de Paris et certains savants considèrent qu'elle ne rompt pas le jeûne (position hanafi et maliki majoritaire en France). D'autres savants considèrent qu'elle le rompt. Consultez l'imam de votre mosquée pour suivre l'avis que vous considérez." },
 { q: "Quelle différence entre hijama et ventouses chinoises ?", a: "Les ventouses chinoises (cupping de la médecine traditionnelle chinoise) sont généralement 'sèches' — sans scarification. La hijama islamique utilise traditionnellement la scarification légère pour laisser s'écouler le sang. Les deux techniques utilisent la dépression, mais les points et l'objectif thérapeutique diffèrent." },
 { q: "Peut-on faire la hijama seul chez soi ?", a: "Les praticiens déconseillent fortement l'auto-hijama sans formation. Les risques d'infection, de mauvais positionnement des ventouses et de blessure involontaire sont réels. Commencez toujours par un praticien certifié." },
 ],
 },
 ],
 },
];

export function getArticleBySlug(slug: string): Article | undefined {
 return articles.find(a => a.slug === slug);
}
