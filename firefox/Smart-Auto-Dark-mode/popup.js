document.addEventListener("DOMContentLoaded", async () => {
    const data = await browser.storage.local.get({ darkStart: 19, darkEnd: 7, excludedSites: "" });
    document.getElementById("darkStart").value = data.darkStart;
    document.getElementById("darkEnd").value = data.darkEnd;
    document.getElementById("excludedSites").value = data.excludedSites;
});

document.getElementById("save").addEventListener("click", async () => {
    const darkStart = parseInt(document.getElementById("darkStart").value);
    const darkEnd = parseInt(document.getElementById("darkEnd").value);
    const excludedSites = document.getElementById("excludedSites").value;
    
    await browser.storage.local.set({ darkStart, darkEnd, excludedSites });
    document.getElementById("status").textContent = "Settings saved!";
    browser.runtime.sendMessage({ action: "updateTheme" });
});
