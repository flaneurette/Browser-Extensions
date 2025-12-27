document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("siteInput");
    const addBtn = document.getElementById("addBtn");
    const list = document.getElementById("siteList");

    function normalizeSite(input) {
        input = input.trim();
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
            delBtn.onclick = () => {
                sites.splice(i, 1);
                browser.storage.local.set({ blockedSites: sites });
            };

            li.appendChild(delBtn);
            list.appendChild(li);
        });
    }

    browser.storage.local.get("blockedSites").then(result => {
        renderList((result.blockedSites || []).map(normalizeSite));
    });

    browser.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.blockedSites) {
            renderList((changes.blockedSites.newValue || []).map(normalizeSite));
        }
    });

    addBtn.onclick = () => {
        const site = normalizeSite(input.value);
        if (!site) return;

        browser.storage.local.get("blockedSites").then(result => {
            const sites = (result.blockedSites || []).map(normalizeSite);
            if (!sites.includes(site)) {
                sites.push(site);
                browser.storage.local.set({ blockedSites: sites });
                input.value = "";
            }
        });
    };

});
