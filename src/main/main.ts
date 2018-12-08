import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
console.log(process.cwd());
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
			url: {hostname: "localhost", port: "3000"}
		}),
		"utf8"
	);
}
const configFile: ConfigFile = JSON.parse(
	readFileSync(configFilePath, "utf8")
);

global.config = configFile;

// const PATHS: PATHS = {
// 	node: "node",
// 	npm: "npm"
// };
// if (process.platform == "linux") {
// 	PATHS.node = execSync("which node")
// 		.toString()
// 		.split("\n")[0];
// 	PATHS.npm = execSync("which npm")
// 		.toString()
// 		.split("\n")[0];
// } else if (process.platform == "win32") {
// 	PATHS.node = execSync("where node")
// 		.toString()
// 		.split("\r\n")[0];
// 	PATHS.npm = execSync("where npm")
// 		.toString()
// 		.split("\r\n")[1];
// }

let window: BrowserWindow | null;

function createWindow(): void {
	window = new BrowserWindow({
		backgroundColor: "#2e2c29",
		height: 1080,
		icon: join(root, "dist/renderer/icons/default.png"),
		titleBarStyle: "hiddenInset",
		width: 1920
	});
	if (!isDev) window.setMenu(null);
	window.loadFile(join(root, "dist/renderer/views/renderer.html"));
	window.on("closed", () => {
		window = null;
	});
}
app.on("ready", createWindow);

app.on("window-all-closed", () => {
	writeFileSync(configFilePath, JSON.stringify(global.config), "utf8");
	app.quit();
	process.kill(0);
});

ipcMain.on("update:serverUrl", (event: any, data: any) => {
	global.config.url = {hostname: data.hostname, port: data.port};
});

process.on("exit", () => process.kill(0));
