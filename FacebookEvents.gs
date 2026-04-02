// ============================================================
// FacebookEvents.gs — Récupération événements Facebook
// Feuille privée : mosquees_france (col N = facebook URL)
// Feuille publique BDD : onglet "Events"
// ============================================================
//
// SETUP (à faire une seule fois) :
// 1. Va sur https://developers.facebook.com/ → crée une app "Consumer" ou "Business"
// 2. Dans "Graph API Explorer" génère un token avec permissions :
//    pages_read_engagement, public_profile, pages_show_list
//    (si tes pages sont publiques, un User Token long durée suffit)
// 3. Génère un Long-Lived Token (durée 60 jours) via :
//    GET https://graph.facebook.com/oauth/access_token
//      ?grant_type=fb_exchange_token
//      &client_id={APP_ID}
//      &client_secret={APP_SECRET}
//      &fb_exchange_token={SHORT_TOKEN}
// 4. Dans Apps Script : File → Project Properties → Script Properties
//    Ajoute la propriété : FB_ACCESS_TOKEN = ta_valeur_du_token
// ============================================================

var FB_SHEET_PRIV   = 'mosquees_france';  // Feuille privée avec col N = facebook
var FB_EVENTS_TAB   = 'Events';           // Onglet events dans la feuille publique BDD
var FB_BDD_ID       = '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU'; // Sheet BDD public
var FB_BATCH_SIZE   = 15;
var FB_PROP_KEY     = 'FB_EVENTS_LAST_ROW';

// Colonnes de l'onglet Events (A→V = colonnes 1→22) :
// A=id, B=titre, C=categorie, D=date_debut, E=date_fin,
// F=heure_debut, G=heure_fin, H=lieu, I=adresse, J=ville,
// K=departement, L=organisateur, M=organisateur_url,
// N=description, O=tags, P=format, Q=url_inscription,
// R=gratuit, S=prix, T=facebook_event_id, U=mosquee_id, V=source, W=featured

// ── Trigger management ────────────────────────────────────

function createFBTrigger() {
  deleteFBTrigger();
  // Tourner 1x par jour à 8h
  ScriptApp.newTrigger('facebookEventsBatch')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  Logger.log('✅ Déclencheur Facebook créé (1x/jour à 8h)');
}

function deleteFBTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'facebookEventsBatch') {
      ScriptApp.deleteTrigger(t);
    }
  });
}

function resetFBProgress() {
  PropertiesService.getScriptProperties().deleteProperty(FB_PROP_KEY);
  Logger.log('Progression FB remise à zéro');
}

// ── Batch principal ───────────────────────────────────────

function facebookEventsBatch() {
  var token = PropertiesService.getScriptProperties().getProperty('FB_ACCESS_TOKEN');
  if (!token) {
    Logger.log('❌ FB_ACCESS_TOKEN manquant. Configure-le dans Script Properties.');
    return;
  }

  var props = PropertiesService.getScriptProperties();
  var startRow = parseInt(props.getProperty(FB_PROP_KEY) || '2');

  // Lire la feuille privée pour les URLs Facebook
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var sh   = ss.getSheetByName(FB_SHEET_PRIV);
  if (!sh) { Logger.log('Onglet ' + FB_SHEET_PRIV + ' introuvable'); return; }

  var lastRow = sh.getLastRow();

  if (startRow > lastRow) {
    Logger.log('✅ Scan Facebook terminé ! Remise à zéro pour le prochain cycle.');
    props.deleteProperty(FB_PROP_KEY);
    return;
  }

  var endRow = Math.min(startRow + FB_BATCH_SIZE - 1, lastRow);
  Logger.log('Facebook events scan lignes ' + startRow + ' → ' + endRow);

  // Ouvrir la feuille BDD publique — onglet Events
  var bddSS   = SpreadsheetApp.openById(FB_BDD_ID);
  var eventSh = bddSS.getSheetByName(FB_EVENTS_TAB);
  if (!eventSh) {
    Logger.log('Onglet Events introuvable dans la BDD publique');
    return;
  }

  // Charger les IDs d'événements déjà présents pour éviter doublons
  var existingIds = getExistingEventIds(eventSh);

  var newEventsCount = 0;

  for (var row = startRow; row <= endRow; row++) {
    try {
      var fbUrl    = sh.getRange(row, 14).getValue() || ''; // col N
      var nomMosq  = sh.getRange(row, 2).getValue()  || ''; // col B
      var idOsm    = sh.getRange(row, 1).getValue()  || ''; // col A
      var ville    = sh.getRange(row, 4).getValue()  || ''; // col D
      var dept     = sh.getRange(row, 6).getValue()  || ''; // col F

      if (!fbUrl) continue;

      var pageId = extractFacebookPageId(fbUrl);
      if (!pageId) continue;

      Logger.log('Scan FB: ' + nomMosq + ' → ' + pageId);

      var events = getFacebookEvents(pageId, token);
      if (!events || events.length === 0) continue;

      events.forEach(function(ev) {
        if (existingIds[ev.id]) return; // déjà en base

        var eventRow = buildEventRow(ev, nomMosq, idOsm, ville, dept);
        eventSh.appendRow(eventRow);
        existingIds[ev.id] = true;
        newEventsCount++;
      });

      Utilities.sleep(300); // Respecter rate limits FB
    } catch(e) {
      Logger.log('Erreur ligne ' + row + ': ' + e.message);
    }
  }

  props.setProperty(FB_PROP_KEY, String(endRow + 1));
  Logger.log('Batch FB terminé. ' + newEventsCount + ' nouveaux événements ajoutés. Prochain : ligne ' + (endRow + 1));
}

