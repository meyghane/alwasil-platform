// ============================================================
// CourseEnrich.gs — Enrichissement des colonnes cours (O–T)
// Feuille privée : mosquees_france
// Colonnes cibles :
//   O (15) = has_courses    : TRUE/FALSE
//   P (16) = cours_types    : "coran,arabe,tajwid,..."
//   Q (17) = cours_audience : "hommes,femmes,enfants,mixte"
//   R (18) = cours_format   : "presentiel" | "distanciel" | "hybride"
//   S (19) = cours_description
//   T (20) = cours_verified : TRUE/FALSE
// ============================================================

var COURSE_SHEET_NAME  = 'mosquees_france';
var COURSE_BATCH_SIZE  = 20;
var COURSE_PROP_KEY    = 'COURSE_LAST_ROW';

// ── Colonnes source (1-indexed dans Apps Script) ───────────
var COL_NOM      = 2;   // B
var COL_ADRESSE  = 3;   // C
var COL_VILLE    = 4;   // D
var COL_LAT      = 8;   // H
var COL_LON      = 9;   // I
var COL_WEBSITE  = 10;  // J
var COL_INSTAGRAM= 13;  // M
var COL_FACEBOOK = 14;  // N

// Colonnes cibles
var COL_HAS_COURSES   = 15;  // O
var COL_COURS_TYPES   = 16;  // P
var COL_COURS_AUD     = 17;  // Q
var COL_COURS_FORMAT  = 18;  // R
var COL_COURS_DESC    = 19;  // S
var COL_COURS_VERIFIED= 20;  // T

// ── Cours détectables par mots-clés ───────────────────────
var COURSE_KEYWORDS = {
  'coran'              : ['coran', 'quran', "lecture du coran", 'récitation', 'recitation'],
  'tajwid'             : ['tajwid', 'tajweed', 'tartil'],
  'arabe'              : ['arabe', 'arabic', 'langue arabe', 'grammaire arabe'],
  'sciences-islamiques': ['sciences islamiques', 'islamic studies', 'aqida', 'fiqh', 'hadith', 'tafsir', 'sirah', 'sira', 'siyer'],
  'memorisation'       : ['hifz', 'mémorisation', 'memorisation', 'hifdh'],
  'enfants'            : ['enfants', 'children', 'kids', 'jeunes', 'jeunesse', 'école coranique', 'ecole coranique'],
  'fiqh'               : ['fiqh', 'jurisprudence'],
  'aqida'              : ['aqida', 'aqidah', 'théologie', 'theologie'],
  'tafsir'             : ['tafsir', 'exégèse', 'exegese'],
  'hadith'             : ['hadith', 'hadis'],
  'sirah'              : ['sirah', 'siyer', 'sira', 'prophète', 'prophete', 'vie du prophète'],
};

var AUDIENCE_KEYWORDS = {
  'hommes'  : ['hommes', 'frères', 'freres', 'men', 'brothers'],
  'femmes'  : ['femmes', 'sœurs', 'soeurs', 'sisters', 'women', 'ladies'],
  'enfants' : ['enfants', 'kids', 'children', 'jeunes', 'youth'],
  'mixte'   : ['mixte', 'tous', 'toutes', 'mixed', 'all'],
};

// ── Trigger management ────────────────────────────────────

function createCourseTrigger() {
  deleteCoursesTrigger();
  ScriptApp.newTrigger('courseEnrichBatch')
    .timeBased()
    .everyMinutes(5)
    .create();
  Logger.log('✅ Déclencheur cours créé (toutes les 5 min)');
}

function deleteCoursesTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'courseEnrichBatch') {
      ScriptApp.deleteTrigger(t);
    }
  });
  Logger.log('Déclencheur cours supprimé');
}

function resetCoursesProgress() {
  PropertiesService.getScriptProperties().deleteProperty(COURSE_PROP_KEY);
  Logger.log('Progression cours remise à zéro');
}

function coursesTriggerStatus() {
  var last = parseInt(PropertiesService.getScriptProperties().getProperty(COURSE_PROP_KEY) || '1');
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var sh   = ss.getSheetByName(COURSE_SHEET_NAME);
  var total = sh.getLastRow() - 1; // sans header
  Logger.log('Ligne actuelle : ' + last + ' / ' + total);
}

