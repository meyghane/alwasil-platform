// ============================================================
// SoumissionsRouter.gs — Al-Wasil
// ============================================================

var SHEET_ID = '1Lrx55hXR_fgAViZOT6B1fb72QXrVu7TgFxwZCkDwJeI'; // Sheet PRIVÉ

// ── Webhook POST ──────────────────────────────────────────────

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    // ── Routage selon l'action ──────────────────────────────
    if (payload.action === 'directImport')  return handleDirectImport(payload);
    if (payload.action === 'login')         return handleLogin(payload);
    if (payload.action === 'listUsers')     return handleListUsers();
    if (payload.action === 'createUser')    return handleCreateUser(payload);
    if (payload.action === 'updateUser')    return handleUpdateUser(payload);
    if (payload.action === 'updatePassword') return handleUpdatePassword(payload);
    if (payload.action === 'updateStatus')  return handleUpdateStatus(payload);
    // ────────────────────────────────────────────────────────

    // Comportement par défaut : écriture dans Soumissions
    var sheetTab = payload.sheetTab || 'Soumissions';
    var row = payload.row || payload; // accepte row imbriqué OU payload direct

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName(sheetTab);
    if (!sh) {
      sh = ss.insertSheet(sheetTab);
    }

    if (sh.getLastRow() === 0) {
      var headers = Object.keys(row);
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sh.setFrozenRows(1);
      var statusColIndex = headers.indexOf('status') + 1;
      if (statusColIndex > 0) sh.getRange(1, statusColIndex).setBackground('#fef9c3');
    }

    var existingHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var values = existingHeaders.map(function(h) {
      return row[h] !== undefined ? row[h] : '';
    });

    sh.appendRow(values);
    var newRow = sh.getLastRow();
    sh.getRange(newRow, 1, 1, sh.getLastColumn()).setBackground('#fefce8');

    return jsonOk({ ok: true, row: newRow });

  } catch (err) {
    return jsonOk({ ok: false, error: err.toString() });
  }
}

// ── Import direct (Claude via terminal) ──────────────────────

function handleDirectImport(data) {
  var ss   = SpreadsheetApp.openById(SHEET_ID);
  var rows = data.rows || [];
  var by   = data.importedBy || 'Wassil';
  var at   = data.importedAt || new Date().toISOString();

  // Onglet Historique
  var hist = ss.getSheetByName('Historique');
  if (!hist) {
    hist = ss.insertSheet('Historique');
    hist.appendRow(['ID', 'CATEGORIE', 'ONGLET', 'NOM', 'ACTION', 'DATE', 'PAR']);
    hist.getRange(1, 1, 1, 7).setFontWeight('bold');
  }

  var results = [];

  for (var i = 0; i < rows.length; i++) {
    var row     = rows[i];
    var tabName = row.sheetTab || 'Soumissions';

    var sh = ss.getSheetByName(tabName);
    if (!sh) sh = ss.insertSheet(tabName);

    if (sh.getLastRow() === 0) {
      sh.appendRow(Object.keys(row));
      sh.getRange(1, 1, 1, Object.keys(row).length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }

    var hdrs = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var vals = hdrs.map(function(h) { return row[h] !== undefined ? row[h] : ''; });
    sh.appendRow(vals);
    sh.getRange(sh.getLastRow(), 1, 1, sh.getLastColumn()).setBackground('#f0fdf4');

    // Log Historique
    var nom = row.titre || row.name || row.nom || '(sans titre)';
    hist.appendRow([row.id || ('imp-' + i), row.categorie || '', tabName, nom, 'IMPORT', at, by]);

    results.push({ id: row.id, tab: tabName, status: 'ok' });
  }

  return jsonOk({ success: true, imported: results.length });
}

// ── Update status depuis /admin/soumissions ───────────────────

function handleUpdateStatus(data) {
  var ss  = SpreadsheetApp.openById(SHEET_ID);
  var sh  = ss.getSheetByName('Soumissions');
  if (!sh) return jsonOk({ ok: false, error: 'Onglet Soumissions introuvable' });

  var rows    = sh.getDataRange().getValues();
  var headers = rows[0];
  var idIdx   = headers.indexOf('id');
  var statIdx = headers.indexOf('status');

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][idIdx]) === String(data.id)) {
      sh.getRange(i + 1, statIdx + 1).setValue(data.status);
      var color = data.status === 'en ligne' ? '#dcfce7' : data.status === 'pas en ligne' ? '#fee2e2' : '#fefce8';
      sh.getRange(i + 1, 1, 1, sh.getLastColumn()).setBackground(color);
      return jsonOk({ ok: true });
    }
  }
  return jsonOk({ ok: false, error: 'ID non trouvé' });
}

