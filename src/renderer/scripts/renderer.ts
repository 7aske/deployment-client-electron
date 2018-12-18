// import axios from "axios";
// import { deployedTemplate, mainTemplate } from "./templates";
// import helpers from "./helpers";
const serverUrl = getUrl();

interface Action {
	action?: string;
	placeholder?: string;
	name?: string;
}

interface Actions {
	deployBtn: Action;
	updateBtn: Action;
	runBtn: Action;
	killBtn: Action;
	removeBtn: Action;
	findBtn: Action;
	clearBtn: Action;
	browseBtn: Action;

	[key: string]: Action;
}

const actions: Actions = {
	deployBtn: {
		action: "deploy",
		placeholder: "https://github.com/7aske/portfolio",
		name: "deployBtn"
	},
	updateBtn: { action: "update", placeholder: "", name: "updateBtn" },
	runBtn: { action: "run", placeholder: "", name: "runBtn" },
	killBtn: { action: "kill", placeholder: "", name: "killBtn" },
	removeBtn: { action: "remove", placeholder: "", name: "removeBtn" },
	findBtn: {
		action: "find",
		placeholder: "",
		name: "findBtn"
	},
	clearBtn: { action: "clear", placeholder: "", name: "clearBtn" },
	browseBtn: { action: "browse", placeholder: "", name: "browseBtn" }
};
const tabs = {
	running: { name: "running" },
	deployed: { name: "deployed" }
};
let currentTab = tabs.running;
let currentAction = actions.findBtn;
// find running instances on start
document.addEventListener("DOMContentLoaded", () => {
	// noinspection JSIgnoredPromiseFromCall
	execute({
		path: "find",
		data: {
			query: null
		}
	});
	// noinspection JSIgnoredPromiseFromCall
	execute({
		path: "browse",
		data: {
			query: null
		}
	});
});
const refreshBtn = document.querySelector("#refreshBtn");
refreshBtn.addEventListener("click", () => {
	// noinspection JSIgnoredPromiseFromCall
	execute({
		path: "find",
		data: {
			query: null
		}
	});
	// noinspection JSIgnoredPromiseFromCall
	execute({
		path: "browse",
		data: {
			query: null
		}
	});
});

const searchInp = document.querySelector("#searchInp") as HTMLInputElement;
const searchBtn = document.querySelector("#searchBtn") as HTMLInputElement;
searchBtn.addEventListener("click", () => {
	if (searchInp.value != "") {
		if (currentTab.name == "running") {
			execute({
				path: "find",
				data: {
					query: searchInp.value
				}
			});
			// searchInp.value = "";
		}
		if (currentTab.name == "deployed") {
			execute({
				path: "browse",
				data: {
					query: searchInp.value
				}
			});
			// searchInp.value = "";
		}
	}
});
document.addEventListener("keydown", event => {
	if (event.key == "Escape") {
		if (isFooterUp) footerDown();
	}
	if (event.key == "Enter") {
		if (isFooterUp)
			execute({
				path: currentAction.action,
				data: {
					query: currentAction.placeholder
				}
			});
		else if (searchInp.value != "" && searchInp.classList.contains("focused")) {
			if (currentTab.name == "running") {
				execute({
					path: "find",
					data: {
						query: searchInp.value
					}
				});
				searchInp.value = "";
			}
			if (currentTab.name == "deployed") {
				execute({
					path: "browse",
					data: {
						query: searchInp.value
					}
				});
				searchInp.value = "";
			}
		}
	}
});
const main = document.querySelector("main");
main.addEventListener("click", footerDown);
const deployedContainer = document.querySelector("#deployedContainer");
const runningContainer = document.querySelector("#runningContainer");

const serverInp = document.querySelector("#serverInp") as HTMLInputElement;
const portInp = document.querySelector("#portInp") as HTMLInputElement;
serverInp.value = getUrl().hostname;
serverInp.addEventListener("keyup", event => {
	const target = event.target as HTMLInputElement;
	saveUrl({
		hostname: target.value,
		port: portInp.value
	});
});
portInp.value = getUrl().port.toString();
portInp.addEventListener("keyup", event => {
	const target = event.target as HTMLInputElement;
	saveUrl({
		hostname: serverInp.value,
		port: target.value
	});
});
let isFooterUp = false;
// const footer = document.querySelector("footer");
// const footerTrigger = document.querySelector("#footerTrigger") as HTMLElement;
const goInp = document.querySelector("#goInp") as HTMLInputElement;
goInp.addEventListener("keyup", () => {
	actions[currentAction.name].placeholder = goInp.value;
});
const goBtn = document.querySelector("#goBtn");
goBtn.addEventListener("click", () => {
	if (goInp.value != "") {
		if (currentAction.action == "browse") {
			currentTab = tabs.deployed;
			changeTab();
		}
		// noinspection JSIgnoredPromiseFromCall
		execute({
			path: currentAction.action,
			data: {
				query: currentAction.placeholder
			}
		});
	}
});
const loaders = document.querySelectorAll(".loader");

const sidebarButtons = document.querySelectorAll("nav .dropdown .btn");
sidebarButtons.forEach(btn => {
	btn.addEventListener("click", event => {
		const target = event.target as HTMLElement;
		if (target.id == "refreshBtn") return false;
		currentAction = actions[btn.id];

		sidebarButtons.forEach(b => {
			b.classList.remove("active");
		});
		btn.classList.add("active");
		footerUp();
	});
});

