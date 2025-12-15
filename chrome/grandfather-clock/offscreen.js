const tick = new Audio(chrome.runtime.getURL("sounds/tick.mp3"));
const tock = new Audio(chrome.runtime.getURL("sounds/tock.mp3"));

chrome.runtime.onMessage.addListener(msg => {
  if (msg.action === "play") {
    if (msg.tick) tick.play();
    else tock.play();
  }
});
