const input = document.getElementById("siteInput")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("siteList")

function showMessage(msg) {
	const message = document.createElement("div")
	message.textContent = msg
	message.style.color = "green"
	message.style.fontSize = "0.9em"
	message.style.marginTop = "5px"
	list.parentNode.insertBefore(message, list.nextSibling)
	setTimeout(() => message.remove(), 2000)
}

function renderList(sites) {
	list.innerHTML = ""
	sites.forEach((site, i) => {
		const li = document.createElement("li")
		li.textContent = site
		const delBtn = document.createElement("button")
		delBtn.textContent = "Remove"
		delBtn.onclick = () => {
			sites.splice(i, 1)
			chrome.storage.sync.set({ blockedSites: sites })
			renderList(sites)
			showMessage(`Removed ${site}`)
		}
		li.appendChild(delBtn)
		list.appendChild(li)
	})
}

chrome.storage.sync.get({ blockedSites: [] }, data => {
	renderList(data.blockedSites)
})

addBtn.onclick = () => {
	const site = input.value.trim()
	if (!site) return
	chrome.storage.sync.get({ blockedSites: [] }, data => {
		if (!data.blockedSites.includes(site)) {
			data.blockedSites.push(site)
			chrome.storage.sync.set({ blockedSites: data.blockedSites })
			renderList(data.blockedSites)
			showMessage(`Added ${site}`)
		} else {
			showMessage(`${site} is already blocked`)
		}
	})
	input.value = ""
}