// ── Batch principal ───────────────────────────────────────

function courseEnrichBatch() {
  var props = PropertiesService.getScriptProperties();
  var startRow = parseInt(props.getProperty(COURSE_PROP_KEY) || '2');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(COURSE_SHEET_NAME);
  if (!sh) { Logger.log('Onglet ' + COURSE_SHEET_NAME + ' introuvable'); return; }

  var lastRow = sh.getLastRow();
  if (startRow > lastRow) {
    Logger.log('✅ Enrichissement cours terminé !');
    deleteCoursesTrigger();
    return;
  }

  var endRow = Math.min(startRow + COURSE_BATCH_SIZE - 1, lastRow);
  Logger.log('Enrichissement cours lignes ' + startRow + ' → ' + endRow);

  for (var row = startRow; row <= endRow; row++) {
    try {
      var nom      = sh.getRange(row, COL_NOM).getValue()     || '';
      var ville    = sh.getRange(row, COL_VILLE).getValue()   || '';
      var lat      = parseFloat(sh.getRange(row, COL_LAT).getValue())  || 0;
      var lon      = parseFloat(sh.getRange(row, COL_LON).getValue())  || 0;
      var website  = sh.getRange(row, COL_WEBSITE).getValue() || '';

      if (!nom) continue;

      // Skip si déjà rempli
      var existing = sh.getRange(row, COL_HAS_COURSES).getValue();
      if (existing !== '' && existing !== null) continue;

      var result = detectCourses(nom, ville, lat, lon, website);

      sh.getRange(row, COL_HAS_COURSES).setValue(result.has_courses ? 'TRUE' : 'FALSE');
      sh.getRange(row, COL_COURS_TYPES).setValue(result.cours_types.join(','));
      sh.getRange(row, COL_COURS_AUD).setValue(result.cours_audience.join(','));
      sh.getRange(row, COL_COURS_FORMAT).setValue(result.cours_format);
      sh.getRange(row, COL_COURS_DESC).setValue(result.cours_description);
      sh.getRange(row, COL_COURS_VERIFIED).setValue('FALSE'); // manuel après vérif

      Utilities.sleep(200);
    } catch (e) {
      Logger.log('Erreur ligne ' + row + ': ' + e.message);
    }
  }

  props.setProperty(COURSE_PROP_KEY, String(endRow + 1));
  Logger.log('Batch terminé. Prochain départ : ligne ' + (endRow + 1));
}

// ── Détection des cours ───────────────────────────────────

function detectCourses(nom, ville, lat, lon, website) {
  var result = {
    has_courses: false,
    cours_types: [],
    cours_audience: [],
    cours_format: 'presentiel',
    cours_description: '',
  };

  // 1. Chercher via Mawaqit API
  var mawaqitData = getMawaqitCourseData(nom, lat, lon);
  if (mawaqitData) {
    result.has_courses     = mawaqitData.has_courses;
    result.cours_types     = mawaqitData.cours_types;
    result.cours_audience  = mawaqitData.cours_audience;
    result.cours_format    = mawaqitData.cours_format;
    result.cours_description = mawaqitData.cours_description;
    return result;
  }

  // 2. Scraper le site web de la mosquée
  if (website) {
    var webData = scrapeWebsiteForCourses(website);
    if (webData.has_courses) {
      return webData;
    }
  }

  return result;
}

// ── Mawaqit API ───────────────────────────────────────────

function getMawaqitCourseData(nom, lat, lon) {
  if (!lat || !lon) return null;

  try {
    var url = 'https://mawaqit.net/api/2.0/mosque/search?lat=' + lat +
              '&lon=' + lon + '&wordSearch=' + encodeURIComponent(nom) + '&limit=3';

    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
    });

    if (resp.getResponseCode() !== 200) return null;

    var data = JSON.parse(resp.getContentText());
    if (!data || data.length === 0) return null;

    // Chercher la mosquée la plus proche par nom
    var best = findBestMatch(data, nom, lat, lon);
    if (!best) return null;

    // Mawaqit n'expose pas directement les cours — on scrape leur page
    var mawaqitUrl = 'https://mawaqit.net/fr/' + (best.slug || best.uuid || '');
    var pageData = scrapeWebsiteForCourses(mawaqitUrl);
    return pageData.has_courses ? pageData : null;

  } catch(e) {
    return null;
  }
}

