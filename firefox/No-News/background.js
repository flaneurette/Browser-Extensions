const starterSites = [
  "cnn.com", "bbc.com", "nytimes.com", "foxnews.com", "theguardian.com",
  "washingtonpost.com", "reuters.com", "nbcnews.com", "cbsnews.com", "msnbc.com",
  "abcnews.go.com", "usatoday.com", "npr.org", "huffpost.com", "forbes.com",
  "bloomberg.com", "politico.com", "time.com", "newsweek.com", "economist.com",
  "apnews.com", "aljazeera.com", "dw.com", "sky.com", "independent.co.uk",
  "telegraph.co.uk", "mirror.co.uk", "dailymail.co.uk", "thesun.co.uk", "ft.com",
  "latimes.com", "chicagotribune.com", "miamiherald.com", "sfchronicle.com", "boston.com",
  "toronto.com", "thestar.com", "globalnews.ca", "cbc.ca", "ctvnews.ca",
  "abc.net.au", "smh.com.au", "theage.com.au", "news.com.au", "theaustralian.com.au",
  "japantimes.co.jp", "yomiuri.co.jp", "asahi.com", "nikkei.com", "mainichi.jp",
  "hindustantimes.com", "timesofindia.indiatimes.com", "indianexpress.com", "thehindu.com", "ndtv.com",
  "straitstimes.com", "channelnewsasia.com", "koreatimes.co.kr", "koreaherald.com", "yonhapnews.co.kr",
  "lemonde.fr", "lefigaro.fr", "liberation.fr", "20minutes.fr", "france24.com",
  "elpais.com", "elmundo.es", "lavanguardia.com", "abc.es", "eldiario.es",
  "corriere.it", "repubblica.it", "lastampa.it", "ansa.it", "ilsole24ore.com",
  "spiegel.de", "zeit.de", "faz.net", "sueddeutsche.de", "welt.de",
  "russia-today.ru", "rt.com", "tass.com", "pravda.ru", "kommersant.ru",
  "chinadaily.com.cn", "globaltimes.cn", "xinhuanet.com", "people.cn", "cctv.com",
  "haaretz.com", "jpost.com", "timesofisrael.com", "ynetnews.com", "al-monitor.com"
];

let currentSites = starterSites.map(s => s.toLowerCase());

// Helper
function getHostname(url) {
    try {
        return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    } catch {
        return "";
    }
}

// Blocking function (synchronous)
function blockRequest(details) {
    const hostname = getHostname(details.url);
    for (let site of currentSites) {
        if (hostname === site || hostname.endsWith("." + site)) {
            return { cancel: true };
        }
    }
    return { cancel: false };
}

// Register listener
browser.webRequest.onBeforeRequest.addListener(
    blockRequest,
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["blocking"]
);

// Load and merge sites from storage on startup
async function loadSites() {
    const result = await browser.storage.local.get("blockedSites");
    const storedSites = result.blockedSites || [];
    
    // Merge: starter sites + user-added sites (remove duplicates)
    const mergedSites = [...new Set([...starterSites, ...storedSites])];
    currentSites = mergedSites.map(s => s.toLowerCase());
    
    // Save merged list back to storage
    await browser.storage.local.set({ blockedSites: mergedSites });
}

// Initialize on install/update
browser.runtime.onInstalled.addListener(loadSites);

// Load sites when browser starts
browser.runtime.onStartup.addListener(loadSites);

// Also load immediately when script runs
loadSites();

// Update currentSites when storage changes
browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.blockedSites) {
        const storedSites = changes.blockedSites.newValue || [];
        // Merge again to ensure defaults are always included
        const mergedSites = [...new Set([...starterSites, ...storedSites])];
        currentSites = mergedSites.map(s => s.toLowerCase());
    }
});