// ── Auth comptes modo ─────────────────────────────────────────

function handleLogin(data) {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Comptes');
  if (!sheet) return jsonOk({ success: false, error: 'Onglet Comptes inexistant' });

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var emailIdx = headers.indexOf('EMAIL');
  var passIdx  = headers.indexOf('PASSWORD');
  var roleIdx  = headers.indexOf('ROLE');
  var nameIdx  = headers.indexOf('NAME');
  var permIdx  = headers.indexOf('PERMISSIONS');
  var actifIdx = headers.indexOf('ACTIF');
  var idIdx    = headers.indexOf('ID');

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var actif = String(r[actifIdx]).toLowerCase();
    if (r[emailIdx] === data.email && r[passIdx] === data.password && actif !== 'non' && actif !== 'false') {
      var permsRaw = r[permIdx] || 'all';
      var permissions = String(permsRaw).split(',').map(function(p) { return p.trim(); });
      return jsonOk({
        success: true,
        user: {
          id:          r[idIdx] || ('modo-' + i),
          email:       r[emailIdx],
          name:        r[nameIdx] || 'Modérateur',
          role:        r[roleIdx] || 'modo',
          permissions: permissions
        }
      });
    }
  }
  return jsonOk({ success: false, error: 'Identifiants incorrects' });
}

function handleListUsers() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Comptes');
  if (!sheet) return jsonOk({ users: [] });

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var users   = [];

  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = String(headers[j]).toLowerCase();
      if (key !== 'password') obj[key] = rows[i][j];
    }
    users.push(obj);
  }
  return jsonOk({ users: users });
}

function handleCreateUser(data) {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Comptes');
  if (!sheet) {
    sheet = ss.insertSheet('Comptes');
    sheet.appendRow(['ID', 'EMAIL', 'PASSWORD', 'NAME', 'ROLE', 'PERMISSIONS', 'ACTIF', 'CREATED_AT', 'CREATED_BY']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  var u    = data.user || {};
  var perm = Array.isArray(u.permissions) ? u.permissions.join(',') : (u.permissions || 'all');
  sheet.appendRow([
    u.id || ('modo-' + Date.now()),
    u.email || '', u.password || '', u.name || '',
    u.role || 'modo', perm, 'OUI',
    u.createdAt || new Date().toISOString(),
    u.createdBy || 'admin'
  ]);
  return jsonOk({ success: true });
}

function handleUpdatePassword(data) {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Comptes');
  if (!sheet) return jsonOk({ ok: false, error: 'Onglet Comptes introuvable' });

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var emailIdx = headers.indexOf('EMAIL');
  var passIdx  = headers.indexOf('PASSWORD');

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][emailIdx] === data.email) {
      sheet.getRange(i + 1, passIdx + 1).setValue(data.newPassword);
      return jsonOk({ ok: true });
    }
  }
  return jsonOk({ ok: false, error: 'Utilisateur non trouvé' });
}

function handleUpdateUser(data) {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Comptes');
  if (!sheet) return jsonOk({ ok: false });

  var rows    = sheet.getDataRange().getValues();
  var headers = rows[0];
  var idIdx   = headers.indexOf('ID');

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][idIdx]) === String(data.id)) {
      if (data.actif !== undefined) {
        var actifIdx = headers.indexOf('ACTIF');
        sheet.getRange(i + 1, actifIdx + 1).setValue(data.actif ? 'OUI' : 'NON');
      }
      if (data.permissions) {
        var permIdx = headers.indexOf('PERMISSIONS');
        var perm    = Array.isArray(data.permissions) ? data.permissions.join(',') : data.permissions;
        sheet.getRange(i + 1, permIdx + 1).setValue(perm);
      }
      return jsonOk({ ok: true });
    }
  }
  return jsonOk({ ok: false, error: 'Utilisateur non trouvé' });
}

// ── Trigger onEdit ────────────────────────────────────────────

