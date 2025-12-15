// Smart per-page dark mode with exclusions
browser.storage.local.get({ darkStart: 19, darkEnd: 7, excludedSites: "" }).then(settings => {
    const hour = new Date().getHours();
    const dark = (hour >= settings.darkStart || hour < settings.darkEnd);
    if (!dark) return;

    // Build exclusion list
    const excluded = settings.excludedSites
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);

    const hostname = window.location.hostname.toLowerCase();
    if (excluded.some(site => hostname.endsWith(site))) return;

    // If site already respects prefers-color-scheme, skip
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) return;

    // Inject forced dark CSS
    const style = document.createElement('style');
    style.id = 'auto-dark-mode-style';
    style.textContent = `
        html, body { background-color: #111 !important; color: #eee !important; }
        * { background-color: inherit !important; color: inherit !important; border-color: #333 !important; }
        a { color: #80c0ff !important; }
    `;
    document.head.appendChild(style);

    // Observe dynamic content for SPAs
    const observer = new MutationObserver(() => {
        if (!document.getElementById('auto-dark-mode-style')) {
            document.head.appendChild(style);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
});
