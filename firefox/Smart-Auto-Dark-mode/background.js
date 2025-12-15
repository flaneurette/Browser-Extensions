async function applyBrowserTheme() {
    const { darkStart, darkEnd } = await browser.storage.local.get({ darkStart:19, darkEnd:7 });
    const hour = new Date().getHours();
    const dark = (hour >= darkStart || hour < darkEnd);

    await browser.browserSettings.overrideContentColorScheme.set({ value: dark ? "dark" : "light" });
}

// Initial run
applyBrowserTheme();

// Re-run every 15 minutes
setInterval(applyBrowserTheme, 15*60*1000);

// Listen for popup save
browser.runtime.onMessage.addListener((msg) => {
    if (msg.action === "updateTheme") applyBrowserTheme();
});
