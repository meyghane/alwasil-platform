// ============================================================
// CagnottesSync.gs — Sync données cagnottes en temps réel
// Aucun token requis — scraping HTML pages publiques
//
// Plateformes supportées :
//   - LaunchGood (launchgood.com)
//   - HelloAsso  (helloasso.com)
//   - GoFundMe   (gofundme.com)
//
// Colonnes attendues dans l'onglet "Cagnottes" du Sheet BDD :
//   A = id
//   B = titre
//   C = organisateur
//   D = description
//   E = url              ← URL LaunchGood / HelloAsso
//   F = image_url
//   G = categorie
//   H = ville
//   I = departement
//   J = date_debut
//   K = date_fin
//   L = objectif         ← mis à jour par le script
//   M = montant_collecte ← mis à jour par le script
//   N = nb_donateurs     ← mis à jour par le script
//   O = pourcentage      ← mis à jour par le script
//   P = is_active        ← FALSE si terminé, mis à jour par le script
//   Q = source           ← "launchgood" | "helloasso" | "gofundme"
//   R = derniere_maj     ← timestamp dernière mise à jour
// ============================================================

var CAGNOTTE_SHEET_ID  = '1Qr-ZnpjCOUBWpki__ueQIQQrPSogs4bRJ0osy4RoLfU';
var CAGNOTTE_TAB       = 'Cagnottes';

// ── Trigger management ────────────────────────────────────

function createCagnotteTrigger() {
  deleteCagnotteTrigger();
  // 2x par jour : 8h et 20h
  ScriptApp.newTrigger('syncCagnottes').timeBased().everyHours(12).create();
  Logger.log('Declencheur cagnottes cree (2x/jour)');
}

function deleteCagnotteTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'syncCagnottes') ScriptApp.deleteTrigger(t);
  });
}

// ── Sync principale ───────────────────────────────────────

function syncCagnottes() {
  var ss  = SpreadsheetApp.openById(CAGNOTTE_SHEET_ID);
  var sh  = ss.getSheetByName(CAGNOTTE_TAB);
  if (!sh) { Logger.log('Onglet ' + CAGNOTTE_TAB + ' introuvable'); return; }

  var lastRow = sh.getLastRow();
  if (lastRow < 2) { Logger.log('Aucune cagnotte a synchroniser'); return; }

  var updated = 0, deactivated = 0;

  for (var row = 2; row <= lastRow; row++) {
    try {
      var url      = sh.getRange(row, 5).getValue()  || ''; // col E
      var dateFin  = sh.getRange(row, 11).getValue() || ''; // col K
      if (!url) continue;

      var data = scrapeCagnotte(url);
      if (!data) continue;

      // Mise à jour des colonnes financières
      sh.getRange(row, 12).setValue(data.objectif);         // L
      sh.getRange(row, 13).setValue(data.montant_collecte); // M
      sh.getRange(row, 14).setValue(data.nb_donateurs);     // N
      sh.getRange(row, 15).setValue(data.pourcentage);      // O

      // Déterminer si la cagnotte est active
      var isActive = determineIfActive(data, dateFin);
      sh.getRange(row, 16).setValue(isActive ? 'TRUE' : 'FALSE'); // P
      sh.getRange(row, 18).setValue(new Date().toISOString());    // R

      if (!isActive) deactivated++;
      updated++;
      Utilities.sleep(500); // respecter les serveurs
    } catch(e) {
      Logger.log('Erreur ligne ' + row + ': ' + e.message);
    }
  }

  Logger.log('Sync terminee : ' + updated + ' mises a jour, ' + deactivated + ' desactivees');
}

// ── Détecter si la cagnotte est encore active ─────────────

function determineIfActive(data, dateFin) {
  // Terminée si 100% atteint (ou plus)
  if (data.pourcentage >= 100) return false;
  // Terminée si la date de fin est passée
  if (dateFin) {
    var fin = new Date(dateFin);
    if (!isNaN(fin.getTime()) && fin < new Date()) return false;
  }
  // Terminée si la plateforme indique "ended" / "terminé"
  if (data.is_ended) return false;
  return true;
}

// ── Router selon la plateforme ────────────────────────────

function scrapeCagnotte(url) {
  url = url.trim();
  if (url.indexOf('launchgood.com') !== -1) return scrapeLaunchGood(url);
  if (url.indexOf('helloasso.com')  !== -1) return scrapeHelloAsso(url);
  if (url.indexOf('gofundme.com')   !== -1) return scrapeGoFundMe(url);
  return null;
}

// ── LaunchGood ────────────────────────────────────────────