function onStatusChange(e) {
  try {
    var range  = e.range;
    var sheet  = range.getSheet();
    if (sheet.getName() !== 'Soumissions') return;

    var lastCol   = sheet.getLastColumn();
    var headers   = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var statusCol = headers.indexOf('status') + 1;
    if (range.getColumn() !== statusCol) return;

    var newStatus = range.getValue().toString().trim();
    var rowIndex  = range.getRow();
    if (rowIndex === 1) return;

    var rowValues = sheet.getRange(rowIndex, 1, 1, lastCol).getValues()[0];
    var rowObj    = {};
    headers.forEach(function(h, i) { rowObj[h] = rowValues[i]; });

    if (newStatus === 'en ligne') {
      var destinationTab = rowObj['destinationTab'] || rowObj['sheetTab'] || '';
      if (destinationTab) {
        var ss         = sheet.getParent();
        var destSheet  = ss.getSheetByName(destinationTab);
        if (!destSheet) destSheet = ss.insertSheet(destinationTab);

        var destHeaders;
        if (destSheet.getLastRow() === 0) {
          var metaFields = ['categorie', 'destinationTab', 'sheetTab', 'status', 'soumis_le', 'soumis_par'];
          destHeaders = headers.filter(function(h) { return !metaFields.includes(h); });
          destHeaders.push('status');
          destSheet.getRange(1, 1, 1, destHeaders.length).setValues([destHeaders]);
          destSheet.getRange(1, 1, 1, destHeaders.length).setFontWeight('bold');
          destSheet.setFrozenRows(1);
        } else {
          destHeaders = destSheet.getRange(1, 1, 1, destSheet.getLastColumn()).getValues()[0];
        }

        var destValues = destHeaders.map(function(h) {
          if (h === 'status') return 'en ligne';
          return rowObj[h] !== undefined ? rowObj[h] : '';
        });
        destSheet.appendRow(destValues);
        destSheet.getRange(destSheet.getLastRow(), 1, 1, destSheet.getLastColumn()).setBackground('#f0fdf4');

        // Log Historique
        var hist = ss.getSheetByName('Historique');
        if (!hist) {
          hist = ss.insertSheet('Historique');
          hist.appendRow(['ID', 'CATEGORIE', 'ONGLET', 'NOM', 'ACTION', 'DATE', 'PAR']);
        }
        var nom = rowObj['name'] || rowObj['titre'] || rowObj['nom'] || '(sans titre)';
        hist.appendRow([rowObj['id'] || '', rowObj['categorie'] || '', destinationTab, nom, 'PUBLICATION', new Date().toISOString(), 'admin']);
      }
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#dcfce7');

    } else if (newStatus === 'pas en ligne') {
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#fee2e2');

      // Log rejet
      var ss2  = sheet.getParent();
      var hist2 = ss2.getSheetByName('Historique');
      if (!hist2) {
        hist2 = ss2.insertSheet('Historique');
        hist2.appendRow(['ID', 'CATEGORIE', 'ONGLET', 'NOM', 'ACTION', 'DATE', 'PAR']);
      }
      var nom2 = rowObj['name'] || rowObj['titre'] || rowObj['nom'] || '(sans titre)';
      hist2.appendRow([rowObj['id'] || '', rowObj['categorie'] || '', '', nom2, 'REJET', new Date().toISOString(), 'admin']);

    } else if (newStatus === 'à vérifier') {
      sheet.getRange(rowIndex, 1, 1, lastCol).setBackground('#fefce8');
    }

  } catch (err) {
    Logger.log('onStatusChange error: ' + err.toString());
  }
}

// ── Setup ─────────────────────────────────────────────────────

function setupSoumissionsTab() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('Soumissions');
  if (!sh) sh = ss.insertSheet('Soumissions');
  else { sh.clearContents(); sh.clearFormats(); }

  var headers = ['id', 'categorie', 'destinationTab', 'status', 'soumis_le', 'soumis_par', 'name', 'type', 'adresse', 'ville', 'department', 'description', 'tags'];
  sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sh.setFrozenRows(1);
  sh.getRange(1, 4).setBackground('#fef9c3');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(['à vérifier', 'en ligne', 'pas en ligne'], true).build();
  sh.getRange('D2:D1000').setDataValidation(rule);
  Logger.log('Setup OK ✅');
}

// ── GET ───────────────────────────────────────────────────────

function doGet(e) {
  var action = e.parameter.action || 'list';

  if (action === 'list') {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sh = ss.getSheetByName('Soumissions');
    if (!sh || sh.getLastRow() < 2) return jsonOk({ soumissions: [] });

    var data    = sh.getDataRange().getValues();
    var headers = data[0];
    var rows    = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
    return jsonOk({ soumissions: rows, total: rows.length });
  }

  if (action === 'listUsers')     return handleListUsers();
  if (action === 'listHistorique') return handleListHistorique();

  return jsonOk({ ok: true });
}

