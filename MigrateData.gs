// ============================================================
// MigrateData.gs — Migration des données statiques TypeScript
//                  vers les onglets du Google Sheet BDD public
//
// Sheet BDD public : 1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU
//
// Onglets créés / remplis :
//   - Cagnottes           (10 cagnottes)
//   - Events              (10 événements)
//   - Piscines            (8 piscines)
//   - Librairies          (10 librairies)
//   - Emploi              (8 offres)
//   - Talents             (6 profils)
//   - Hajj_Agences        (5 agences)
//   - Hajj_Packages       (8 packages)
//   - Instituts           (15 instituts)
//   - Sante_Psy           (6 psys)
//   - Sante_Hijama        (5 praticiens)
//   - Sante_Roqya         (4 praticiens)
//   - Sante_Medical       (5 médecins/sages-femmes)
//   - Initiatives         (6 initiatives solidaires)
//   - Associations        (10 associations)
//   - Voyages_Humanitaires(5 voyages)
//
// UTILISATION :
//   1. Coller ce script dans Apps Script du projet existant
//   2. Exécuter migrateAll() pour tout peupler d'un coup
//   3. Ou exécuter chaque fonction séparément
// ============================================================

var BDD_ID = '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU';

// ── Utilitaire : créer ou vider un onglet ─────────────────────

function getOrCreateSheet(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    Logger.log('Onglet créé : ' + name);
  } else {
    sh.clearContents();
    Logger.log('Onglet vidé : ' + name);
  }
  return sh;
}

function setHeaders(sh, headers) {
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sh.setFrozenRows(1);
}

// ── ENTRY POINT ───────────────────────────────────────────────

function migrateAll() {
  var ss = SpreadsheetApp.openById(BDD_ID);
  Logger.log('=== Début migration complète ===');

  migrateCagnottes(ss);
  migrateEvents(ss);
  migratePiscines(ss);
  migrateLibrairies(ss);
  migrateEmploi(ss);
  migrateTalents(ss);
  migrateHajjAgences(ss);
  migrateHajjPackages(ss);
  migrateInstituts(ss);
  migrateSantePsy(ss);
  migrateSanteHijama(ss);
  migrateSanteRoqya(ss);
  migrateSanteMedical(ss);
  migrateInitiatives(ss);
  migrateAssociations(ss);
  migrateVoyagesHumanitaires(ss);

  Logger.log('=== Migration terminée ✅ ===');
}

// ============================================================
// 1. CAGNOTTES
// Colonnes : id | titre | organisateur | description | url |
//            image_url | categorie | ville | departement |
//            date_debut | date_fin | objectif | montant_collecte |
//            nb_donateurs | pourcentage | is_active | source | derniere_maj
// ============================================================

