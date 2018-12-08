function renderDependencies(dependencies: any) {
	let result = "";
	for (const key in dependencies) {
		if (key)
			result += `${key} : ${dependencies[key]}<br>`;
	}
	return result;
}
function mainTemplate(server: any, serverUrl: any, i?: number) {
	if (i == null || i == undefined) {
		i = 0;
	}
	if (server.messages.length == 0)
		server.messages = "none";
	if (server.errors.length == 0)
		server.errors = "none";
	return `<div class="card bg-blue">
				<div class="card-header bg-blue cursor-pointer row" id="heading${i}" aria-expanded="false" data-target="#collapse${i}" onclick="collapseToggle(event)">
					<h4 class="mt-2 clickthrough col-md-6 col-sm-12 text-nowrap">
						${server.name}<br \><small class="text-secondary">${server.repo}</small>
					</h4>
					<div class="col-md-6 col-sm-12 d-flex justify-content-md-end justify-content-sm-around">
						<button class="btn btn-info" data-id="${server.id}" data-url="http://${serverUrl.hostname}:${server.port}" data-action="openBtn" onclick="fromListExecute(event)">
							<i class="material-icons">open_in_new</i>
							<span class="tooltiptext">Open</span>
						</button>
						<button class="btn btn-primary" data-id="${server.id}" data-action="updateBtn" onclick="fromListExecute(event)">
							<i class="material-icons">sync</i><span class="tooltiptext">Update</span></button>
						<button class="btn btn-warning" data-id="${server.id}" data-action="killBtn" onclick="fromListExecute(event)">
							<i class="material-icons">report</i>
							<span class="tooltiptext">Kill</span>
						</button>
						<button class="btn btn-secondary" data-id="${server.id}" data-action="clearBtn" onclick="fromListExecute(event)">
							<i class="material-icons">short_text</i>
							<span class="tooltiptext">Clear</span>
						</button>
					</div>
				</div>
				<div id="collapse${i}" class="collapse" data-parent="#runningContainer">
					<div class="card-body bg-dark d-flex">
						<ul class="list-group list-group-flush bg-dark hide">
							<li class="list-group-item bg-dark">Name:</li>
							<li class="list-group-item bg-dark">Repo:</li>
							<li class="list-group-item bg-dark">Directory:</li>
							<li class="list-group-item bg-dark">ID:</li>
							<li class="list-group-item bg-dark">Deploy date:</li>
							<li class="list-group-item bg-dark">Last updated:</li>
							<li class="list-group-item bg-dark">Last ran:</li>
							<li class="list-group-item bg-dark">Platform:</li>
							<li class="list-group-item bg-dark">Action:</li>
							<li class="list-group-item bg-dark">PORT:</li>
							<li class="list-group-item bg-dark">Address:</li>
							<li class="list-group-item bg-dark">Process ID:</li>
							<li class="list-group-item bg-dark">Dependencies:</li>
							<li class="list-group-item bg-dark">Messages:</li>
							<li class="list-group-item bg-dark">Errors:</li>
						</ul>
						<ul class="list-group list-group-flush bg-dark w-100">
							<li class="list-group-item bg-dark">${server.name}</li>
							<li class="list-group-item bg-dark">${server.repo}</li>
							<li class="list-group-item bg-dark">${server.dir}</li>
							<li class="list-group-item bg-dark">${server.id}</li>
							<li class="list-group-item bg-dark">${server.dateDeployed}</li>
							<li class="list-group-item bg-dark">${server.dateLastUpdated}</li>
							<li class="list-group-item bg-dark">${server.dateLastRun}</li>
							<li class="list-group-item bg-dark">${server.platform}</li>
							<li class="list-group-item bg-dark">${server.action}</li>
							<li class="list-group-item bg-dark">${server.port}</li>
							<li class="list-group-item list-group-item-action text-success bg-dark" onclick="openExternal(event)">http://${serverUrl.hostname}:${server.port}
							</li>
							<li class="list-group-item bg-dark">${server.pid}</li>
							<li class="list-group-item bg-dark">${renderDependencies(server.dependencies)}</li>
							<li class="list-group-item bg-dark">${server.messages}</li>
							<li class="list-group-item bg-dark">${server.errors}</li>
						</ul>
					</div>
				</div>
			</div>`;
}