// ── Récupérer les événements Facebook d'une page ──────────

function getFacebookEvents(pageId, token) {
  try {
    // L'API Graph permet de lire les événements publics avec un User Token
    var url = 'https://graph.facebook.com/v19.0/' + pageId +
              '/events?fields=id,name,description,start_time,end_time,place,cover,is_online,ticket_uri&' +
              'time_filter=upcoming&limit=10&access_token=' + token;

    var resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var code = resp.getResponseCode();

    if (code !== 200) {
      var errBody = resp.getContentText();
      Logger.log('FB API erreur ' + code + ' pour ' + pageId + ': ' + errBody.substring(0, 200));
      return [];
    }

    var data = JSON.parse(resp.getContentText());
    return data.data || [];

  } catch(e) {
    Logger.log('Erreur Facebook API: ' + e.message);
    return [];
  }
}

// ── Construire une ligne pour l'onglet Events ─────────────

function buildEventRow(fbEvent, mosqueeNom, mosqueeId, ville, dept) {
  var startTime  = fbEvent.start_time || '';
  var endTime    = fbEvent.end_time   || '';
  var datePart   = startTime ? startTime.split('T')[0] : '';
  var heurePart  = startTime && startTime.indexOf('T') !== -1 ? startTime.split('T')[1].substring(0,5) : '';
  var heureFinPart = endTime && endTime.indexOf('T') !== -1 ? endTime.split('T')[1].substring(0,5) : '';

  var lieu    = '';
  var adresse = '';
  var villeEv = ville;
  if (fbEvent.place) {
    lieu    = fbEvent.place.name || '';
    adresse = fbEvent.place.location ? (fbEvent.place.location.street || '') : '';
    villeEv = fbEvent.place.location ? (fbEvent.place.location.city || ville) : ville;
  }

  var format = fbEvent.is_online ? 'enligne' : 'presentiel';
  var fbLink  = 'https://www.facebook.com/events/' + fbEvent.id;

  // Générer un ID unique
  var eventId = 'fb_' + fbEvent.id;

  return [
    eventId,                      // A = id
    fbEvent.name || '',           // B = titre
    'conference',                 // C = categorie (par défaut; à affiner)
    datePart,                     // D = date_debut
    endTime ? endTime.split('T')[0] : datePart, // E = date_fin
    heurePart,                    // F = heure_debut
    heureFinPart,                 // G = heure_fin
    lieu || mosqueeNom,           // H = lieu
    adresse,                      // I = adresse
    villeEv,                      // J = ville
    dept,                         // K = departement
    mosqueeNom,                   // L = organisateur
    fbLink,                       // M = organisateur_url
    (fbEvent.description || '').substring(0, 500), // N = description
    '',                           // O = tags
    format,                       // P = format
    fbEvent.ticket_uri || '',     // Q = url_inscription
    'TRUE',                       // R = gratuit (par défaut TRUE, à corriger si ticket_uri)
    '',                           // S = prix
    fbEvent.id,                   // T = facebook_event_id
    mosqueeId,                    // U = mosquee_id
    'facebook',                   // V = source
    'FALSE',                      // W = featured
  ];
}

// ── Utilitaires ───────────────────────────────────────────

function extractFacebookPageId(url) {
  if (!url) return null;

  // Formats acceptés :
  // https://www.facebook.com/mosquee.truc/
  // https://facebook.com/pages/Nom/123456789
  // https://www.facebook.com/profile.php?id=123456789
  // https://fb.me/mosqueetruc

  url = url.trim();

  // ID numérique via profile.php?id=
  var profileMatch = url.match(/profile\.php\?id=(\d+)/);
  if (profileMatch) return profileMatch[1];

  // /pages/Nom/ID
  var pagesMatch = url.match(/\/pages\/[^\/]+\/(\d+)/);
  if (pagesMatch) return pagesMatch[1];

  // Slug : facebook.com/slug
  var slugMatch = url.match(/facebook\.com\/([^\/\?#]+)/);
  if (slugMatch && slugMatch[1] && slugMatch[1] !== 'pages') {
    return slugMatch[1]; // peut être un slug ou un ID numérique
  }

  return null;
}

function getExistingEventIds(eventSheet) {
  var map = {};
  var lastRow = eventSheet.getLastRow();
  if (lastRow < 2) return map;

  // Colonne T (index 20, col 20) = facebook_event_id
  var ids = eventSheet.getRange(2, 20, lastRow - 1, 1).getValues();
  ids.forEach(function(r) {
    if (r[0]) map[String(r[0])] = true;
  });

  // Aussi col A = id (peut contenir fb_XXXX)
  var eventIds = eventSheet.getRange(2, 1, lastRow - 1, 1).getValues();
  eventIds.forEach(function(r) {
    if (r[0]) map[String(r[0])] = true;
  });

  return map;
}

// ── Test manuel ───────────────────────────────────────────

function testFacebookSinglePage() {
  var token  = PropertiesService.getScriptProperties().getProperty('FB_ACCESS_TOKEN');
  var pageId = 'GrandeMosqueeDeParis'; // exemple — remplace par un vrai slug

  var events = getFacebookEvents(pageId, token);
  Logger.log('Événements trouvés : ' + events.length);
  if (events.length > 0) {
    Logger.log(JSON.stringify(events[0]));
  }
}
