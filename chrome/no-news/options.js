const input = document.getElementById("siteInput")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("siteList")

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
		}
	})
	input.value = ""
}
