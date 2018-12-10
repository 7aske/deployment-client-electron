import { app, BrowserWindow, ipcMain, session } from "electron";
import isDev from "electron-is-dev";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

declare global {
	namespace NodeJS {
		interface Global {
			config: ConfigFile;
		}
	}
}

export interface ServerProperties {
	hostname: string;
	port: number;
}

interface ConfigFile {
	url: ServerProperties;
}

// interface PATHS {
// 	node: string;
// 	npm: string;
// }
const root = isDev ? process.cwd() : join(process.cwd(), "resources/app");
const configFilePath: string = join(root, "config/config.json");
const configFolderPath: string = join(root, "config");

if (!existsSync(configFolderPath)) {
	mkdirSync(configFolderPath);
}
if (!existsSync(configFilePath)) {
	writeFileSync(
		configFilePath,
		JSON.stringify({
			url: {hostname: "localhost", port: "80"}
		}),
		"utf8"
	);
}
const configFile: ConfigFile = JSON.parse(
	readFileSync(configFilePath, "utf8")
);

global.config = configFile;

let window: BrowserWindow | null;
let popup: BrowserWindow | null;

function createWindow(): void {
	window = new BrowserWindow({
		backgroundColor: "#2e2c29",
		height: 1024,
		icon: join(root, "dist/renderer/icons/default.png"),
		titleBarStyle: "hiddenInset",
		width: 1280
	});
	if (!isDev) window.setMenu(null);
	window.loadFile(join(root, "dist/renderer/views/renderer.html"));
	window.on("closed", () => {
		window = null;
		if (popup) popup.close();
	});
}

function createPopup(): void {
	if (!popup) {
		popup = new BrowserWindow({
			center: true,
			height: 125,
			width: 200,
			// resizable: false,
			title: "Popup",
			titleBarStyle: "hiddenInset"
		});
		popup.loadFile(join(root, "dist/main/popup.html"));
		// popup.setMenu(null);
		setTimeout(() => {
			popup.webContents.send("send:url", global.config.url);
		}, 200);
		popup.on("closed", () => {
			popup = null;
		});
	} else {
		popup.close();
		popup = null;
		createPopup();
	}
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	writeFileSync(configFilePath, JSON.stringify(global.config), "utf8");
	app.quit();
	process.kill(0);
});

ipcMain.on("open:popup", () => {
	createPopup();
});

ipcMain.on("close:popup", () => {
	if (popup) {
		popup.close();
		popup = null;
	}
});

ipcMain.on("set:cookie", (event: any, data: any) => {
	console.log(data);
	session.defaultSession.cookies.set({url: "localhost", path: "/", name: "auth", value: data.auth}, () => void 0);
	session.defaultSession.cookies.get({name: "auth"}, (err, cookies) => console.log(cookies));
	window.webContents.session.cookies.set({url: "localhost", path: "/", name: "auth", value: data.auth}, () => void 0);
});

ipcMain.on("update:serverUrl", (event: any, data: any) => {
	global.config.url = {hostname: data.hostname, port: data.port};
});

process.on("exit", () => process.kill(0));