// footerTrigger.addEventListener("mouseenter", footerUp);

function footerUp() {
	isFooterUp = true;
	// footerTrigger.style.display = "none";
	// footer.style.transform = "translateY(0)";
	sidebarButtons.forEach(btn => {
		if (btn.id == currentAction.name) btn.classList.add("active");
	});
	goInp.value = currentAction.placeholder;
	goBtn.innerHTML = currentAction.action.toLocaleUpperCase();
	setTimeout(() => {
		goInp.focus();
	}, 100);
}

function footerDown() {
	isFooterUp = false;
	// footerTrigger.style.display = "block";
	// footer.style.transform = "translateY(150px)";
	// footer.style.top = "100vh";
	// sidebarButtons.forEach(btn => {
	// 	btn.classList.remove("active");
	// });
	goInp.blur();
}

// noinspection JSUnusedGlobalSymbols
function handleTabClick(event: Event) {
	const target = event.target as HTMLElement;
	if (target.id == "tab0") currentTab = tabs.running;
	if (target.id == "tab1") currentTab = tabs.deployed;
	changeTab();
}

function changeTab() {
	const tabss = document.querySelectorAll(".tab");
	tabss.forEach(tab => tab.classList.remove("active"));
	if (currentTab.name == "running") {
		tabss[0].classList.add("active");
		runningContainer.classList.remove("hide");
		deployedContainer.classList.add("hide");
	}
	if (currentTab.name == "deployed") {
		tabss[1].classList.add("active");
		deployedContainer.classList.remove("hide");
		runningContainer.classList.add("hide");
	}
}

function collapseToggle(event: Event) {
	const target = event.target as HTMLElement;
	if (!target.classList.contains("card-header")) return false;
	const bar = target;
	const t = document.querySelector(target.attributes.getNamedItem("data-target").value);
	// const next = t.parentElement.nextElementSibling;
	if (bar.attributes.getNamedItem("aria-expanded").value == "true") {
		t.classList.remove("show");
		bar.attributes.getNamedItem("aria-expanded").value = "false";
	} else if (bar.attributes.getNamedItem("aria-expanded").value == "false") {
		t.classList.add("show");
		bar.attributes.getNamedItem("aria-expanded").value = "true";
	}
}

function openExternal(event: Event) {
	const target = event.target as HTMLElement;
	event.preventDefault();
	openUrl(target.innerHTML);
}

function fromListExecute(event: Event) {
	const target = event.target as HTMLElement;
	const dataAction = target.attributes.getNamedItem("data-action").value;
	event.preventDefault();
	setTimeout(() => {
		footerUp();
	}, 100);
	if (dataAction == "openBtn") {
		const url = target.attributes.getNamedItem("data-url").value;
		openUrl(url);
	} else {
		const id = target.attributes.getNamedItem("data-id").value;
		const action = actions[dataAction].action;
		// noinspection JSIgnoredPromiseFromCall
		execute({
			path: action,
			data: {
				query: id
			}
		});
	}
}

async function execute(payload: any) {
	const url = formatUrl(getUrl().hostname, getUrl().port);
	loaders.forEach(loader => {
		loader.classList.remove("hide");
	});
	let data: Response;
	let servers: any;

	try {
		data = await fetch(`${url}/${payload.path}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
				// "Content-Type": "application/x-www-form-urlencoded",
			},
			body: JSON.stringify(payload.data)
		});
		if (data.status == 401) throw new Error("Unauthorized");
		servers = await data.json();
		loaders.forEach(loader => {
			loader.classList.add("hide");
		});
		if (payload.path != "find" && payload.path != "browse") {
			// noinspection JSIgnoredPromiseFromCall
			execute({
				path: "find",
				data: {
					query: null
				}
			});
			// noinspection JSIgnoredPromiseFromCall
			execute({
				path: "browse",
				data: {
					query: null
				}
			});
		} else {
			const sorted = servers.sort((a: any, b: any) => {
				return a.port > b.port;
			});
			render(sorted, payload.path);
		}
	} catch (e) {
		if (e.message == "Unauthorized") {
			promptAuth();
		}
		loaders.forEach(loader => {
			loader.classList.add("hide");
		});
		deployedContainer.innerHTML =
			'<br>&nbsp;	Server not running on selected host<br><i style="font-size:72px; padding-top:32px" class="material-icons">sentiment_very_dissatisfied</i>';
		runningContainer.innerHTML =
			'<br>&nbsp;	Server not running on selected host<br><i style="font-size:72px; padding-top:32px" class="material-icons">sentiment_very_dissatisfied</i>';
	}
}

function render(data: any, template: string) {
	if (template == "browse") {
		deployedContainer.innerHTML = "";
		if (data.length == 0) {
			deployedContainer.innerHTML = "No servers found";
		}
		if (data instanceof Array)
			data.forEach((server, i) => {
				deployedContainer.innerHTML += deployedTemplate(server, i);
			});
		else {
			deployedContainer.innerHTML += deployedTemplate(data, 0);
		}
	} else if (template == "find") {
		runningContainer.innerHTML = "";
		if (data.length == 0) {
			runningContainer.innerHTML = "No servers found";
		}
		if (data instanceof Array)
			data.forEach((server, i) => {
				runningContainer.innerHTML += mainTemplate(server, serverUrl, i);
			});
		else {
			runningContainer.innerHTML += mainTemplate(data, serverUrl, 0);
		}
	}
}
