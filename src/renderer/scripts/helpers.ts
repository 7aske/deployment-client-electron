let electron: any = null;

import("electron").then(e => electron = e).catch(() => electron = undefined);

interface Storage {
	url: { hostname: string; port: number };
}

function formatUrl(hostname: string, port: number | string): string {
	if (port == 443) {
		return `https://${hostname}:${port}`;
	} else {
		return `http://${hostname}:${port}`;
	}
}

function getUrl() {
	if (electron == undefined || electron == null) {
		const storage = JSON.parse(localStorage.getItem("config")) as Storage;
		if (!storage) {
			const url = {hostname: location.hostname, port: 80};
			localStorage.setItem("config", JSON.stringify({url}));
			return url;
		} else {
			return storage.url;
		}
	} else {
		const storage = electron.remote.getGlobal("config") as Storage;
		return storage.url;
	}
}

function openUrl(url: string) {
	if (electron == undefined || electron == null) {
		window.open(url, "_blank");
	} else {
		electron.shell.openExternal(url);
	}
}

function saveUrl(url: any) {
	if (electron == undefined || electron == null) {
		localStorage.setItem("config", JSON.stringify({url}));
	} else {
		electron.ipcRenderer.send("update:serverUrl", url);
	}
}

function promptAuth() {
	if (!(electron == undefined || electron == null)) {
		electron.ipcRenderer.send("open:popup");
	}
}
