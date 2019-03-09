"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var electron = null;
Promise.resolve().then(function () { return __importStar(require("electron")); }).then(function (e) { return electron = e; }).catch(function () { return electron = undefined; });
function formatUrl(hostname, port) {
    if (port == 443) {
        return "https://" + hostname + ":" + port;
    }
    else {
        return "http://" + hostname + ":" + port;
    }
}
function getUrl() {
    if (electron == undefined || electron == null) {
        var storage = JSON.parse(localStorage.getItem("config"));
        if (!storage) {
            var url = { hostname: location.hostname, port: 80 };
            localStorage.setItem("config", JSON.stringify({ url: url }));
            return url;
        }
        else {
            return storage.url;
        }
    }
    else {
        var storage = electron.remote.getGlobal("config");
        return storage.url;
    }
}
function openUrl(url) {
    if (electron == undefined || electron == null) {
        window.open(url, "_blank");
    }
    else {
        electron.shell.openExternal(url);
    }
}
function saveUrl(url) {
    if (electron == undefined || electron == null) {
        localStorage.setItem("config", JSON.stringify({ url: url }));
    }
    else {
        electron.ipcRenderer.send("update:serverUrl", url);
    }
}
function promptAuth() {
    if (!(electron == undefined || electron == null)) {
        electron.ipcRenderer.send("open:popup");
    }
}
