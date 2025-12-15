async function getTabsExceptFocused() {
	// get current window id first
	const currentWindow = await chrome.windows.getCurrent();
	// get all tabs in the current window
	const tabs = await chrome.tabs.query({ windowId: currentWindow.id });
	// find the active tab in this window
	const focusedTab = tabs.find(tab => tab.active);
	if (!focusedTab) return [];
	// return all tabs except the active one
	return tabs.filter(tab => tab.id !== focusedTab.id);
}

function renderTabs(tabs) {
	const container = document.getElementById('inactiveTabs');
	if (tabs.length === 0) {
		container.textContent = 'No inactive tabs found.';
		return;
	}

	container.innerHTML = '';
	tabs.forEach(tab => {
		const div = document.createElement('div');
		div.className = 'tab-item';
		const title = tab.title || tab.url;
		const url = tab.url;
		div.textContent = title.length > 50 ? title.slice(0, 47) + '...' : title;
		div.title = url;
		container.appendChild(div);
	});
}

document.getElementById('closeTabsBtn').addEventListener('click', async () => {
	const tabsToClose = await getTabsExceptFocused();
	if (tabsToClose.length === 0) {
		alert('No tabs to close.');
		return;
	}
	const tabIds = tabsToClose.map(t => t.id);
	chrome.tabs.remove(tabIds);
	window.close();
});

document.getElementById('aboutLink').addEventListener('click', () => {
	chrome.tabs.create({ url: chrome.runtime.getURL('about.html') });
});

(async () => {
	const tabsToClose = await getTabsExceptFocused();
	renderTabs(tabsToClose);
})();
