chrome.runtime.onMessage.addListener((msg, sender) => {
	if (msg.type === 'notify') {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'icons/icon128.png',
			title: 'Anti-Doom Scrolling',
			message: msg.message
		})
	}

	if (msg.type === 'startPomodoro') {
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'icons/icon128.png',
			title: 'Break started',
			message: `Focus for ${msg.minutes} minutes, enjoy the break!`
		})
		setTimeout(() => {
			chrome.notifications.create({
				type: 'basic',
				iconUrl: 'icons/icon128.png',
				title: 'Break finished',
				message: 'Time to get back!'
			})
		}, msg.minutes * 60 * 1000)
	}
})