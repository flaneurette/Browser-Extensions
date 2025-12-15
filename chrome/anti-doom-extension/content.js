let scrolling = false
let scrollStart = 0
let totalScroll = 0
let timeoutId = null

const DEFAULT_THRESHOLD_MS = 5 * 60 * 1000

function readSettings(cb) {
	chrome.storage.sync.get({
		thresholdMs: DEFAULT_THRESHOLD_MS,
		enabled: true
	}, items => cb(items))
}

function createNudge() {
	if (document.getElementById('ads-nudge-anti-doom')) return;

	const overlay = document.createElement('div');
	overlay.id = 'ads-nudge-anti-doom';
	overlay.style.cssText = `
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2147483647;
		font-family: Arial, sans-serif;
	`;

	const messageBox = document.createElement('div');
	messageBox.style.cssText = `
		background: white;
		padding: 20px 30px;
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.3);
		text-align: center;
		max-width: 320px;
	`;

	messageBox.innerHTML = `
		<p style="font-size: 18px; margin-bottom: 20px;">You've been scrolling for a while, time for a short break?</p>
		<button class="ads-nudge-button" id="ads-nudge-break">Take 5</button>
		<button class="ads-nudge-button" id="ads-nudge-dismiss">Dismiss</button>
	`;

	overlay.appendChild(messageBox);
	document.body.appendChild(overlay);

	document.getElementById('ads-nudge-break').addEventListener('click', () => {
		chrome.runtime.sendMessage({type: 'startPomodoro', minutes: 5});
		dismissNudge();
	});
	document.getElementById('ads-nudge-dismiss').addEventListener('click', () => {
		dismissNudge();
	});
}


function dismissNudge() {
	const el = document.getElementById('ads-nudge-anti-doom')
	if (el) el.remove()
}

function onScroll() {
	if (!scrolling) {
		scrolling = true
		scrollStart = Date.now()
	}
	clearTimeout(timeoutId)
	timeoutId = setTimeout(() => {
		scrolling = false
		const elapsed = Date.now() - scrollStart
		totalScroll += elapsed
		readSettings(s => {
			if (!s.enabled) return
			if (totalScroll >= s.thresholdMs) {
				createNudge()
				chrome.runtime.sendMessage({type: 'notify', message: 'Take a short break from scrolling'})
				totalScroll = 0
			}
		})
	}, 800)
}

window.addEventListener('scroll', onScroll, {passive: true})

// remove nudge if navigating away
window.addEventListener('beforeunload', () => {
	dismissNudge()
})