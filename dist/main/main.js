"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var fs_1 = require("fs");
var path_1 = require("path");
console.log(process.cwd());
// interface PATHS {
// 	node: string;
// 	npm: string;
// }
var root = electron_is_dev_1.default ? process.cwd() : path_1.join(process.cwd(), "resources/app");
var configFilePath = path_1.join(root, "config/config.json");
var configFolderPath = path_1.join(root, "config");
if (!fs_1.existsSync(configFolderPath)) {
    fs_1.mkdirSync(configFolderPath);
}
if (!fs_1.existsSync(configFilePath)) {
    fs_1.writeFileSync(configFilePath, JSON.stringify({
        url: { hostname: "localhost", port: "3000" }
    }), "utf8");
}
var configFile = JSON.parse(fs_1.readFileSync(configFilePath, "utf8"));
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
var window;
function createWindow() {
    window = new electron_1.BrowserWindow({
        backgroundColor: "#2e2c29",
        height: 1080,
        icon: path_1.join(root, "dist/renderer/icons/default.png"),
        titleBarStyle: "hiddenInset",
        width: 1920
    });
    if (!electron_is_dev_1.default)
        window.setMenu(null);
    window.loadFile(path_1.join(root, "dist/renderer/views/renderer.html"));
    window.on("closed", function () {
        window = null;
    });
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    fs_1.writeFileSync(configFilePath, JSON.stringify(global.config), "utf8");
    electron_1.app.quit();
    process.kill(0);
});
electron_1.ipcMain.on("update:serverUrl", function (event, data) {
    global.config.url = { hostname: data.hostname, port: data.port };
});
process.on("exit", function () { return process.kill(0); });
