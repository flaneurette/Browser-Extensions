const circle = document.getElementById("progress");
const durationInput = document.getElementById("duration");
const bell = document.getElementById("bell");
let durationSec = 25 * 60;

function updateUI(remaining, isRunning) {
	const percent = remaining / (durationSec * 1000);
	const circleLength = 2 * Math.PI * 45;
	circle.style.strokeDashoffset = circleLength * (1 - percent);
}

function pollTime() {
	chrome.runtime.sendMessage({ type: "getTime" }, res => {
		if (res.isRunning) {
			updateUI(res.remaining, true);
			setTimeout(pollTime, 1000);
		} else {
			updateUI(0, false);
		}
	});
}

document.getElementById("start").addEventListener("click", () => {
	const workMinutes = parseInt(document.getElementById("duration").value);
	const breakMinutes = parseInt(document.getElementById("break").value);
	durationSec = workMinutes * 60;

	// Save values
	chrome.storage.local.set({ pomodoroDuration: workMinutes });
	chrome.storage.local.set({ pomodoroBreak: breakMinutes });

	// Start timer
	chrome.runtime.sendMessage({ 
		type: "start", 
		duration: workMinutes,
		breaks: breakMinutes
	}, (response) => {
		if (response && response.success) {
			pollTime();
		}
	});
});

document.getElementById("stop").addEventListener("click", () => {
	chrome.runtime.sendMessage({ type: "stop" });
	updateUI(0, false);
});

chrome.runtime.onMessage.addListener(msg => {
	if (msg.type === 'alarm') {
		 // bell.play();
	}
});

// Load defaults
chrome.storage.local.get(['pomodoroDuration', 'pomodoroBreak'], (data) => {
	if (data.pomodoroDuration) {
		document.getElementById('duration').value = data.pomodoroDuration;
		durationSec = parseInt(data.pomodoroDuration) * 60;
	}
	if (data.pomodoroBreak) {
		document.getElementById('break').value = data.pomodoroBreak;
	}
});

document.getElementById("duration").addEventListener("change", (e) => {
	chrome.storage.local.set({ pomodoroDuration: e.target.value });
	durationSec = parseInt(e.target.value) * 60;
});

document.getElementById("break").addEventListener("change", (e) => {
	chrome.storage.local.set({ pomodoroBreak: e.target.value });
});

pollTime();