function scrapeLaunchGood(url) {
  try {
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    // LaunchGood injecte les données dans __NEXT_DATA__ JSON
    var nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        var nextData = JSON.parse(nextDataMatch[1]);
        var campaign = nextData.props && nextData.props.pageProps && nextData.props.pageProps.campaign;
        if (campaign) {
          var raised  = parseFloat(campaign.raised_amount   || campaign.amountRaised || 0);
          var goal    = parseFloat(campaign.goal_amount      || campaign.goal        || 0);
          var backers = parseInt(campaign.backers_count      || campaign.backers     || 0);
          var pct     = goal > 0 ? Math.round((raised / goal) * 100) : 0;
          var ended   = campaign.is_ended || campaign.status === 'ended' || false;
          return { montant_collecte: raised, objectif: goal, nb_donateurs: backers, pourcentage: pct, is_ended: ended };
        }
      } catch(e) { /* fallback vers regex */ }
    }

    // Fallback : regex sur le HTML
    var raised  = extractNumber(html, [
      /\$([\d,]+(?:\.\d+)?)\s*raised/i,
      /"raised[_\s]?amount"\s*:\s*([\d.]+)/i,
      /raised\s*\$\s*([\d,]+)/i
    ]);
    var goal = extractNumber(html, [
      /goal[^\d]*([\d,]+(?:\.\d+)?)/i,
      /"goal[_\s]?amount"\s*:\s*([\d.]+)/i
    ]);
    var backers = extractNumber(html, [
      /([\d,]+)\s*donors?/i,
      /([\d,]+)\s*backers?/i,
      /"backers[_\s]?count"\s*:\s*(\d+)/i
    ]);
    var pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
    var isEnded = /campaign\s*(has\s*)?ended|campagne\s*termin/i.test(html);

    return { montant_collecte: raised, objectif: goal, nb_donateurs: backers, pourcentage: pct, is_ended: isEnded };
  } catch(e) {
    Logger.log('LaunchGood scrape erreur: ' + e.message);
    return null;
  }
}

// ── HelloAsso ─────────────────────────────────────────────

function scrapeHelloAsso(url) {
  try {
    // HelloAsso expose les données dans le HTML via un JSON dans __NEXT_DATA__
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    // HelloAsso Next.js — chercher __NEXT_DATA__
    var nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch) {
      try {
        var data     = JSON.parse(nextDataMatch[1]);
        var pageData = data.props && data.props.pageProps;
        if (pageData) {
          // Plusieurs structures possibles selon la version
          var raised  = pageData.totalAmount   || pageData.amountCollected || 0;
          var goal    = pageData.financialGoal  || pageData.goal           || 0;
          var backers = pageData.supporterCount || pageData.donorsCount    || 0;
          var pct     = goal > 0 ? Math.round((raised / goal) * 100) : 0;
          return { montant_collecte: raised, objectif: goal, nb_donateurs: backers, pourcentage: pct, is_ended: false };
        }
      } catch(e) { /* fallback */ }
    }

    // Fallback regex
    var raised  = extractNumber(html, [
      /([\d\s]+)\s*€\s*collect/i,
      /collect[eé][^\d]*([\d\s]+)\s*€/i
    ]);
    var goal    = extractNumber(html, [/([\d\s]+)\s*€\s*objectif/i, /objectif[^\d]*([\d\s]+)\s*€/i]);
    var backers = extractNumber(html, [/([\d]+)\s*contributeur/i, /([\d]+)\s*donateur/i]);
    var pct     = goal > 0 ? Math.round((raised / goal) * 100) : 0;

    return { montant_collecte: raised, objectif: goal, nb_donateurs: backers, pourcentage: pct, is_ended: false };
  } catch(e) {
    Logger.log('HelloAsso scrape erreur: ' + e.message);
    return null;
  }
}

// ── GoFundMe ──────────────────────────────────────────────

function scrapeGoFundMe(url) {
  try {
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    if (resp.getResponseCode() !== 200) return null;
    var html = resp.getContentText();

    // GoFundMe — chercher les données dans le JSON embarqué
    var match = html.match(/"current_amount"\s*:\s*([\d.]+)/);
    var raised  = match ? parseFloat(match[1]) : 0;
    match = html.match(/"goal"\s*:\s*([\d.]+)/);
    var goal    = match ? parseFloat(match[1]) : 0;
    match = html.match(/"num_donations"\s*:\s*(\d+)/);
    var backers = match ? parseInt(match[1]) : 0;
    var pct     = goal > 0 ? Math.round((raised / goal) * 100) : 0;
    var isEnded = /"is_expired"\s*:\s*true/i.test(html) || /campaign.*ended/i.test(html);

    return { montant_collecte: raised, objectif: goal, nb_donateurs: backers, pourcentage: pct, is_ended: isEnded };
  } catch(e) {
    Logger.log('GoFundMe scrape erreur: ' + e.message);
    return null;
  }
}

// ── Utilitaire : extraire un nombre via liste de regex ────

function extractNumber(html, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    var m = html.match(patterns[i]);
    if (m && m[1]) {
      // Nettoyer : espaces, virgules, etc.
      var clean = m[1].replace(/[\s,]/g, '');
      var n = parseFloat(clean);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return 0;
}

// ── Test manuel ───────────────────────────────────────────

function testSingleCagnotte() {
  // Remplace par une vraie URL LaunchGood
  var url  = 'https://www.launchgood.com/v/masjid_example';
  var data = scrapeLaunchGood(url);
  Logger.log(JSON.stringify(data));
}