// ── Lire l'historique depuis l'onglet Historique du Sheet PRIVÉ ──

function handleListHistorique() {
  var ss   = SpreadsheetApp.openById(SHEET_ID);
  var hist = ss.getSheetByName('Historique');
  if (!hist || hist.getLastRow() < 2) return jsonOk({ historique: [] });

  var data    = hist.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase(); });
  var rows    = data.slice(1)
    .filter(function(row) { return row[0] !== ''; }) // ignore lignes vides
    .map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) {
        // Convertit les objets Date en ISO string
        var val = row[i];
        if (val instanceof Date) {
          obj[h] = val.toISOString();
        } else {
          obj[h] = val;
        }
      });
      return obj;
    });

  rows.reverse(); // plus récents en premier
  return jsonOk({ historique: rows, total: rows.length });
}

// ── Trigger installable : log chaque modification de sheet ────

var TABS_IGNORED = ['Historique', 'Comptes', 'Paramètres'];
var REVALIDATE_URL = 'https://alwasil-platform.vercel.app/api/revalidate';

function onEditInstallable(e) {
  try {
    var range   = e.range;
    var sheet   = range.getSheet();
    var tabName = sheet.getName();

    if (TABS_IGNORED.indexOf(tabName) !== -1) return;
    if (range.getRow() === 1) return;

    var ss   = sheet.getParent();
    var hist = ss.getSheetByName('Historique');
    if (!hist) {
      hist = ss.insertSheet('Historique');
      hist.appendRow(['ID', 'CATEGORIE', 'ONGLET', 'NOM', 'ACTION', 'DATE', 'PAR']);
      hist.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var rowVals = sheet.getRange(range.getRow(), 1, 1, lastCol).getValues()[0];
    var rowMap  = {};
    headers.forEach(function(h, i) { rowMap[String(h).toLowerCase()] = rowVals[i]; });

    var rowId   = rowMap['id'] || ('row-' + range.getRow());
    var rowNom  = rowMap['nom'] || rowMap['titre'] || rowMap['name'] || rowMap['id'] || '';
    var colName = headers[range.getColumn() - 1] || ('col' + range.getColumn());
    var newVal  = String(range.getValue()).slice(0, 80);
    var auteur  = tabName === 'Soumissions' ? (rowMap['soumis_par'] || 'Admin') : 'Admin';

    hist.appendRow([
      rowId, tabName, tabName,
      rowNom + ' [' + colName + '=' + newVal + ']',
      tabName === 'Soumissions' ? 'STATUT' : 'MODIFICATION',
      new Date().toISOString(),
      auteur
    ]);

    // Revalider le cache Vercel si le secret est configuré
    var secret = PropertiesService.getScriptProperties().getProperty('REVALIDATE_SECRET') || '';
    if (secret) {
      UrlFetchApp.fetch(REVALIDATE_URL, {
        method: 'post',
        contentType: 'application/json',
        headers: { 'x-revalidate-secret': secret },
        payload: JSON.stringify({ paths: ['/', '/education', '/piscines', '/librairies', '/sante', '/jobs'] }),
        muteHttpExceptions: true
      });
    }

  } catch (err) {
    Logger.log('onEditInstallable error: ' + err.toString());
  }
}

// ── Installer le trigger (à exécuter UNE SEULE FOIS depuis Apps Script) ──

function setupTriggers() {
  // Supprimer les doublons éventuels
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'onEditInstallable') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  // Installer le trigger onEdit sur le Sheet PRIVÉ
  ScriptApp.newTrigger('onEditInstallable')
    .forSpreadsheet(SpreadsheetApp.openById(SHEET_ID))
    .onEdit()
    .create();

  Logger.log('✅ Trigger onEditInstallable installé sur ' + SHEET_ID);
}

// ── Configurer le secret Vercel (à exécuter UNE SEULE FOIS) ──────────────

function setupRevalidateSecret() {
  // Remplace la valeur ci-dessous par ton vrai secret (env var REVALIDATE_SECRET dans Vercel)
  PropertiesService.getScriptProperties().setProperty('REVALIDATE_SECRET', 'alwasil-revalidate-2026');
  Logger.log('✅ REVALIDATE_SECRET configuré');
}

// ── Helper ────────────────────────────────────────────────────

function jsonOk(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
