const thresholdEl = document.getElementById('threshold')
const enabledEl = document.getElementById('enabled')
const saveBtn = document.getElementById('save')

chrome.storage.sync.get({thresholdMs: 5 * 60 * 1000, enabled: true}, s => {
	thresholdEl.value = s.thresholdMs / 60000
	enabledEl.checked = s.enabled
})

saveBtn.addEventListener('click', () => {
	const minutes = Math.max(1, Number(thresholdEl.value) || 5)
	chrome.storage.sync.set({thresholdMs: minutes * 60 * 1000, enabled: enabledEl.checked}, () => {
		window.close()
	})
})