function findBestMatch(results, targetNom, targetLat, targetLon) {
  var best = null;
  var bestScore = 0;

  results.forEach(function(m) {
    var dist = haversineKm(targetLat, targetLon,
                           parseFloat(m.lat || 0), parseFloat(m.lon || 0));
    if (dist > 1.5) return;

    var score = similarity(
      (m.name || '').toLowerCase(),
      targetNom.toLowerCase()
    );
    if (score > bestScore && score > 0.3) {
      bestScore = score;
      best = m;
    }
  });

  return best;
}

// ── Scraping site web ─────────────────────────────────────

function scrapeWebsiteForCourses(url) {
  var result = {
    has_courses: false,
    cours_types: [],
    cours_audience: [],
    cours_format: 'presentiel',
    cours_description: '',
  };

  try {
    var resp = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AlWasilBot/1.0)' }
    });

    if (resp.getResponseCode() !== 200) return result;

    var html = resp.getContentText().toLowerCase();

    // Détecter si la page mentionne des cours
    var courseIndicators = [
      'cours', 'classe', 'formation', 'enseignement', 'apprentissage',
      'apprendre', 'programme', 'inscription', 'planning', 'horaire'
    ];

    var hasCourseIndicator = courseIndicators.some(function(kw) {
      return html.indexOf(kw) !== -1;
    });

    if (!hasCourseIndicator) return result;

    // Détecter les types de cours
    Object.keys(COURSE_KEYWORDS).forEach(function(type) {
      var keywords = COURSE_KEYWORDS[type];
      var found = keywords.some(function(kw) { return html.indexOf(kw) !== -1; });
      if (found && result.cours_types.indexOf(type) === -1) {
        result.cours_types.push(type);
      }
    });

    // Si au moins un cours détecté
    if (result.cours_types.length > 0) {
      result.has_courses = true;

      // Détecter audience
      Object.keys(AUDIENCE_KEYWORDS).forEach(function(aud) {
        var keywords = AUDIENCE_KEYWORDS[aud];
        var found = keywords.some(function(kw) { return html.indexOf(kw) !== -1; });
        if (found && result.cours_audience.indexOf(aud) === -1) {
          result.cours_audience.push(aud);
        }
      });

      if (result.cours_audience.length === 0) {
        result.cours_audience = ['tous'];
      }

      // Détecter format
      if (html.indexOf('en ligne') !== -1 || html.indexOf('distanciel') !== -1 || html.indexOf('online') !== -1) {
        if (html.indexOf('présentiel') !== -1 || html.indexOf('presentiel') !== -1) {
          result.cours_format = 'hybride';
        } else {
          result.cours_format = 'distanciel';
        }
      }

      // Extraire un bout de description (autour du mot "cours")
      result.cours_description = extractCourseDescription(resp.getContentText());
    }

  } catch(e) {
    // silencieux
  }

  return result;
}

function extractCourseDescription(html) {
  // Chercher un <p> ou <li> qui contient "cours" dans le HTML brut (pas lowercase)
  var matches = html.match(/<(?:p|li|div)[^>]*>[^<]*cours[^<]{0,300}<\/(?:p|li|div)>/i);
  if (matches) {
    // Supprimer les tags HTML
    var text = matches[0].replace(/<[^>]+>/g, '').trim();
    if (text.length > 20 && text.length < 500) {
      return text.substring(0, 300);
    }
  }
  return '';
}

// ── Utilitaires ───────────────────────────────────────────

function haversineKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function similarity(a, b) {
  if (a === b) return 1;
  var longer = a.length > b.length ? a : b;
  var shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  var editDist = levenshtein(longer, shorter);
  return (longer.length - editDist) / longer.length;
}

function levenshtein(a, b) {
  var m = a.length, n = b.length;
  var dp = [];
  for (var i = 0; i <= m; i++) {
    dp[i] = [i];
    for (var j = 1; j <= n; j++) {
      dp[i][j] = i === 0 ? j :
        a[i-1] === b[j-1] ? dp[i-1][j-1] :
        1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}
