let timer = null;
let endTime = null;
let isBreak = false;
let duration = 25 * 60 * 1000;
let breakDuration = 5 * 60 * 1000;

function playBell() {
	chrome.tabs.create({
		url: chrome.runtime.getURL("ring.html"),
		active: true
	}, tab => {
		setTimeout(() => {
			chrome.tabs.remove(tab.id);
		}, 5000);
	});
}
restoreStateAndStart();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type === 'start') {
		duration = (parseInt(msg.duration) || 25) * 60 * 1000;
		breakDuration = (parseInt(msg.breaks) || 5) * 60 * 1000;

		endTime = Date.now() + duration;
		isBreak = false;
		startTimer(duration, breakDuration);
		saveState();

		sendResponse({ success: true });
		return true;
	}

	if (msg.type === 'stop') {
		clearInterval(timer);
		timer = null;
		endTime = null;
		saveState();

		sendResponse({ success: true });
		return true;
	}

	if (msg.type === 'getTime') {
		if (!endTime) {
			sendResponse({ remaining: 0, isRunning: false, isBreak });
		} else {
			const remaining = Math.max(0, endTime - Date.now());
			sendResponse({ remaining, isRunning: true, isBreak });
		}
		return true;
	}

	return true;
});

function startTimer(duration, breakDuration) {
	clearInterval(timer);
	timer = setInterval(() => {
		const now = Date.now();

		if (now >= endTime) {
			if (!isBreak) {
				isBreak = true;
				endTime = now + breakDuration;
				playBell();
			} else {
				isBreak = false;
				endTime = now + duration;
				playBell();
			}
			saveState();
		}
	}, 1000);
}

function saveState() {
	chrome.storage.local.set({
		endTime,
		isBreak,
		duration,
		breakDuration
	});
}

function restoreStateAndStart() {
	chrome.storage.local.get(['endTime', 'isBreak', 'duration', 'breakDuration'], data => {
		if (data.endTime && data.duration && data.breakDuration) {
			endTime = data.endTime;
			isBreak = data.isBreak;
			duration = data.duration;
			breakDuration = data.breakDuration;

			const now = Date.now();

			if (now < endTime) {
				// Timer still running, restart interval
				startTimer(duration, breakDuration);
			} else {
				// Timer expired while worker was unloaded, trigger alarms accordingly
				if (!isBreak) {
					// Work session expired, send break alarm and start break timer
					isBreak = true;
					endTime = now + breakDuration;
					chrome.runtime.sendMessage({ type: 'alarm', phase: 'break' });
					startTimer(duration, breakDuration);
				} else {
					// Break session expired, send work alarm and start work timer
					isBreak = false;
					endTime = now + duration;
					chrome.runtime.sendMessage({ type: 'alarm', phase: 'work' });
					startTimer(duration, breakDuration);
				}
				saveState();
			}
		} else {
		}
	});
}

// Save state before service worker unloads
chrome.runtime.onSuspend.addListener(() => {
	saveState();
});