function migrateCagnottes(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Cagnottes');

  var headers = [
    'id','titre','organisateur','description','url','image_url',
    'categorie','ville','departement','date_debut','date_fin',
    'objectif','montant_collecte','nb_donateurs','pourcentage',
    'is_active','source','derniere_maj'
  ];
  setHeaders(sh, headers);

  var today = new Date().toISOString().split('T')[0];

  var rows = [
    ['gaza-urgence','Aide d\'urgence — Familles de Gaza','Human Appeal France',
     'Aide alimentaire, médicale et abris d\'urgence pour les familles déplacées à Gaza. Reçu fiscal disponible.',
     'https://www.launchgood.com/campaign/help_gaza_families','','palestine','','',
     '','',200000,142000,3842,71,'TRUE','launchgood',today],

    ['puits-afrique','Construction de puits — Mali & Sénégal','Secours Islamique France',
     'Un puits = des centaines de familles alimentées en eau potable. L\'eau comme sadaqa jariya.',
     'https://www.launchgood.com/campaign/water_wells_africa','','eau-puits','','',
     '','',50000,28500,612,57,'TRUE','launchgood',today],

    ['mosquee-paris-reno','Rénovation Salle de Prière — Mosquée Al-Fath','Association Al-Fath',
     'La salle de prière principale a besoin d\'une rénovation urgente pour accueillir les frères et sœurs dans de meilleures conditions.',
     'https://www.helloasso.com/associations/al-fath','','mosquee','Paris','75',
     '','',25000,11200,189,45,'TRUE','helloasso',today],

    ['corans-prison','Distribution de Corans en prison','Aumônerie Musulmane de France',
     'Offrir le Coran et des livres islamiques aux détenus musulmans. Chaque livre peut changer une vie.',
     'https://www.helloasso.com/associations/aumonerie-musulmane','','education','France','',
     '','',8000,4300,97,54,'TRUE','helloasso',today],

    ['orphelins-syrie','Parrainage d\'orphelins — Syrie','La Maison des Orphelins',
     'Parrainez un orphelin syrien : scolarité, nourriture et soins médicaux. À partir de 1€/jour.',
     'https://www.launchgood.com/campaign/orphan_sponsorship_syria','','orphelins','','',
     '','',100000,67000,1240,67,'TRUE','launchgood',today],

    ['famille-sinistr-93','Famille sinistrée suite à incendie — Aubervilliers','Collectif Entraide 93',
     'Une famille de 5 enfants a tout perdu dans un incendie. Aide pour relogement et équipement urgent.',
     'https://www.leetchi.com/c/famille-aubervilliers','','famille','Aubervilliers','93',
     '','',6000,3200,78,53,'TRUE','leetchi',today],

    ['soudan-urgence','Urgence Soudan — Déplacés de guerre','Islamic Relief France',
     'Le conflit au Soudan a forcé des millions de personnes à fuir. Aide alimentaire d\'urgence.',
     'https://www.launchgood.com/campaign/sudan_emergency','','urgence','','',
     '','',150000,89000,2100,59,'TRUE','launchgood',today],

    ['ecole-coranique-93','Financement école coranique — Saint-Denis','Madrassa An-Nour',
     'Aider à financer le loyer et le matériel pédagogique pour 80 enfants qui apprennent le Coran et l\'arabe.',
     'https://www.helloasso.com/associations/madrassa-an-nour','','education','Saint-Denis','93',
     '','',12000,5800,134,48,'TRUE','helloasso',today],

    ['mosquee-construction-78','Construction mosquée — Versailles','Association Al-Barakah 78',
     'Premier lieu de culte digne à Versailles pour une communauté de 8 000 musulmans. La communauté attend depuis 20 ans.',
     'https://www.launchgood.com/v2/campaign/new_mosque_versailles','','mosquee','Versailles','78',
     '','',800000,340000,4200,43,'TRUE','launchgood',today],

    ['orphelins-gaza','Parrainage orphelins — Gaza','Human Appeal France',
     'Des milliers d\'enfants ont perdu leurs parents. Parrainage mensuel pour leur scolarité et leur avenir.',
     'https://www.launchgood.com/campaign/orphans_gaza','','orphelins','','',
     '','',500000,220000,5800,44,'TRUE','launchgood',today],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Cagnottes : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 2. EVENTS
// Colonnes : id | titre | categorie | date_debut | date_fin |
//            heure_debut | heure_fin | lieu | adresse | ville |
//            departement | organisateur | organisateur_url |
//            description | tags | format | url_inscription |
//            gratuit | prix | facebook_event_id | mosquee_id |
//            source | featured
// ============================================================

function migrateEvents(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Events');

  var headers = [
    'id','titre','categorie','date_debut','date_fin','heure_debut','heure_fin',
    'lieu','adresse','ville','departement','organisateur','organisateur_url',
    'description','tags','format','url_inscription','gratuit','prix',
    'facebook_event_id','mosquee_id','source','featured'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['conf-ethique-travail','Conférence : L\'Éthique au Travail en Islam','conference',
     '2026-03-28','','14h00','17h00','Grande Mosquée de Paris',
     '2 bis Place du Puits de l\'Ermite','Paris 5e','75','Institut Al-Ghazali',
     'https://www.mosqueedeparis.net',
     'Conférence sur les valeurs islamiques dans le monde professionnel : honnêteté, relations au travail, halal et transactions.',
     'travail,éthique,adultes','presentiel','','TRUE','','','','manual','TRUE'],

    ['maraude-gare-nord','Maraude Solidaire — Gare du Nord','maraude',
     '2026-03-29','','19h30','22h00','Gare du Nord',
     'Parvis de la Gare du Nord','Paris 10e','75','Au Cœur de la Fraternité',
     '',
     'Distribution de repas chauds et produits d\'hygiène aux personnes sans-abri. Venez avec votre bonne énergie !',
     'solidarité,sans-abri,bénévolat','presentiel','https://example.com','TRUE','','','','manual','TRUE'],

    ['webinaire-ia-2026','Webinaire : Comprendre les enjeux de l\'IA','webinaire',
     '2026-04-02','','20h00','21h30','En ligne (Zoom)',
     '','En ligne','00','Muslim Tech Network',
     '',
     'Tour d\'horizon des impacts de l\'intelligence artificielle sur la société et sur notre communauté. Questions/réponses en direct.',
     'technologie,IA,jeunes','enligne','https://example.com','TRUE','','','','manual','FALSE'],

    ['cours-arabe-evry','Cours d\'arabe intensif — Niveau débutant','cours',
     '2026-04-05','','10h00','13h00','Grande Mosquée d\'Évry',
     '','Évry-Courcouronnes','91','École Al-Houda',
     '',
     'Session d\'introduction à l\'alphabet arabe et à la prononciation. Tous niveaux bienvenus, débutants prioritaires.',
     'arabe,débutant,adultes','presentiel','','FALSE','10€','','','manual','FALSE'],

    ['iftar-collectif-93','Iftar Collectif & Solidaire','iftar',
     '2026-04-08','','19h45','','Mosquée de Saint-Denis',
     '','Saint-Denis','93','Association An-Nour',
     '',
     'Iftar communautaire ouvert à tous. Repas partagé, dou\'a collectif. Invitez vos voisins !',
     'Ramadan,iftar,communauté','presentiel','','TRUE','','','','manual','TRUE'],

    ['conf-droits-musulmans','Conférence : Vos droits en tant que musulman en France','conference',
     '2026-04-12','','15h00','17h30','Salle communautaire',
     '','Créteil','94','Collectif Justice & Foi',
     '',
     'Un avocat et un imam répondent ensemble à vos questions : port du voile au travail, prière, discriminations, recours légaux.',
     'droits,laïcité,voile,travail','presentiel','','TRUE','','','','manual','FALSE'],

    ['collecte-palestin-92','Collecte Humanitaire — Gaza','collecte',
     '2026-04-13','','09h00','17h00','Mosquée de Colombes',
     '','Colombes','92','Human Appeal France',
     '',
     'Collecte de dons pour les familles à Gaza. Vêtements, médicaments, et dons financiers. Reçu fiscal disponible.',
     'humanitaire,Gaza,collecte,don','presentiel','','TRUE','','','','manual','FALSE'],

    ['jeunesse-sport-93','Tournoi de foot inter-mosquées','jeunesse',
     '2026-04-19','','10h00','18h00','Stade municipal de Bobigny',
     '','Bobigny','93','Jeunes Musulmans de France — IDF',
     '',
     'Tournoi de football fraternité entre équipes des mosquées d\'Île-de-France. Remise de prix et barbecue halal.',
     'sport,foot,jeunesse,fraternité','presentiel','','TRUE','','','','manual','FALSE'],

    ['conf-femme-islam','La Femme dans le Coran — Cycle de conférences','conference',
     '2026-04-20','','14h00','16h00','Centre Islamique de Mantes',
     '','Mantes-la-Jolie','78','Réseau des Sœurs d\'Île-de-France',
     '',
     'Cycle mensuel de conférences sur le statut de la femme dans le Coran et la Sunnah. Intervenante : Ustadha Fatima.',
     'femmes,Coran,sœurs','presentiel','','TRUE','','','','manual','FALSE'],

    ['webinaire-tajwid-live','Session live Tajwid — Correction individuelle','webinaire',
     '2026-04-26','','20h00','21h30','En ligne (Zoom)',
     '','En ligne','00','Sheikh Ahmed — Professeur Égypte',
     '',
     'Session de correction de récitation en direct. Chaque participant lit quelques versets et reçoit une correction personnalisée.',
     'Tajwid,Coran,récitation,en ligne','enligne','https://example.com','FALSE','5€','','','manual','FALSE'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Events : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 3. PISCINES
// Colonnes : id | nom | type | adresse | ville | departement |
//            creneaux | tarif | telephone | website | maps |
//            description | confirmed | derniere_verification |
//            tags | note | rating | reviews
// ============================================================

function migratePiscines(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Piscines');

  var headers = [
    'id','nom','type','adresse','ville','departement',
    'creneaux','tarif','telephone','website','maps',
    'description','confirmed','derniere_verification',
    'tags','note','rating','reviews'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['p1','Piscine Molitor','privee','2 avenue de la Porte Molitor','Paris','75',
     'Tous les jours 7h-22h : Burkini accepté toute la semaine (politique inclusive)',
     '35€ adulte / accès journée','01 56 07 08 50','https://www.mltr.fr','#',
     'Piscine privée historique du 16e arrondissement. Politique d\'inclusion explicite depuis 2020 : maillots couvrants acceptés en dehors des heures de compétition.',
     'TRUE','2026-01','paris,75,16e,privée,luxe',
     'Tarif élevé mais cadre exceptionnel. Politique burkini affichée sur le site.',4.4,1230],

    ['p2','Centre Aquatique de Clichy-la-Garenne','municipale','1 rue Martre','Clichy-la-Garenne','92',
     'Mercredi 14h-17h : Créneau femmes burkini | Samedi 18h-20h : Créneau femmes burkini',
     '3,50€ (tarif municipal)','01 47 15 XX XX','','#',
     'Piscine municipale proposant des créneaux réservés aux femmes où le burkini est autorisé. Créneau très fréquenté — arriver en avance recommandé.',
     'TRUE','2025-11','92,clichy,créneau-femmes,municipal,abordable',
     '',3.9,87],

    ['p3','Piscine des Roches — Noisy-le-Grand','municipale','1 allée de la Mare Huguet','Noisy-le-Grand','93',
     'Dimanche 9h-11h : Créneau burkini mixte | Mardi 19h30-21h : Créneau femmes burkini autorisé',
     '3€','01 43 04 XX XX','','#',
     'L\'une des rares piscines du 93 avec un créneau burkini mixte le dimanche matin. Accueil bienveillant, staff formé à l\'accueil de tous publics.',
     'TRUE','2026-02','93,noisy-le-grand,créneau-mixte,dimanche',
     'Créneau mixte dimanche matin = rare en IdF, à ne pas manquer.',4.2,143],

    ['p4','Centre Aquatique Intercommunal — Corbeil-Essonnes','municipale','2 impasse du Stade','Corbeil-Essonnes','91',
     'Samedi 10h-12h : Créneau femmes (burkini toléré) | Jeudi 20h-21h30 : Créneau femmes',
     '2,80€','','','#',
     'Piscine intercommunale de l\'Essonne. Créneaux femmes bien établis depuis 2018. Personnel respectueux.',
     'FALSE','2025-09','91,essonne,corbeil,créneau-femmes',
     '⚠️ Créneaux à reconfirmer — vérifier avant de vous déplacer.',3.7,42],

    ['p5','Piscine Municipale — Aubervilliers','municipale','8 allée de la Commune de Paris','Aubervilliers','93',
     'Lundi & Jeudi 19h-21h : Créneau femmes, maillots couvrants autorisés',
     '3€','01 48 39 XX XX','','#',
     'Piscine de proximité à Aubervilliers avec créneaux femmes en soirée. Burkini accepté sur les créneaux dédiés.',
     'TRUE','2026-01','93,aubervilliers,créneau-femmes,soir',
     '',3.8,61],

    ['p6','Centre Nautique de Mantes-la-Jolie','municipale','1 rue de la Piscine','Mantes-la-Jolie','78',
     'Mercredi 12h-14h : Créneau femmes burkini | Dimanche 8h-10h : Créneau burkini tous publics',
     '3,20€','','','#',
     'Centre nautique avec deux créneaux burkini par semaine. Le créneau dominical mixte est une rareté dans les Yvelines.',
     'TRUE','2025-12','78,mantes,yvelines,dimanche,mixte',
     '',4.0,95],

    ['p7','Aqua\'Vallée — Grigny','municipale','50 route de Corbeil','Grigny','91',
     'Vendredi 18h-20h : Créneau femmes, burkini accepté',
     '2,50€','','','#',
     'Petit centre aquatique de Grigny avec créneau femmes le vendredi soir. Tarif très accessible, moins connu donc moins bondé.',
     'FALSE','2025-07','91,grigny,vendredi,abordable',
     '⚠️ Créneau à confirmer — appeler avant.',3.5,28],

    ['p8','Piscine Tournesol — Stains','municipale','37 avenue Lénine','Stains','93',
     'Samedi 9h-11h : Créneau femmes burkini | Mardi 18h30-20h30 : Créneau femmes',
     '3€','','','#',
     'Piscine de quartier avec un bon accueil. Créneau du samedi matin très apprécié par les familles.',
     'TRUE','2026-01','93,stains,samedi-matin,famille',
     '',4.1,74],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Piscines : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 4. LIBRAIRIES
// Colonnes : id | nom | type | description | adresse | ville |
//            departement | arrondissement | horaires | fermeture |
//            telephone | website | instagram | maps | specialites |
//            langues | tags | featured | online | livraison |
//            rating | reviews | note
// ============================================================

function migrateLibrairies(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Librairies');

  var headers = [
    'id','nom','type','description','adresse','ville','departement',
    'arrondissement','horaires','fermeture','telephone','website','instagram','maps',
    'specialites','langues','tags','featured','online','livraison',
    'rating','reviews','note'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['lib1','Librairie Tawhid','mixte',
     'L\'une des plus grandes librairies islamiques de France. Fondée en 1985 à Paris, elle propose plus de 5 000 références en français, arabe et anglais. Livres de sciences islamiques, manuels d\'arabe, CD, vêtements et accessoires.',
     '23 rue des Fossés-Saint-Bernard','Paris','75','5e','Lun–Sam 10h–19h','Dimanche fermé',
     '01 43 25 05 85','https://www.tawhid.fr','https://www.instagram.com/librairie_tawhid','#',
     'coran-tafsir,hadith,fiqh,arabe,enfants,livres-francais,vetements,accessoires',
     'Français,Arabe,Anglais','référence,paris,grande-surface,fondée-1985',
     'TRUE','TRUE','TRUE',4.7,1823,'Livraison France et international disponible sur le site'],

    ['lib2','Al-Bouraq Éditions & Librairie','mixte',
     'Maison d\'édition et librairie spécialisée dans les traductions françaises de classiques islamiques. Large choix de livres de spiritualité, soufisme et textes fondamentaux traduits par des spécialistes.',
     '26 rue Merlin','Paris','75','11e','Lun–Sam 10h–18h30','',
     '01 43 79 35 35','https://www.albouraq.com','','#',
     'spiritualite,livres-francais,histoire-islam,coran-tafsir',
     'Français,Arabe','éditions,spiritualité,traductions,classiques',
     'FALSE','TRUE','TRUE',4.6,412,''],

    ['lib3','Ennour Librairie','physique',
     'Librairie islamique de référence à Saint-Denis. Grand choix de livres, manuels d\'arabe, Corans de toutes tailles, vêtements islamiques, parfums et accessoires. Accueil chaleureux, conseils personnalisés.',
     '12 rue de la Légion d\'Honneur','Saint-Denis','93','','Lun–Sam 9h30–19h30, Dim 10h–17h','',
     '01 48 09 XX XX','','#','#',
     'coran-tafsir,arabe,enfants,vetements,accessoires,parfums-huiles',
     'Français,Arabe','saint-denis,93,vêtements,parfums,ouvert-dimanche',
     'FALSE','FALSE','FALSE',4.5,287,'Ouvert le dimanche'],

    ['lib4','Librairie du Savoir — As-Salam','physique',
     'Petite librairie spécialisée dans les livres pédagogiques pour enfants et adolescents musulmans. Histoires des prophètes, activités, coloriages, Corans pour enfants, méthodes d\'arabe jeunesse.',
     '7 avenue du Président Wilson','Bobigny','93','','Mar–Sam 10h–18h','Lun et Dim fermés',
     '','','#','#',
     'enfants,arabe,coran-tafsir',
     'Français,Arabe','enfants,pédagogie,bobigny,93,spécialisé',
     'FALSE','FALSE','FALSE',4.8,134,'Spécialisé enfants & adolescents'],

    ['lib5','Al-Hadith Librairie','mixte',
     'Librairie tournée vers les sciences islamiques traditionnelles. Fort stock en hadith, usul al-fiqh, aqida. Nombreux titres en arabe importés d\'Égypte, du Maroc et d\'Arabie Saoudite. Commandes spéciales possibles.',
     '45 boulevard de Belleville','Paris','75','11e','Lun–Sam 10h–19h','',
     '01 43 57 XX XX','#','','#',
     'hadith,fiqh,coran-tafsir,arabe',
     'Arabe,Français','sciences-islamiques,arabe,import,commande-spéciale',
     'FALSE','TRUE','TRUE',4.4,198,'Importation directe depuis les pays arabes, commandes spéciales bienvenues'],

    ['lib6','Islam & Savoirs','physique',
     'Librairie familiale à Évry-Courcouronnes. Sélection de livres en français, manuels d\'arabe pour adultes et enfants, Corans, vêtements modestes et accessoires de prière. Ambiance conviviale.',
     '15 place des Terrasses de l\'Agora','Évry-Courcouronnes','91','','Mar–Dim 10h–19h','Lundi fermé',
     '01 60 XX XX XX','','#','#',
     'livres-francais,arabe,vetements,accessoires,enfants',
     'Français,Arabe','évry,91,famille,accessible',
     'FALSE','FALSE','FALSE',4.3,89,''],

    ['lib7','Sabil Al-Ilm','physique',
     'Librairie islamique au cœur de Clichy-sous-Bois, une des rares du 93 Est. Vaste rayon arabe, linguistique et sciences islamiques. Tenue modeste disponible, livres jeunesse bien fournis.',
     '3 rue de Montfermeil','Clichy-sous-Bois','93','','Lun–Sam 9h–19h','',
     '','','#','#',
     'arabe,coran-tafsir,enfants,vetements',
     'Arabe,Français','clichy-sous-bois,93,est-idf',
     'FALSE','FALSE','FALSE',4.2,67,''],

    ['lib8','Nour Al-Ilm — En ligne','en-ligne',
     'Boutique 100% en ligne spécialisée dans les livres islamiques en français. Forte expertise éditoriale, newsletters avec recommandations de lecture, coffrets cadeaux islamiques. Livraison express en France.',
     '','En ligne','75','','','',
     '','#','#','',
     'livres-francais,spiritualite,histoire-islam,enfants,coran-tafsir',
     'Français','en-ligne,livraison-express,coffrets-cadeaux,newsletter',
     'TRUE','TRUE','TRUE',4.9,543,'Coffrets cadeaux islamiques personnalisables'],

    ['lib9','Dar Al-Andalus — Librairie & Galerie','physique',
     'Librairie-galerie d\'art islamique à Vincennes. Livres d\'art, calligraphie, histoire de la civilisation islamique, cartes géographiques du monde arabo-musulman. Lieu culturel autant que commercial.',
     '18 rue de Fontenay','Vincennes','94','','Mar–Sam 11h–19h','Lun et Dim fermés',
     '01 43 XX XX XX','#','','#',
     'histoire-islam,spiritualite,livres-francais',
     'Français,Arabe,Anglais,Espagnol','galerie,art-islamique,calligraphie,vincennes,94',
     'FALSE','FALSE','FALSE',4.7,156,'Expositions temporaires de calligraphie islamique'],

    ['lib10','Al-Falah Librairie','physique',
     'Librairie bien fournie à Mantes-la-Jolie. Grand rayon arabe, fiqh et Coran. Nombreux livres pour apprendre l\'arabe à tous les niveaux. Accessoires de prière, tapis, vêtements.',
     '5 rue Porte aux Saints','Mantes-la-Jolie','78','','Lun–Sam 9h30–19h','',
     '','','','#',
     'arabe,coran-tafsir,fiqh,vetements,accessoires',
     'Arabe,Français','mantes-la-jolie,78,fiqh',
     'FALSE','FALSE','FALSE',4.1,45,''],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Librairies : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 5. EMPLOI (Offres)
// Colonnes : id | titre | entreprise | emoji | localisation |
//            departement | teletravail | type_contrat | secteur |
//            friendly | salaire | description | tags | poste_par |
//            date_publication | url | featured | cmn
// ============================================================

function migrateEmploi(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Emploi');

  var headers = [
    'id','titre','entreprise','emoji','localisation','departement',
    'teletravail','type_contrat','secteur','friendly','salaire',
    'description','tags','poste_par','date_publication','url','featured','cmn'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['j1','Développeur·euse Full Stack (React / Node.js)','Anavrin Technologies','💻',
     'Paris 11e','75','hybrid','cdi','tech',
     'voile-ok,priere-ok,full-friendly','45–55k€',
     'Startup tech islamique cherche dev fullstack passionné·e. Stack moderne, équipe bienveillante, respect des obligations religieuses (prière, voile, Ramadan). Environnement halal (aucun alcool en événements d\'entreprise).',
     'react,nodejs,typescript,startup','Ibrahim M. (CMN)','2026-03-20','#','TRUE','TRUE'],

    ['j2','Infirmier·ère diplômé·e d\'État','Clinique Val de Seine','🏥',
     'Versailles (78)','78','on-site','cdi','sante',
     'voile-ok,priere-ok','2 200–2 800€ net/mois',
     'Clinique privée cherche IDE. Direction sensibilisée à la diversité, port du voile toléré, salle de prière disponible dans l\'établissement. Planning adapté pour Ramadan.',
     'ide,soins,clinique,ile-de-france','Fatima K.','2026-03-18','#','FALSE','FALSE'],

    ['j3','Comptable / Assistant·e Financier·ère','Cabinet Hilal Expertise','💼',
     'Montreuil (93)','93','hybrid','cdi','finance',
     'voile-ok,priere-ok,full-friendly','32–40k€',
     'Cabinet comptable dirigé par des musulmans, environnement 100% halal. Comptabilité générale, TVA, bilans. Bac+2 minimum. Maîtrise Sage et Excel requise.',
     'comptabilite,finance,sage,bilan','Youssef A.','2026-03-15','#','FALSE','TRUE'],

    ['j4','Enseignant·e de mathématiques — Collège/Lycée','École privée Ibn Rushd','📚',
     'Évry-Courcouronnes (91)','91','on-site','cdi','education',
     'voile-ok,priere-ok,full-friendly','2 100–2 600€ net',
     'École privée islamique laïque cherche professeur de maths passionné·e. Les valeurs islamiques sont au cœur du projet éducatif. Ambiance familiale, petits effectifs.',
     'enseignement,maths,ecole-islamique,91','Direction Ibn Rushd','2026-03-12','#','FALSE','FALSE'],

    ['j5','Chargé·e de Communication Digitale','Association Salam Action','📣',
     'Paris 18e / Remote','75','hybrid','cdi','humanitaire',
     'voile-ok,priere-ok,full-friendly','30–36k€',
     'Association humanitaire reconnue cherche un·e chargé·e de comm pour gérer réseaux sociaux, newsletters et campagnes de dons. Sens du service et valeurs islamiques partagées.',
     'social-media,communication,asso,humanitaire','','2026-03-10','#','FALSE','FALSE'],

    ['j6','Avocat·e Collaborateur·rice — Droit Social','Cabinet Droit & Dignité','⚖️',
     'Paris 9e','75','hybrid','cdi','juridique',
     'voile-ok,priere-ok','45–60k€',
     'Cabinet spécialisé en droit du travail et discriminations. Cherche avocat collaborateur (Min. 2 ans d\'expérience). Expertise en discrimination religieuse très appréciée.',
     'droit-social,avocat,discrimination,paris','Mme Benali (CMN)','2026-03-08','#','TRUE','TRUE'],

    ['j7','Développeur·euse Mobile (React Native)','HalalTech Labs','📱',
     'Full Remote','','full','freelance','tech',
     'voile-ok,priere-ok,full-friendly','400–550€/jour',
     'Mission freelance 3–6 mois sur une app de finances islamiques (zakat, investissement halal). Stack React Native + TypeScript. Démarrage dès que possible.',
     'react-native,mobile,freelance,fintech-halal','Karim D.','2026-03-05','#','FALSE','FALSE'],

    ['j8','Assistant·e Social·e','Mairie de Saint-Denis','🏛️',
     'Saint-Denis (93)','93','on-site','cdi','sante',
     'priere-ok','Grille FPT',
     'Poste dans la fonction publique territoriale. Le port du voile n\'est pas autorisé (principe de neutralité FP) mais la direction est sensible au fait religieux et les horaires de prière sont respectés.',
     'social,fp,93,aide-sociale','','2026-03-01','#','FALSE','FALSE'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Emploi : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 6. TALENTS
// Colonnes : id | nom | initiales | role | secteur | localisation |
//            teletravail | competences | bio | disponible | cmn
// ============================================================

function migrateTalents(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Talents');

  var headers = [
    'id','nom','initiales','role','secteur','localisation',
    'teletravail','competences','bio','disponible','cmn'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['t1','Aicha B.','AB','Data Analyst','tech','Paris','TRUE',
     'Python,SQL,Power BI,Machine Learning',
     'Data analyst 4 ans d\'expérience, disponible dès avril. Cherche entreprise respectueuse des obligations religieuses.',
     'TRUE','TRUE'],

    ['t2','Omar L.','OL','Juriste en droit des affaires','juridique','Île-de-France','FALSE',
     'Contrats,M&A,Droit OHADA,Arabe juridique',
     'Master 2 droit des affaires Paris II. Cherche cabinet ou entreprise en CDI. Disponible immédiatement.',
     'TRUE','TRUE'],

    ['t3','Nour H.','NH','UX Designer','communication','Lyon (remote possible)','TRUE',
     'Figma,User Research,Design System,Accessibilité',
     '3 ans en agence, cherche mission freelance ou CDI dans entreprise éthique. Spécialité e-commerce et apps mobiles.',
     'FALSE','FALSE'],

    ['t4','Yacine T.','YT','Infirmier DE','sante','Île-de-France','FALSE',
     'Soins infirmiers,Urgences,Pédiatrie,Gériatrie',
     'IDE 6 ans d\'expérience CHU. Cherche poste dans structure respectant la pratique religieuse (salle de prière, voile toléré).',
     'TRUE','FALSE'],

    ['t5','Salma K.','SK','Chef de Projet Digital','tech','Paris','TRUE',
     'Agile/Scrum,Jira,Marketing Digital,SEO',
     '5 ans chef de projet en startup. Disponible en avril. Cherche environnement bienveillant et mission à impact.',
     'TRUE','TRUE'],

    ['t6','Adam F.','AF','Expert-Comptable stagiaire','finance','Seine-Saint-Denis','FALSE',
     'Comptabilité générale,Sage,Consolidation,Finance islamique',
     'En cours de stage EC. Spécialisation finance islamique (zakat, sukuk). Cherche cabinet pour fin de stage.',
     'TRUE','FALSE'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Talents : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 7. HAJJ_AGENCES
// Colonnes : id | nom | emoji | localisation | depuis_annee |
//            note | avis | agree | description | website |
//            telephone | tags
// ============================================================

function migrateHajjAgences(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Hajj_Agences');

  var headers = [
    'id','nom','emoji','localisation','depuis_annee',
    'note','avis','agree','description','website','telephone','tags'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['a1','Al-Aman Voyages','🕋','Paris 10e',2004,4.8,1240,'TRUE',
     'Leader français du voyage spirituel depuis 2004. Plus de 15 000 pèlerins accompagnés. Service de qualité, hôtels 4★ et 5★ proches des lieux saints. Encadrement francophone sur place.',
     '#','01 40 XX XX XX','leader,francophone,hajj,omra'],

    ['a2','Nour Voyages','🌙','Lyon 7e',2010,4.7,876,'TRUE',
     'Agence lyonnaise spécialisée dans les voyages spirituels. Forte présence en Auvergne-Rhône-Alpes. Groupes familiaux et groupes de sœurs disponibles. Accompagnateur islamologue sur chaque groupe.',
     '#','04 XX XX XX XX','lyon,famille,sœurs,islamologue'],

    ['a3','Safa & Marwa Travel','⭐','Marseille 13e',2008,4.9,2100,'TRUE',
     'Référence dans le sud de la France. Service premium avec hôtels 5★ face à la Kaaba. Guide érudit présent 24h/24. Séances de rappel et cours pendant le séjour. Spécialiste Hajj Ifrad et Qiran.',
     '#','04 91 XX XX XX','premium,marseille,5-étoiles,érudit,hajj'],

    ['a4','Baraka Voyages','🤲','Bobigny (93)',2015,4.5,430,'TRUE',
     'Agence accessible et solidaire. Tarifs compétitifs avec qualité garantie. Forte présence en Seine-Saint-Denis. Facilités de paiement échelonné (3× sans frais). Accompagnement spécial personnes âgées.',
     '#','01 XX XX XX XX','accessible,93,paiement-échelonné,seniors'],

    ['a5','Iqra Travel','📖','Paris 18e',2012,4.6,680,'TRUE',
     'Voyages spirituels avec dimension éducative. Programme de préparation au Hajj en ligne (6 semaines). Encadrement par des imams diplômés. Groupes jeunes adultes et groupes mixtes disponibles.',
     '#','01 XX XX XX XX','éducatif,jeunes,imams,préparation'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Hajj_Agences : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 8. HAJJ_PACKAGES
// Colonnes : id | agence_id | type | nom | etoiles | duree_jours |
//            villes_depart | prix_base | prix_double | prix_triple |
//            prix_quad | prix_single | dist_haram | dist_nabawi |
//            inclus | exclus | description | places | places_restantes |
//            depart | featured | promo | hotel_makkah | hotel_madinah
// ============================================================

function migrateHajjPackages(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Hajj_Packages');

  var headers = [
    'id','agence_id','type','nom','etoiles','duree_jours',
    'villes_depart','prix_base','prix_double','prix_triple',
    'prix_quad','prix_single','dist_haram','dist_nabawi',
    'inclus','exclus','description','places','places_restantes',
    'depart','featured','promo','hotel_makkah','hotel_madinah'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['pkg1','a1','hajj','Hajj Prestige 5★',5,21,
     'Paris,Lyon,Marseille',8500,8200,7900,7600,9200,150,200,
     'Vol AR Paris–Jeddah,Hôtel 5★ face Haram,Pension complète,Transport sur place,Encadrement francophone,Visa Hajj,Sacrifice (Udhiyya),Mallette Hajj',
     'Vaccins,Dépenses personnelles,Excursions optionnelles',
     'Notre formule Hajj haut de gamme. Hôtel 5 étoiles à 150m de la Masjid Al-Haram, pension complète, guide érudit présent 24h/24. Idéal pour les personnes souhaitant accomplir ce pilier dans les meilleures conditions.',
     60,12,'Juin 2026','TRUE','','Fairmont Makkah Clock Tower','Pullman ZamZam Madinah'],

    ['pkg2','a1','hajj','Hajj Confort 4★',4,21,
     'Paris,Lyon',6200,5900,5600,5300,0,500,300,
     'Vol AR,Hôtel 4★,Demi-pension,Transport,Encadrement,Visa Hajj,Sacrifice',
     'Pension complète (option +300€),Vaccins,Dépenses perso',
     'Le rapport qualité-prix idéal. Hôtel 4★ à 500m de la Kaaba avec navette régulière. Groupe francophone encadré par un accompagnateur expérimenté.',
     100,34,'Juin 2026','FALSE','','Hilton Suites Makkah','Anwar Al Madinah Mövenpick'],

    ['pkg3','a3','hajj','Hajj Royal — Face Kaaba',5,25,
     'Marseille,Paris',11500,11000,0,0,12500,50,100,
     'Vol Business class,Suite hôtel 5★ vue Kaaba,Pension complète premium,Transferts VIP,Guide islamologue privé,Visa,Sacrifice,Ziyarat Madinah & La Mecque,Cadeau spirituel personnalisé',
     'Vaccins obligatoires,Dépenses personnelles',
     'L\'expérience Hajj ultime. Chambre avec vue directe sur la Kaaba, service 5 étoiles, guide islamologue dédié au groupe. Programme complet de ziyarat des lieux saints.',
     30,5,'Juin 2026','TRUE','','Conrad Makkah (vue Kaaba)','Oberoi Madinah'],

    ['pkg4','a4','hajj','Hajj Solidaire 3★',3,18,
     'Paris',4800,4500,4200,3900,0,1200,600,
     'Vol AR,Hôtel 3★,Petit-déjeuner,Bus navette toutes les heures,Encadrement,Visa,Sacrifice',
     'Repas midi/soir,Vaccins,Dépenses perso',
     'Formule accessible pour que personne ne renonce au Hajj pour des raisons financières. Hôtel simple mais propre, navette régulière vers le Haram. Paiement en 6× sans frais possible.',
     200,87,'Juin 2026','FALSE','🎁 -200€ si inscription avant le 1er avril','Al Safwah Hotel','Boudl Al Aseel'],

    ['pkg5','a2','omra-ramadan','Omra Ramadan — 10 dernières nuits',4,12,
     'Lyon,Paris',2900,2700,2500,0,0,300,0,
     'Vol AR,Hôtel 4★,Petit-déjeuner + Iftar,Transport,Visa Omra,Encadrement',
     'Suhoor (option +150€),Dépenses perso',
     'Vivez les 10 dernières nuits de Ramadan à la Mecque. Inclus le 27 (Laylat al-Qadr potentielle). Ambiance spirituelle incomparable, départ depuis Lyon ou Paris.',
     80,23,'Ramadan 2026 (Mars–Avril)','TRUE','','Marriott Makkah',''],

    ['pkg6','a5','omra-ramadan','Omra Ramadan Complète',4,21,
     'Paris,Bordeaux',3800,3500,3200,0,0,400,250,
     'Vol AR,Hôtel 4★ La Mecque + Madinah,Iftar + Suhoor inclus,Transport La Mecque–Madinah,Visa,Programme spirituel quotidien,Cours de sciences islamiques',
     'Dépenses personnelles',
     'Omra pendant tout Ramadan avec programme spirituel complet. Cours de sciences islamiques chaque soir avec l\'accompagnateur. Visite Madinah incluse. Idéal pour un Ramadan transformateur.',
     50,18,'Ramadan 2026','FALSE','📚 Cours offerts (valeur 200€)','Le Méridien Makkah','Grand Plaza Madinah'],

    ['pkg7','a1','omra-hors-saison','Omra Été — Juillet 2026',4,10,
     'Paris,Lyon,Marseille,Bordeaux',1800,1650,1500,0,0,400,350,
     'Vol AR,Hôtel 4★,Petit-déjeuner,Transport aéroport,Visa',
     'Repas midi/soir,Encadrement (option +100€),Dépenses perso',
     'Profitez de la période estivale pour accomplir l\'Omra. Moins de foule qu\'en Ramadan, prix attractifs. Idéal pour les familles ou les personnes qui n\'ont pas pu partir en Ramadan.',
     150,92,'Juillet 2026','FALSE','','Hilton Makkah Convention Hotel','Sheraton Madinah Hotel'],

    ['pkg8','a4','omra-express','Omra Express 5 jours',3,5,
     'Paris',950,880,0,0,0,800,0,
     'Vol AR low-cost,Hôtel 3★,Visa,Transport aéroport',
     'Repas,Encadrement,Visite Madinah',
     'Pour les actifs qui veulent accomplir l\'Omra rapidement. Départ vendredi soir, retour mardi matin. La Mecque uniquement. Option idéale pour un week-end prolongé spirituel.',
     40,15,'Toute l\'année (sur demande)','FALSE','⚡ Places limitées chaque départ','Al Rawda Royal Inn',''],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Hajj_Packages : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 9. INSTITUTS
// Colonnes : id | nom | type | adresse | ville | departement |
//            lat | lng | website | telephone | email |
//            cours | audience | format | description | tags |
//            note | avis | verified | featured
// ============================================================

function migrateInstituts(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Instituts');

  var headers = [
    'id','nom','type','adresse','ville','departement',
    'lat','lng','website','telephone','email',
    'cours','audience','format','description','tags',
    'note','avis','verified','featured'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['gmp-al-ghazali','Institut Al-Ghazali — Grande Mosquée de Paris','institut',
     '2 bis Place du Puits de l\'Ermite','Paris 5e','75',
     48.844,2.3521,'https://www.mosqueedeparis.net','01 45 35 97 33','rectorat@mosqueedeparis.net',
     'arabe,sciences-islamiques,coran,fiqh,aqida,tafsir,hadith',
     'hommes,femmes','presentiel',
     'Institut de formation rattaché à la Grande Mosquée de Paris. Formation complète en sciences islamiques et arabe classique. Cérémonie annuelle de remise des diplômes. Référence historique en France.',
     'diplômant,arabe classique,théologie,adultes',4.6,0,'TRUE','TRUE'],

    ['mosquee-omar-paris','Mosquée Omar','mosquee',
     '3 rue Léon Joubert','Paris 11e','75',
     48.8574,2.3761,'','','',
     'coran,tajwid,arabe',
     'hommes,femmes,enfants','presentiel',
     'Mosquée proposant des cours de Coran et d\'arabe pour adultes et enfants. Programme structuré par niveaux.',
     'quartier,Coran,enfants',0,0,'TRUE','FALSE'],

    ['mosquee-addawa-paris','Mosquée Adda\'wa','mosquee',
     '39 rue de Tanger','Paris 19e','75',
     48.8841,2.3742,'','','',
     'coran,arabe,sciences-islamiques,enfants',
     'hommes,femmes,enfants','presentiel',
     'Centre islamique actif proposant cours de Coran, arabe et sciences islamiques pour tous les niveaux, enfants et adultes.',
     'Coran,arabe,enfants,Paris 19e',0,0,'TRUE','FALSE'],

    ['mosquee-colombes','Grande Mosquée de Colombes','mosquee',
     '56 rue Pierre Brossolette','Colombes','92',
     0,0,'','','',
     'coran,arabe,sciences-islamiques,enfants',
     'hommes,femmes,enfants','presentiel',
     'Grande mosquée de Colombes avec programme éducatif complet pour enfants et adultes.',
     '92,enfants,Coran',0,0,'FALSE','FALSE'],

    ['mosquee-nanterre','Mosquée de Nanterre (UOIF)','mosquee',
     'Nanterre','Nanterre','92',
     0,0,'','','',
     'coran,arabe,enfants',
     'hommes,femmes,enfants','presentiel',
     'Cours hebdomadaires de Coran et d\'arabe pour enfants et adultes.',
     '92,Nanterre',0,0,'FALSE','FALSE'],

    ['mosquee-stains','Grande Mosquée de Stains','mosquee',
     'Stains','Stains','93',
     0,0,'','','',
     'coran,arabe,tajwid,enfants,memorisation',
     'hommes,femmes,enfants','presentiel',
     'Mosquée avec programme éducatif solide incluant mémorisation du Coran et cours d\'arabe.',
     '93,hifz,enfants,mémorisation',0,0,'FALSE','FALSE'],

    ['mosquee-bobigny','Centre Islamique de Bobigny','mosquee',
     'Bobigny','Bobigny','93',
     0,0,'','','',
     'coran,arabe,sciences-islamiques',
     'hommes,femmes,enfants','presentiel',
     'Centre islamique actif proposant des cours de coran et d\'arabe réguliers.',
     '93,Bobigny',0,0,'FALSE','FALSE'],

    ['mosquee-saint-denis','Grande Mosquée de Saint-Denis','mosquee',
     'Saint-Denis','Saint-Denis','93',
     48.9362,2.3574,'','','',
     'coran,arabe,enfants,sciences-islamiques',
     'hommes,femmes,enfants','presentiel',
     'Une des plus grandes mosquées du 93 avec programme éducatif varié pour tous les publics.',
     '93,Saint-Denis,enfants',0,0,'FALSE','FALSE'],

    ['mosquee-creteil','Mosquée de Créteil','mosquee',
     'Créteil','Créteil','94',
     0,0,'','','',
     'coran,arabe,enfants',
     'hommes,femmes,enfants','presentiel',
     'Mosquée proposant des cours réguliers de Coran et d\'arabe pour enfants et adultes.',
     '94,Créteil',0,0,'FALSE','FALSE'],

    ['mosquee-evry','Grande Mosquée d\'Évry-Courcouronnes','mosquee',
     'Évry-Courcouronnes','Évry-Courcouronnes','91',
     0,0,'https://www.mosquee-evry.fr','','',
     'coran,tajwid,enfants,sciences-islamiques',
     'hommes,femmes,enfants','presentiel',
     'Grande mosquée d\'Essonne avec l\'école Al-Houda pour enfants. Soirées coraniques et conférences régulières.',
     '91,école Al-Houda,enfants,Évry',4.4,0,'TRUE','TRUE'],

    ['mosquee-mantes','Grande Mosquée de Mantes-la-Jolie','mosquee',
     'Mantes-la-Jolie','Mantes-la-Jolie','78',
     0,0,'','','',
     'coran,arabe,sciences-islamiques,enfants',
     'hommes,femmes,enfants','presentiel',
     'Grande mosquée des Yvelines avec programme éducatif complet. Référence dans la région.',
     '78,Mantes,enfants',0,0,'FALSE','FALSE'],

    ['iesh-enligne','IESH — Institut Européen des Sciences Humaines','en-ligne',
     'Château-Chinon (siège) + antenne Paris','Paris / National','75',
     0,0,'https://iesh.org','','',
     'arabe,sciences-islamiques,fiqh,aqida,tafsir,hadith,sirah',
     'hommes,femmes','presentiel,distanciel',
     'L\'un des instituts islamiques les plus reconnus de France. Formation diplômante en sciences islamiques et langue arabe. Plusieurs niveaux, hommes et femmes. Référence nationale.',
     'diplômant,UOIF,arabe,sciences islamiques,certifié',4.7,0,'TRUE','TRUE'],

    ['al-kalam-enligne','Al-Kalam Institut','en-ligne',
     'En ligne','En ligne','75',
     0,0,'https://alkalam.fr','','',
     'arabe,coran,tajwid,sciences-islamiques',
     'hommes,femmes','distanciel',
     'Plateforme française de cours islamiques en ligne. Arabe classique, Coran, Tajwid et sciences islamiques par des professeurs francophones qualifiés.',
     'en ligne,arabe,Coran,francophone',0,0,'FALSE','FALSE'],

    ['professeur-egyptien-tajwid','Sheikh Ahmed — Correction Tajwid (Égypte)','professeur',
     'En ligne (Zoom/Skype)','En ligne','00',
     0,0,'','','',
     'coran,tajwid,memorisation',
     'hommes,femmes','distanciel',
     'Professeur arabophone basé en Égypte, correction de récitation et Tajwid en cours particuliers. Tarifs très attractifs (5-15€/h). Ijaza possible pour les avancés.',
     'particulier,Tajwid,prix attractif,Égypte,Ijaza',5.0,0,'FALSE','TRUE'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Instituts : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 10. SANTE_PSY
// ============================================================

function migrateSantePsy(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Sante_Psy');

  var headers = [
    'id','nom','titre','specialites','langues','localisation','departement',
    'visio','tarif','conventionne','secteur','description','approche',
    'muslim_focus','arabophone','genre','contact','website','tags','note','avis'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['psy1','Dr Yasmine Benali','Psychologue clinicienne',
     'Anxiété,Dépression,Deuil,Trauma','Français,Arabe,Anglais','Paris 11e','75',
     'TRUE','70€/séance (45min)','FALSE','non-conventionné',
     'Psychologue clinicienne spécialisée dans l\'accompagnement de personnes issues de la communauté musulmane. Comprend les enjeux identitaires, les conflits de valeurs et les problématiques de double culture.',
     'TCC,ACT,Mindfulness','TRUE','TRUE','f',
     '+33 6 12 34 56 78','https://www.doctolib.fr','TCC,anxiété,double-culture,identité,trauma',4.9,42],

    ['psy2','Rachid Hammouchi','Psychothérapeute & Coach',
     'Gestion du stress,Confiance en soi,Couple,Addiction','Français,Arabe dialectal,Tamazight','Aubervilliers (93)','93',
     'TRUE','55€/séance','FALSE','non-conventionné',
     'Psychothérapeute et coach de vie, accompagne depuis 8 ans des hommes et femmes musulmans sur les thèmes de la confiance en soi, des relations et de la spiritualité intégrée.',
     'Coaching intégratif,PNL,Thérapie narrative','TRUE','TRUE','m',
     '+33 6 23 45 67 89','https://www.doctolib.fr','coaching,couple,stress,homme,confiance',4.7,28],

    ['psy3','Amira Tazi','Psychologue — spécialiste enfants & ados',
     'Enfants,Adolescents,Troubles scolaires,TDA/H,Harcèlement','Français,Arabe','Évry-Courcouronnes (91)','91',
     'FALSE','60€/séance','FALSE','non-conventionné',
     'Spécialisée dans les enfants et adolescents issus de familles musulmanes. Comprend les enjeux éducatifs, religieux et sociaux. Accompagnement des parents aussi proposé.',
     'TCC,Thérapie par le jeu,Approche systémique','TRUE','TRUE','f',
     '+33 6 34 56 78 90','','enfants,ados,TDA-H,scolaire,91',4.8,19],

    ['psy4','Dr Soufiane Mekki','Psychiatre',
     'Dépression,Trouble bipolaire,Schizophrénie,Anxiété sévère','Français,Arabe,Anglais','Bobigny (93)','93',
     'FALSE','30€ (secteur 1)','TRUE','1',
     'Psychiatre conventionné secteur 1, sensibilisé aux problématiques culturelles et religieuses. Prescripteur avec une approche bienveillante et non-stigmatisante.',
     'Médicamenteux,Psychoéducation,Suivi thérapeutique','TRUE','TRUE','m',
     '+33 1 48 96 12 34','https://www.doctolib.fr','psychiatre,remboursé,dépression,médication,93',4.6,55],

    ['psy5','Nadia Ouhab','Psychologue — trauma & EMDR',
     'Trauma,PTSD,Violence conjugale,Deuil,Exil','Français,Kabyle,Arabe','Villeurbanne (69)','69',
     'TRUE','65€/séance','FALSE','non-conventionné',
     'Accompagnement de femmes victimes de violence, de personnes en deuil ou ayant vécu des traumatismes. Forte expérience avec les familles maghrébines et les parcours migratoires.',
     'EMDR,Thérapie sensorimotrice,TCC','TRUE','TRUE','f',
     '+33 6 45 67 89 01','https://www.doctolib.fr','EMDR,trauma,femmes,violence,deuil,lyon',5.0,14],

    ['psy6','Hakim Berrada','Conseiller conjugal & familial',
     'Couple,Divorce islamique,Communication familiale,Parentalité','Français,Arabe,Anglais','Marseille (13)','13',
     'TRUE','50€/séance individuelle — 70€/séance couple','FALSE','non-conventionné',
     'Conseiller conjugal et familial formé en France et au Maroc. Spécialiste des conflits de couple intégrant les valeurs islamiques. Médiation avant divorce, communication non-violente, reconstruction.',
     'CNV,Médiation,Approche islamique intégrée','TRUE','TRUE','m',
     '+33 6 56 78 90 12','https://www.doctolib.fr','couple,mariage,divorce,famille,marseille',4.8,31],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Sante_Psy : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 11. SANTE_HIJAMA
// ============================================================

function migrateSanteHijama(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Sante_Hijama');

  var headers = [
    'id','nom','localisation','departement','tarif','genre',
    'certifie','certif_org','description','disponibilite',
    'contact','instagram','website','tags'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['h1','Centre Al-Shifa','Saint-Denis (93)','93','À partir de 40€','mixte',
     'TRUE','BCHA (British Cupping and Hijama Association)',
     'Centre spécialisé hijama avec praticiens hommes et femmes. Matériel stérile à usage unique, protocoles sunnah respectés. Séances individuelles ou en groupe.',
     'Mar–Sam, sur RDV','','#','#','saint-denis,93,centre,homme-femme,certifié'],

    ['h2','Oum Khalid — Hijama pour femmes','Aubervilliers (93)','93','35–50€ selon formule','f',
     'TRUE','Formation Hijama Institut Paris',
     'Praticienne spécialisée dans la hijama pour femmes uniquement. Cadre intimiste et bienveillant. Expliquer les étapes avant la séance, conseils post-hijama inclus.',
     'Week-end + jeudi soir','','#','','femmes-only,93,aubervilliers,intimiste'],

    ['h3','Abou Zayd Cupping','Vitry-sur-Seine (94)','94','45€ (sèche) / 55€ (avec saignée)','m',
     'TRUE','HCA France',
     'Praticien homme, certifié, formation internationale. Hijama sèche et hijama avec saignée (sunnah). Points sunnah + points thérapeutiques selon besoin. Conseils diététiques offerts.',
     'Lun–Sam, 9h–19h','','#','','homme,94,vitry,saignée,sunnah'],

    ['h4','Hijama Bien-Être Lyon','Vénissieux (69)','69','40€','mixte',
     'TRUE','Institut de Médecine Prophétique',
     'Centre de hijama à Lyon, accueil hommes et femmes (créneaux séparés). Approche médecine prophétique, huiles essentielles sunnah (habba sawda). Tarif réduit pour étudiants.',
     'Sam–Dim + mardi soir','','','','lyon,vénissieux,médecine-prophétique,habba-sawda'],

    ['h5','Nour Al-Shifa — Hijama domicile','Île-de-France (déplacement)','75','60€ (déplacement inclus)','f',
     'TRUE','Formation BCHA UK',
     'Praticienne certifiée se déplaçant à domicile en Île-de-France. Idéal pour femmes qui préfèrent être chez elles. Matériel stérile apporté, séance en toute confidentialité.',
     'Sur RDV — délai 1 semaine','','#','','domicile,île-de-france,femmes,déplacement'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Sante_Hijama : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 12. SANTE_ROQYA
// ============================================================

function migrateSanteRoqya(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Sante_Roqya');

  var headers = [
    'id','nom','titre','localisation','departement','visio',
    'tarif','genre','ecole','langues','description',
    'disponibilite','contact','tags','warning'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['r1','Cheikh Abdallah As-Suyuti','Mouqri\' certifié','Montreuil (93)','93','TRUE',
     'Don libre (sadaqa)','m','Sunnah (méthodologie des savants)','Arabe,Français',
     'Pratique la roqya char\'iyya selon la sunnah du Prophète ﷺ. Lecture du Coran uniquement, pas de talismans ni de méthodes innovées. Formation auprès de savants reconnus. Accompagnement spirituel inclus.',
     'Mer–Sam sur RDV','','roqya-char\'iyya,sunnah,visio-ok,coran,93',''],

    ['r2','Oum Ibrahim — Roqya pour femmes','Praticienne Roqya','Paris 18e','75','TRUE',
     'Gratuit / donation libre','f','Méthodologie Ahl As-Sunnah','Français,Arabe,Wolof',
     'Femme proposant la roqya char\'iyya exclusivement pour sœurs. Lecture du Coran, doua\' et conseils spirituels. Accompagnement bienveillant pour les sœurs souffrant de sorcellerie, mauvais œil ou possession.',
     'Vendredi–Dimanche','','femmes,roqya,visio-ok,wolof,paris',''],

    ['r3','Imam Yassine Idrissi','Imam & praticien roqya','Stains (93)','93','FALSE',
     'Don libre','m','Maliki','Arabe,Français,Tamazight',
     'Imam de mosquée pratiquant la roqya sur rendez-vous après la prière du Asr. Approche douce, écoute, lecture et conseils. Pas de séances en dehors de la mosquée.',
     'Dim–Jeu après Asr (environ 17h)','','imam,mosquée,maliki,93,stains',''],

    ['r4','Cheikh Abu Mus\'ab','Spécialiste roqya — sihr & ayn','Lyon (69)','69','TRUE',
     'Don libre','m','Sunnah','Arabe,Français',
     'Praticien expérimenté spécialisé dans les cas de sorcellerie (sihr) et mauvais œil (ayn). Protocole complet : diagnostic, lecture, conseils. Suivi sur plusieurs séances si nécessaire. Visio acceptée pour premiers échanges.',
     'Sur RDV uniquement','','sihr,ayn,sorcellerie,lyon,visio',''],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Sante_Roqya : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 13. SANTE_MEDICAL (Médecins & Sages-femmes)
// ============================================================

function migrateSanteMedical(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Sante_Medical');

  var headers = [
    'id','nom','titre','secteur_medical','specialites','langues',
    'localisation','departement','visio','tarif','conventionne','secteur',
    'description','genre','arabophone','accepte_voile','muslim_focus',
    'contact','website','tags','note','avis'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['med1','Karima Haddad','Sage-femme libérale','sage-femme',
     'Suivi de grossesse,Préparation à l\'accouchement,Post-partum,Allaitement',
     'Français,Arabe','Saint-Denis (93)','93','TRUE',
     'Remboursé Sécu (secteur 1)','TRUE','1',
     'Sage-femme libérale accompagnant les femmes musulmanes avec bienveillance et respect de leurs valeurs. Suivi personnalisé grossesse, préparation à l\'accouchement, accompagnement allaitement. Consulte en hidjab.',
     'f','TRUE','TRUE','TRUE','+33 6 11 22 33 44','https://www.doctolib.fr',
     'grossesse,accouchement,allaitement,remboursé,93,sage-femme',4.9,38],

    ['med2','Fatima Zerrouk','Sage-femme — spécialiste post-partum','sage-femme',
     'Post-partum,Baby blues,Rééducation périnéale,Contraception naturelle',
     'Français,Arabe,Kabyle','Aubervilliers (93)','93','FALSE',
     'Remboursé Sécu','TRUE','1',
     'Sage-femme spécialisée dans le post-partum et l\'accompagnement des jeunes mamans. Sensibilisée au contexte culturel et religieux : discuter contraception halal, allaitement pendant le Ramadan, dépression post-partum.',
     'f','TRUE','TRUE','TRUE','+33 6 22 33 44 55','',
     'post-partum,rééducation,périnéale,baby-blues,93',4.8,22],

    ['med3','Leila Mansouri','Sage-femme — accompagnement global','sage-femme',
     'Suivi gynécologique,Frottis,Contraception,Grossesse,Ménopause',
     'Français,Arabe','Évry-Courcouronnes (91)','91','TRUE',
     'Remboursé Sécu + dépassements possibles','TRUE','1',
     'Sage-femme assurant un suivi gynécologique complet pour les femmes qui préfèrent éviter un médecin homme. Frottis, contraception, grossesse, ménopause : tout dans un cadre sécurisé et bienveillant.',
     'f','TRUE','TRUE','TRUE','+33 6 33 44 55 66','https://www.doctolib.fr',
     'gynécologie,contraception,frottis,91,suivi-complet',4.7,15],

    ['med4','Dr Samira Benkhaled','Médecin généraliste','medecin-generaliste',
     'Médecine générale,Diabète,Nutrition,Suivi femmes',
     'Français,Arabe,Anglais','Clichy-sous-Bois (93)','93','FALSE',
     '26.50€ (secteur 1 — remboursé)','TRUE','1',
     'Médecin généraliste sensibilisée aux enjeux de santé des populations musulmanes : jeûne du Ramadan avec pathologies chroniques, nutrition halal, discussions de santé en accord avec les valeurs religieuses.',
     'f','TRUE','TRUE','TRUE','+33 1 43 12 34 56','https://www.doctolib.fr',
     'généraliste,ramadan,diabète,nutrition,93,remboursé',4.8,67],

    ['med5','Dr Youssef Laaribi','Médecin généraliste','medecin-generaliste',
     'Médecine générale,Santé mentale,Addictologie,Médecine du sport',
     'Français,Arabe,Tamazight','Marseille 13e','13','TRUE',
     '26.50€ (secteur 1 — remboursé)','TRUE','1',
     'Médecin généraliste à l\'écoute, comprenant les contraintes culturelles et religieuses. Accompagnement déstigmatisant sur la santé mentale, les addictions, les problèmes liés au jeûne ou à l\'alimentation halal.',
     'm','TRUE','TRUE','TRUE','+33 4 91 23 45 67','https://www.doctolib.fr',
     'généraliste,visio,addictologie,santé-mentale,marseille',4.6,44],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Sante_Medical : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 14. INITIATIVES (Solidarité — maraudes & initiatives)
// ============================================================

function migrateInitiatives(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Initiatives');

  var headers = [
    'id','titre','type','organisateur','ville','departement',
    'description','contact_url','telephone','tags','recurrent','prochaine_date'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['maraude-paris-10','Maraude hebdomadaire — Paris 10e/11e','maraude',
     'Au Cœur de la Fraternité','Paris','75',
     'Chaque dimanche soir, distribution de repas chauds et produits d\'hygiène aux personnes sans-abri autour de la Gare du Nord. Rejoins l\'équipe !',
     'https://www.aucoeurfraternite.fr','','sans-abri,repas,dimanche','TRUE','2026-03-30'],

    ['maraude-st-lazare','Maraude Saint-Lazare — Paris 8e','maraude',
     'Muslimes en Action','Paris','75',
     'Distribution de repas et couvertures chaque samedi soir autour de la Gare Saint-Lazare. Bénévoles bienvenus dès 19h.',
     'https://www.helloasso.com/associations/muslimes-en-action','','sans-abri,samedi,paris','TRUE','2026-03-28'],

    ['maraude-93-bobigny','Maraude mensuelle — Bobigny','maraude',
     'Association An-Nour Bobigny','Bobigny','93',
     'Maraude mensuelle dans les rues de Bobigny et communes voisines. Distribution alimentaire et écoute.',
     'https://www.helloasso.com/associations/an-nour-bobigny','','93,mensuel,alimentaire','TRUE','2026-04-04'],

    ['repas-ramadan-93','Repas Ramadan solidaires — Bobigny','repas-solidaire',
     'Association An-Nour Bobigny','Bobigny','93',
     'Pendant tout le Ramadan, repas gratuits offerts aux personnes isolées et aux étudiants. 50 repas/soir.',
     '','','Ramadan,iftar,solidarité','TRUE','2026-04-01'],

    ['visite-ehpad-créteil','Visites de personnes âgées — EHPAD Créteil','visite-ehpad',
     'Collectif Fraternité 94','Créteil','94',
     'Visites mensuelles de personnes âgées isolées dans les EHPAD de Créteil. Sourire, lecture, présence bienveillante. Inscription ouverte.',
     '','','personnes âgées,EHPAD,mensuel','TRUE','2026-04-05'],

    ['collecte-vetements-92','Collecte vêtements & jouets — Nanterre','collecte',
     'Mosquée de Nanterre','Nanterre','92',
     'Collecte de vêtements chauds et jouets pour familles dans le besoin. Dépôts acceptés à la mosquée les week-ends.',
     '','','vêtements,jouets,familles','FALSE','2026-04-13'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Initiatives : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 15. ASSOCIATIONS
// ============================================================

function migrateAssociations(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Associations');

  var headers = [
    'id','nom','description','domaine','url','ville','departement',
    'national','emoji','tags'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['human-appeal','Human Appeal France',
     'ONG humanitaire internationale avec programme Gaza, orphelins, eau et urgences. Reçu fiscal.',
     'humanitaire','https://www.human-appeal.fr','','','TRUE','🌍','Gaza,orphelins,eau,urgence'],

    ['islamic-relief','Islamic Relief France',
     'Aide humanitaire d\'urgence et développement dans 40 pays. Présente en France. Reçu fiscal.',
     'humanitaire','https://www.islamic-relief.fr','','','TRUE','🤝','international,urgence,développement'],

    ['sif','Secours Islamique France',
     'ONG française d\'aide humanitaire et de développement solidaire. Active dans 26 pays.',
     'humanitaire','https://www.secours-islamique.org','','','TRUE','🌙','humanitaire,France,développement'],

    ['jmf','Jeunes Musulmans de France',
     'Association nationale de jeunesse musulmane. Événements, bénévolat, formation citoyenne.',
     'jeunesse','https://www.jmf.fr','','','TRUE','👨‍👩‍👧‍👦','jeunesse,citoyenneté,bénévolat'],

    ['launchgood','LaunchGood',
     'Plateforme de crowdfunding pour la communauté musulmane mondiale. Milliers de projets actifs.',
     'humanitaire','https://www.launchgood.com','','','FALSE','🚀','crowdfunding,projets,communauté'],

    ['helloasso','HelloAsso',
     'Plateforme de financement participatif pour associations françaises. Zéro frais pour les associations.',
     'social','https://www.helloasso.com','','','TRUE','💙','crowdfunding,associations,France'],

    ['aumonerie-musulmane','Aumônerie Musulmane de France',
     'Présence spirituelle dans les prisons, hôpitaux et établissements publics. Bénévoles bienvenus.',
     'social','https://www.aumonerie-musulmane.fr','','','TRUE','🕌','prison,hôpital,spiritualité,bénévolat'],

    ['baraka-world','Baraka World',
     'Voyages solidaires et volontariat international en Afrique et au Moyen-Orient.',
     'humanitaire','https://www.barakaworld.org','','','TRUE','✈️','voyage solidaire,volontariat,Afrique'],

    ['collectif-contre-islamophobie','Collectif contre l\'Islamophobie en France (CCIF)',
     'Observation, documentation et lutte contre les actes islamophobes. Signalement en ligne.',
     'droits','https://www.islamophobie.net','','','TRUE','⚖️','islamophobie,droits,signalement'],

    ['coordination-musulmane','Coordination Nationale des Musulmans de France',
     'Coordination d\'associations et de mosquées pour défendre les intérêts de la communauté.',
     'droits','https://www.cnmf.fr','','','TRUE','🏛️','coordination,mosquées,droits'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Associations : ' + rows.length + ' lignes insérées');
}

// ============================================================
// 16. VOYAGES HUMANITAIRES
// ============================================================

function migrateVoyagesHumanitaires(ss) {
  ss = ss || SpreadsheetApp.openById(BDD_ID);
  var sh = getOrCreateSheet(ss, 'Voyages_Humanitaires');

  var headers = [
    'id','titre','destination','organisateur','organisateur_url',
    'description','duree','prochain_depart','prix','places','tags'
  ];
  setHeaders(sh, headers);

  var rows = [
    ['voyage-gaza-sif','Mission humanitaire — Gaza','Gaza, Palestine',
     'Secours Islamique France','https://www.secours-islamique.org/missions-humanitaires',
     'Rejoignez une équipe médicale et logistique sur le terrain à Gaza. Profils médicaux, logistique, communication. Encadrement complet.',
     '10 à 14 jours','2026-05-10','Pris en charge par SIF',8,'Gaza,médical,logistique,terrain'],

    ['voyage-mali-puits','Chantier solidaire — Construction de puits Mali','Région de Kayes, Mali',
     'Islamic Relief France','https://www.islamic-relief.fr/agir/partir-en-mission',
     'Participez à la construction d\'infrastructures hydrauliques dans les villages isolés du Mali. Aucune compétence technique requise.',
     '8 jours','2026-07-15','1 200€ (vol inclus)',12,'Mali,puits,eau,construction'],

    ['voyage-maroc-seisme','Reconstruction — Zones sinistrées Maroc','Al-Haouz, Maroc',
     'Human Appeal France','https://www.human-appeal.fr/missions',
     'Les villages du Haut-Atlas reconstruisent après le séisme de 2023. Bénévoles pour chantier, logistique et soutien psychosocial.',
     '7 jours','2026-06-01','900€',15,'Maroc,reconstruction,séisme,bénévolat'],

    ['voyage-senegal-education','Volontariat éducation — Sénégal','Dakar & Thiès, Sénégal',
     'Association Baraka World','https://www.barakaworld.org/volontariat',
     'Enseignement du français et soutien scolaire dans des écoles coraniques de Dakar et Thiès. Profil enseignant privilégié.',
     '2 à 4 semaines','2026-08-01','600€',20,'Sénégal,éducation,enseignement,Afrique'],

    ['voyage-turquie-refugies','Mission soutien réfugiés — Turquie','Istanbul & Gaziantep, Turquie',
     'Islamic Relief France','https://www.islamic-relief.fr/agir/partir-en-mission',
     'Accompagnement de réfugiés syriens en Turquie : distribution alimentaire, cours de langue, soutien administratif.',
     '10 jours','2026-05-25','850€',10,'Turquie,réfugiés,Syrie,soutien'],
  ];

  sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  Logger.log('Voyages_Humanitaires : ' + rows.length + ' lignes insérées');
}
