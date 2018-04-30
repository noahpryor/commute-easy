


export async function injectMapOverlay() {
    const scriptText = await fetch(browser.runtime.getURL("scripts/inject.js")).then(response => response.text())
    const script = document.createElement('script');
    script.textContent = scriptText
    document.head.appendChild(script);
}

