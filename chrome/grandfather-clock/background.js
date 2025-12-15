let running = true;
let isTick = true;
let loopActive = false; // tracks whether the playNext loop is running

async function ensureOffscreen() {
	const url = chrome.runtime.getURL("offscreen.html");
	const contexts = await chrome.runtime.getContexts({
		contextTypes: ["OFFSCREEN_DOCUMENT"],
		documentUrls: [url]
	});
	if (contexts.length === 0) {
		await chrome.offscreen.createDocument({
			url,
			reasons: ["AUDIO_PLAYBACK"],
			justification: "Play tick-tock audio in background"
		});
	}
}

async function playNext() {
	if (!running) {
		loopActive = false; // mark loop as stopped
		return;
	}
	loopActive = true;
	chrome.runtime.sendMessage({ action: "play", tick: isTick });
	isTick = !isTick;
	setTimeout(playNext, 550); // include a real world mechanical delay of 50ms.
}

async function startTickTock() {
	await ensureOffscreen();
	if (!loopActive) playNext(); // start loop if not already running
}

chrome.runtime.onMessage.addListener(msg => {
	if (msg.action === "start") {
		running = true;
		startTickTock(); // resume loop if it stopped
	}
	if (msg.action === "stop") running = false;
});

// automatically start on extension load
startTickTock();
