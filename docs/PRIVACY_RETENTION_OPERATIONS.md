# Conservation : procédure avant activation

Statut : proposition technique désactivée, à valider par la responsable du traitement.

Le traitement cible les leads après 365 jours et les soumissions après 90 jours. Examiner le code de sélection et lancer scripts/retention-audit.ts en lecture seule avant activation. La variable PERSONAL_DATA_RETENTION_ENABLED doit rester absente ou différente de true tant que la politique n’a pas été validée.

Le traitement anonymise les coordonnées et données de provenance sélectionnées, nettoie les charges utiles des événements concernés et journalise les nombres traités. Il ne supprime pas définitivement les lignes. L’anonymisation reste difficilement réversible : vérifier préalablement les obligations de conservation, demandes en cours et sauvegardes.

Pour une demande d’accès, rectification ou effacement : vérifier l’identité de manière proportionnée, identifier les dossiers et copies concernés (Neon, journaux, prestataires email, exports et sauvegardes), préparer un inventaire sans modification, faire valider le périmètre puis exécuter une intervention ciblée et journalisée. Aucun effacement automatique sur simple email non vérifié. Informer la personne du résultat et des éventuelles limites justifiées.

Avant activation : confirmer les durées avec la politique publique, définir la durée des sauvegardes et journaux fournisseurs, tester la simulation et la transformation sur une base isolée, désigner la responsable des demandes. Le délai dans la base active ne prouve pas l’effacement des copies chez les prestataires.
