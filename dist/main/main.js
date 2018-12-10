"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var fs_1 = require("fs");
var path_1 = require("path");
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
        url: { hostname: "localhost", port: "80" }
    }), "utf8");
}
var configFile = JSON.parse(fs_1.readFileSync(configFilePath, "utf8"));
global.config = configFile;
var window;
var popup;
function createWindow() {
    window = new electron_1.BrowserWindow({
        backgroundColor: "#2e2c29",
        height: 1024,
        icon: path_1.join(root, "dist/renderer/icons/default.png"),
        titleBarStyle: "hiddenInset",
        width: 1280
    });
    if (!electron_is_dev_1.default)
        window.setMenu(null);
    window.loadFile(path_1.join(root, "dist/renderer/views/renderer.html"));
    window.on("closed", function () {
        window = null;
        if (popup)
            popup.close();
    });
}
function createPopup() {
    if (!popup) {
        popup = new electron_1.BrowserWindow({
            center: true,
            height: 125,
            width: 200,
            // resizable: false,
            title: "Popup",
            titleBarStyle: "hiddenInset"
        });
        popup.loadFile(path_1.join(root, "dist/main/popup.html"));
        // popup.setMenu(null);
        setTimeout(function () {
            popup.webContents.send("send:url", global.config.url);
        }, 200);
        popup.on("closed", function () {
            popup = null;
        });
    }
    else {
        popup.close();
        popup = null;
        createPopup();
    }
}
electron_1.app.on("ready", createWindow);
electron_1.app.on("window-all-closed", function () {
    fs_1.writeFileSync(configFilePath, JSON.stringify(global.config), "utf8");
    electron_1.app.quit();
    process.kill(0);
});
electron_1.ipcMain.on("open:popup", function () {
    createPopup();
});
electron_1.ipcMain.on("close:popup", function () {
    if (popup) {
        popup.close();
        popup = null;
    }
});
electron_1.ipcMain.on("set:cookie", function (event, data) {
    console.log(data);
    electron_1.session.defaultSession.cookies.set({ url: "localhost", path: "/", name: "auth", value: data.auth }, function () { return void 0; });
    electron_1.session.defaultSession.cookies.get({ name: "auth" }, function (err, cookies) { return console.log(cookies); });
    window.webContents.session.cookies.set({ url: "localhost", path: "/", name: "auth", value: data.auth }, function () { return void 0; });
});
electron_1.ipcMain.on("update:serverUrl", function (event, data) {
    global.config.url = { hostname: data.hostname, port: data.port };
});
process.on("exit", function () { return process.kill(0); });
