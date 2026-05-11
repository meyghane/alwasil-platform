// ============================================================
// SoumissionsRouter.gs — Al-Wasil
//
// RÔLE :
//   1. Webhook POST : reçoit les soumissions du site et les écrit
//      dans l'onglet "Soumissions" du Sheet privé avec status "à vérifier"
//
//   2. Trigger onEdit : quand admin change le status dans le Sheet,
//      copie automatiquement la ligne dans l'onglet destination
//      et met à jour le statut
//
// DÉPLOIEMENT :
//   Apps Script > Déployer > Nouvelle déploiement > Web App
//   - Exécuter en tant que : Moi
//   - Accès : Tout le monde
//   Copier l'URL et la mettre dans APPS_SCRIPT_WEBHOOK_URL (.env.local + Vercel)
//
// TRIGGER onEdit :
//   Apps Script > Déclencheurs > + Ajouter un déclencheur
//   - Fonction : onStatusChange
//   - Événement : onEdit (modification de la feuille de calcul)
//
// COLONNES ONGLET "Soumissions" (créées automatiquement) :
//   A: id | B: categorie | C: destinationTab | D: status
//   E: soumis_le | F: soumis_par | G: name (ou titre) | ...suite des champs
// ============================================================

var SHEET_ID = '1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI'; // Sheet PRIVÉ

// ── Webhook POST ──────────────────────────────────────────────

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheetTab = payload.sheetTab || 'Soumissions';
    var row = payload.row || {};

    var ss = SpreadsheetApp.openById(SHEET_ID);

    // Créer l'onglet s'il n'existe pas
    var sh = ss.getSheetByName(sheetTab);
    if (!sh) {
      sh = ss.insertSheet(sheetTab);
    }

    // Si l'onglet est vide, créer les headers depuis les clés du row
    if (sh.getLastRow() === 0) {
      var headers = Object.keys(row);
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sh.setFrozenRows(1);

      // Colorer la colonne status (colonne D = index 4) en jaune
      var statusColIndex = headers.indexOf('status') + 1;
      if (statusColIndex > 0) {
        sh.getRange(1, statusColIndex).setBackground('#fef9c3');
      }
    }

    // Récupérer les headers existants pour ordonner les valeurs
    var existingHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var values = existingHeaders.map(function(h) {
      return row[h] !== undefined ? row[h] : '';
    });

    sh.appendRow(values);

    // Mettre en couleur la nouvelle ligne (jaune = à vérifier)
    var newRow = sh.getLastRow();
    sh.getRange(newRow, 1, 1, sh.getLastColumn()).setBackground('#fefce8');

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row: newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Trigger onEdit (changement de status) ────────────────────
//
// Écoute les modifications de la colonne "status" dans l'onglet "Soumissions"
// Quand le status passe à "en ligne" → copie dans l'onglet destination
// Quand le status passe à "pas en ligne" → met la ligne en rouge (rejet)

function onStatusChange(e) {
  try {
    var range = e.range;
    var sheet = range.getSheet();

    // Ignorer si on n'est pas dans l'onglet Soumissions
    if (sheet.getName() !== 'Soumissions') return;

    // Récupérer les headers
    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var statusCol = headers.indexOf('status') + 1;

    // Ignorer si la cellule modifiée n'est pas dans la colonne status
    if (range.getColumn() !== statusCol) return;

    var newStatus = range.getValue().toString().trim();
    var rowIndex = range.getRow();
    if (rowIndex === 1) return; // header row

    // Récupérer toute la ligne
    var rowValues = sheet.getRange(rowIndex, 1, 1, lastCol).getValues()[0];
    var rowObj = {};
    headers.forEach(function(h, i) { rowObj[h] = rowValues[i]; });

    if (newStatus === 'en ligne') {
      // Publier dans l'onglet destination
      var destinationTab = rowObj['destinationTab'] || rowObj['sheetTab'] || '';

      if (destinationTab) {
        var ss = sheet.getParent();
        var destSheet = ss.getSheetByName(destinationTab);

        if (!destSheet) {
          destSheet = ss.insertSheet(destinationTab);
        }

        // Ajouter une colonne "status" si elle n'existe pas dans l'onglet destination
        var destHeaders;
        if (destSheet.getLastRow() === 0) {
          // Onglet vide : créer headers depuis la ligne source (sans les champs meta)
          var metaFields = ['categorie', 'destinationTab', 'sheetTab', 'status', 'soumis_le', 'soumis_par'];
          destHeaders = headers.filter(function(h) { return !metaFields.includes(h); });
          destHeaders.push('status'); // ajouter status à la fin
          destSheet.getRange(1, 1, 1, destHeaders.length).setValues([destHeaders]);
          destSheet.getRange(1, 1, 1, destHeaders.length).setFontWeight('bold');
          destSheet.setFrozenRows(1);
        } else {
          destHeaders = destSheet.getRange(1, 1, 1, destSheet.getLastColumn()).getValues()[0];
        }

        // Construire la ligne destination
        var destValues = destHeaders.map(function(h) {
          if (h === 'status') return 'en ligne';
          return rowObj[h] !== undefined ? rowObj[h] : '';
        });

        destSheet.appendRow(destValues);
        var destRow = destSheet.getLastRow();
        destSheet.getRange(destRow, 1, 1, destSheet.getLastColumn()).setBackground('#f0fdf4');
      }

      // Colorier la ligne source en vert
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#dcfce7');

    } else if (newStatus === 'pas en ligne') {
      // Colorier en rouge/gris = rejet
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#fee2e2');

    } else if (newStatus === 'à vérifier') {
      // Remettre en jaune
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#fefce8');
    }

  } catch (err) {
    Logger.log('onStatusChange error: ' + err.toString());
  }
}

// ── Utilitaire : créer l'onglet Soumissions avec les bons headers ──

function setupSoumissionsTab() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Soumissions');

  if (!sh) {
    sh = ss.insertSheet('Soumissions');
  } else {
    sh.clearContents();
    sh.clearFormats();
  }

  var headers = [
    'id', 'categorie', 'destinationTab', 'status', 'soumis_le', 'soumis_par',
    'name', 'type', 'adresse', 'ville', 'department',
    'description', 'website', 'phone', 'email', 'tags',
    // champs variables selon la catégorie (remplis dynamiquement)
  ];

  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sh.setFrozenRows(1);

  // Colorer la colonne status (D) en jaune
  sh.getRange(1, 4).setBackground('#fef9c3');

  // Dropdown pour la colonne status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['à vérifier', 'en ligne', 'pas en ligne'], true)
    .build();
  sh.getRange('D2:D1000').setDataValidation(statusRule);

  Logger.log('Onglet Soumissions créé avec dropdown status ✅');
}

// ── GET (optionnel — liste les soumissions en attente) ─────────

function doGet(e) {
  var action = e.parameter.action || 'list';

  if (action === 'list') {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName('Soumissions');

    if (!sh || sh.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ soumissions: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    }).filter(function(r) { return r.status === 'à vérifier'; });

    return ContentService
      .createTextOutput(JSON.stringify({ soumissions: rows, total: rows.length }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
