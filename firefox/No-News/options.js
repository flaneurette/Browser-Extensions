const input = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("siteList");

function normalizeSite(input) {
    input = input.replace(/^https?:\/\//, "");
    input = input.replace(/\/.*$/, "");
    if (input.startsWith("www.")) input = input.slice(4);
    return input.toLowerCase();
}

function renderList(sites) {
    list.innerHTML = "";
    sites.forEach((site, i) => {
        const li = document.createElement("li");
        li.textContent = site;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Remove";
        delBtn.onclick = async () => {
            sites.splice(i, 1);
            await chrome.storage.sync.set({ blockedSites: sites });
            renderList(sites);
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

async function init() {
    const result = await chrome.storage.sync.get("blockedSites");
    const sites = (result && Array.isArray(result.blockedSites)) ? result.blockedSites : [];
    renderList(sites);
}

init();

addBtn.onclick = async () => {
    const raw = input.value.trim();
    if (!raw) return;

    const site = normalizeSite(raw);

    const result = await chrome.storage.sync.get("blockedSites");
    const sites = (result && Array.isArray(result.blockedSites)) ? result.blockedSites : [];

    if (!sites.includes(site)) {
        sites.push(site);
        await chrome.storage.sync.set({ blockedSites: sites });
        renderList(sites);
    }

    input.value = "";
};
