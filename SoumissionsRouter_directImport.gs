// ═══════════════════════════════════════════════════════════════════
// AJOUTER CE BLOC DANS SoumissionsRouter.gs (dans la fonction doPost)
// ═══════════════════════════════════════════════════════════════════

// Dans doPost, ajoute ce cas dans le switch/if :
//
//  if (action === 'directImport') {
//    return handleDirectImport(data);
//  }
//
// Puis ajoute la fonction ci-dessous :

function handleDirectImport(data) {
  var ss = SpreadsheetApp.openById(SHEET_PRIVE_ID); // ton ID Sheet privé
  var rows = data.rows || [];
  var importedBy = data.importedBy || 'Claude';
  var importedAt = data.importedAt || new Date().toISOString();
  var results = [];

  // Onglet Historique
  var histSheet = ss.getSheetByName('Historique');
  if (!histSheet) {
    histSheet = ss.insertSheet('Historique');
    histSheet.appendRow(['ID', 'CATEGORIE', 'ONGLET', 'NOM', 'ACTION', 'DATE', 'PAR']);
  }

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var tabName = row.sheetTab || 'Soumissions';

    // Trouver ou créer l'onglet cible
    var targetSheet = ss.getSheetByName(tabName);
    if (!targetSheet) {
      targetSheet = ss.insertSheet(tabName);
    }

    // Si l'onglet est vide, ajouter les headers depuis les clés du premier row
    if (targetSheet.getLastRow() === 0) {
      targetSheet.appendRow(Object.keys(row));
    }

    // Écrire la ligne dans l'ordre des headers existants
    var headers = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0];
    var rowData = headers.map(function(h) {
      return row[h] !== undefined ? row[h] : '';
    });
    targetSheet.appendRow(rowData);

    // Log dans Historique
    var nom = row.titre || row.name || row.nom || '(sans titre)';
    histSheet.appendRow([
      row.id || ('import-' + i),
      row.categorie || '',
      tabName,
      nom,
      'IMPORT',
      importedAt,
      importedBy
    ]);

    results.push({ id: row.id, status: 'ok', tab: tabName });
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, imported: results.length, results: results }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ═══════════════════════════════════════════════════════════════════
// AJOUTER AUSSI CES FONCTIONS pour la gestion des comptes modo
// ═══════════════════════════════════════════════════════════════════

var COMPTES_TAB = 'Comptes';

function handleLogin(data) {
  var ss = SpreadsheetApp.openById(SHEET_PRIVE_ID);
  var sheet = ss.getSheetByName(COMPTES_TAB);
  if (!sheet) return jsonResponse({ success: false, error: 'Onglet Comptes inexistant' });

  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var emailIdx = headers.indexOf('EMAIL');
  var passIdx  = headers.indexOf('PASSWORD');
  var roleIdx  = headers.indexOf('ROLE');
  var nameIdx  = headers.indexOf('NAME');
  var permIdx  = headers.indexOf('PERMISSIONS');
  var actifIdx = headers.indexOf('ACTIF');
  var idIdx    = headers.indexOf('ID');

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (row[emailIdx] === data.email && row[passIdx] === data.password && row[actifIdx] !== false && row[actifIdx] !== 'false' && row[actifIdx] !== 'NON') {
      var permsRaw = row[permIdx] || 'all';
      var permissions = typeof permsRaw === 'string' ? permsRaw.split(',').map(function(p) { return p.trim(); }) : ['all'];
      return jsonResponse({
        success: true,
        user: {
          id:          row[idIdx] || ('modo-' + i),
          email:       row[emailIdx],
          name:        row[nameIdx] || 'Modérateur',
          role:        row[roleIdx] || 'modo',
          permissions: permissions
        }
      });
    }
  }
  return jsonResponse({ success: false, error: 'Identifiants incorrects' });
}

function handleListUsers() {
  var ss = SpreadsheetApp.openById(SHEET_PRIVE_ID);
  var sheet = ss.getSheetByName(COMPTES_TAB);
  if (!sheet) return jsonResponse({ users: [] });

  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var users = [];

  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j].toLowerCase()] = rows[i][j];
    }
    // Ne jamais exposer le mot de passe
    delete obj['password'];
    users.push(obj);
  }
  return jsonResponse({ users: users });
}

function handleCreateUser(data) {
  var ss = SpreadsheetApp.openById(SHEET_PRIVE_ID);
  var sheet = ss.getSheetByName(COMPTES_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(COMPTES_TAB);
    sheet.appendRow(['ID', 'EMAIL', 'PASSWORD', 'NAME', 'ROLE', 'PERMISSIONS', 'ACTIF', 'CREATED_AT', 'CREATED_BY']);
  }

  var user = data.user || {};
  var perms = Array.isArray(user.permissions) ? user.permissions.join(',') : (user.permissions || 'all');

  sheet.appendRow([
    user.id || ('modo-' + Date.now()),
    user.email || '',
    user.password || '',
    user.name || '',
    user.role || 'modo',
    perms,
    'OUI',
    user.createdAt || new Date().toISOString(),
    user.createdBy || 'admin'
  ]);
  return jsonResponse({ success: true });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