function deployedTemplate(server: any, i: number) {
	if (i == null || i == undefined) {
		i = 0;
	}
	if (server.messages.length == 0)
		server.messages = "none";
	if (server.errors.length == 0)
		server.errors = "none";
	return `<div class="card bg-blue">
				<div class="card-header row bg-blue cursor-pointer" id="heading${i}" aria-expanded="false"
					data-target="#collapseDeployed${i}" onclick="collapseToggle(event)">
					<h4 class="mt-2 clickthrough col-md-6 col-sm-12 text-nowrap">
						${server.name}<br \> <small class="text-secondary">${server.repo}</small>
					</h4>
					<div class="col-md-6 col-sm-12 d-flex justify-content-md-end justify-content-sm-around">
						<button class="btn btn-primary" data-id="${server.id}" data-action="updateBtn" onclick="fromListExecute(event)">
							<i class="material-icons">sync</i><span class="tooltiptext">Update</span></button>
						<button class="btn btn-success" data-id="${server.id}" data-action="runBtn" onclick="fromListExecute(event)"><i
								class="material-icons">directions_run</i><span class="tooltiptext">Run</span></button>
						<button class="btn btn-danger" data-id="${server.id}" data-action="removeBtn" onclick="fromListExecute(event)"><i
								class="material-icons">delete</i><span class="tooltiptext">Remove</span></button>
						<button class="btn btn-secondary" data-id="${server.id}" data-action="clearBtn" onclick="fromListExecute(event)"><i
								class="material-icons">short_text</i><span class="tooltiptext">Clear</span></button>
					</div>
				</div>
				<div id="collapseDeployed${i}" class="collapse" data-parent="#deployedContainer">
					<div class="card-body bg-dark d-flex">
						<ul class="list-group list-group-flush bg-dark hide">
							<li class="list-group-item bg-dark">Name:</li>
							<li class="list-group-item bg-dark">Repo:</li>
							<li class="list-group-item bg-dark">Directory:</li>
							<li class="list-group-item bg-dark">ID:</li>
							<li class="list-group-item bg-dark">Deploy date:</li>
							<li class="list-group-item bg-dark">Last updated:</li>
							<li class="list-group-item bg-dark">Last ran:</li>
							<li class="list-group-item bg-dark">Platform:</li>
							<li class="list-group-item bg-dark">Action:</li>
							<li class="list-group-item bg-dark">PORT:</li>
							<li class="list-group-item bg-dark">Dependencies:</li>
							<li class="list-group-item bg-dark">Messages:</li>
							<li class="list-group-item bg-dark">Errors:</li>
						</ul>
						<ul class="list-group list-group-flush bg-dark w-100">
							<li class="list-group-item bg-dark">${server.name}</li>
							<li class="list-group-item bg-dark">${server.repo}</li>
							<li class="list-group-item bg-dark">${server.dir}</li>
							<li class="list-group-item bg-dark">${server.id}</li>
							<li class="list-group-item bg-dark">${server.dateDeployed}</li>
							<li class="list-group-item bg-dark">${server.dateLastUpdated}</li>
							<li class="list-group-item bg-dark">${server.dateLastRun}</li>
							<li class="list-group-item bg-dark">${server.platform}</li>
							<li class="list-group-item bg-dark">${server.action}</li>
							<li class="list-group-item bg-dark">${server.port}</li>
							<li class="list-group-item bg-dark">${renderDependencies(server.dependencies)}</li>
							<li class="list-group-item bg-dark">${server.messages}</li>
							<li class="list-group-item bg-dark">${server.errors}</li>
						</ul>
					</div>
				</div>
			</div>`;
}

function shellTemplate(key: string, value: string): string {
	return "<li>" + key + ":" + (value ? value : "") + "</li>";
}
