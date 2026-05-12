# Skill : Data Entry Al Wasil

Tu es en mode **data entry** pour la plateforme Al Wasil (al-wasil.fr).

## Ce que tu dois faire

1. Lire chaque lien fourni
2. Extraire TOUTES les informations disponibles
3. Générer des fichiers CSV correctement formatés dans `/Users/meyghane/PROJECTS_2026/ALWASIL_SITE/scripts/à ajouter/`
4. Un fichier CSV par catégorie, nommé selon la catégorie (`piscines.csv`, `education.csv`, etc.)
5. Si tu trouves des informations pertinentes qui n'ont pas de colonne existante → les ajouter EN FIN de ligne avec un nom de colonne explicite, et signaler ces nouvelles colonnes à la fin de ta réponse

## Règles CSV

- Séparateur : virgule
- Ligne 1 = en-têtes exactes
- Valeurs avec virgules : entourer de `"`
- Listes multiples dans une cellule : séparées par `|`
- Booléens : `TRUE` / `FALSE`
- Dates : `YYYY-MM-DD`
- Info manquante : cellule vide
- id : kebab-case depuis le nom (ex: `mosquee-al-fath-paris`)
- active : toujours `TRUE`

## Colonnes par catégorie

**PISCINES** (`piscines.csv`)
`id,name,type,adresse,ville,department,creneaux,tarif,phone,website,maps,description,confirmed,lastVerified,tags,note,active`
- type : `municipale` / `privee` / `associative`
- creneaux : `Samedi 8h-10h (Femmes uniquement) | Dimanche 9h-11h`

**EDUCATION** (`education.csv`)
`id,name,type,address,city,department,website,phone,email,courses,audience,format,description,tags,verified,featured,active`
- type : `institut` / `mosquee` / `professeur` / `en-ligne` / `cercle`
- courses : valeurs séparées par `|` parmi : `coran|tajwid|arabe|sciences-islamiques|fiqh|aqida|sirah|tafsir|hadith|enfants|memorisation`
- audience : `hommes|femmes|enfants|mixte`
- format : `presentiel|distanciel|hybride`

**EVENTS** (`events.csv`)
`id,title,category,date,timeStart,timeEnd,location,address,city,department,organizer,organizerUrl,description,format,registrationUrl,isFree,price,tags,featured,active`
- category : `conference` / `maraude` / `cours` / `iftar` / `webinaire` / `jeunesse` / `famille` / `collecte` / `autre`

**EMPLOI** (`emploi.csv`)
`id,title,company,location,department,remote,type,sector,friendly,salary,description,tags,postedDate,url,featured,cmn,active`
- remote : `full` / `hybrid` / `on-site`
- friendly : `voile-ok|priere-ok|full-friendly`

**SANTE_PSY** (`sante_psy.csv`)
`id,name,title,specialites,langues,location,department,visio,tarif,conventionne,secteur,description,approche,muslimFocus,arabophone,gender,contact,website,tags,active`

**SANTE_HIJAMA** (`sante_hijama.csv`)
`id,name,location,department,tarif,gender,certifie,certifOrg,description,disponibilite,contact,instagram,website,tags,active`

**SANTE_ROQYA** (`sante_roqya.csv`)
`id,name,title,location,department,visio,tarif,gender,contact,description,tags,active`

**LIBRAIRIES** (`librairies.csv`)
`id,name,type,description,adresse,ville,department,horaires,fermeture,phone,website,instagram,maps,specialites,langues,tags,online,livraison,note,featured,active`
- specialites : `coran-tafsir|hadith|fiqh|arabe|enfants|histoire-islam|spiritualite|livres-francais|vetements|accessoires|parfums-huiles`

**SOLIDARITE_CAGNOTTES** (`solidarite_cagnottes.csv`)
`id,title,organizer,platform,url,description,category,raised,goal,currency,country,nb_donateurs,verified,featured,active`
- platform : `launchgood` / `helloasso` / `leetchi` / `direct`

**SOLIDARITE_INITIATIVES** (`solidarite_initiatives.csv`)
`id,title,type,organizer,city,department,description,contactUrl,phone,tags,recurring,nextDate,active`

**HAJJ_AGENCES** (`hajj_agences.csv`)
`id,name,location,since,rating,reviews,agree,description,website,phone,tags,active`

**HAJJ_PACKAGES** (`hajj_packages.csv`)
`id,agenceId,type,name,stars,duration,departCities,price,priceDouble,priceTriple,priceQuad,distanceMasjidHaram,distanceMasjidNabawi,includes,description,places,placesRestantes,departure,active`

## Format de ta réponse

1. Écrire chaque CSV dans `/scripts/à ajouter/[nom].csv`
2. Résumé : combien de fiches par catégorie
3. **Nouvelles colonnes détectées** (si applicable) : liste des colonnes ajoutées + pourquoi elles sont pertinentes pour le site
4. **Infos manquantes** : ce qui n'était pas disponible sur les pages (à compléter manuellement)
