const input = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("siteList");

// Normalize any URL or domain
function normalizeSite(input) {
    input = input.trim();
    input = input.replace(/^https?:\/\//, ""); // remove protocol
    input = input.replace(/\/.*$/, "");       // remove path
    if (input.startsWith("www.")) input = input.slice(4);
    return input.toLowerCase();
}

// Render the blocked sites list
function renderList(sites) {
    list.innerHTML = "";
    sites.forEach((site, i) => {
        const li = document.createElement("li");
        li.textContent = site;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Remove";
        delBtn.onclick = async () => {
            sites.splice(i, 1);
            await chrome.storage.local.set({ blockedSites: sites });
            renderList(sites);
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Load initial list from storage
chrome.storage.local.get("blockedSites", (result) => {
    const sites = (result.blockedSites || []).map(normalizeSite);
    renderList(sites);
});

// Listen for storage changes to update list live
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.blockedSites) {
        const sites = (changes.blockedSites.newValue || []).map(normalizeSite);
        renderList(sites);
    }
});

// Add new site
addBtn.onclick = () => {
    const raw = input.value;
    if (!raw) return;

    const site = normalizeSite(raw);

    chrome.storage.local.get("blockedSites", (result) => {
        const sites = (result.blockedSites || []).map(normalizeSite);

        if (!sites.includes(site)) {
            sites.push(site);
            chrome.storage.local.set({ blockedSites: sites });
            input.value = "";
        }
    });
};

