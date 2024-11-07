
import core from "../browser/core.js";
// @ts-expect-error - TypeScript claims xterm has no default export, but this is how the documentation says to use it.
import Terminal from "@xterm/xterm";

// cspell: words buildx, containerd, nmap, winget

const dashboard = function dashboard():void {

    const log = function dashboard_log(item:services_dashboard_status):void {
            let li:HTMLElement = document.createElement("li"),
                timeElement:HTMLElement = document.createElement("time");
            const ul:HTMLElement = document.getElementById("logs").getElementsByTagName("ul")[0],
                strong:HTMLElement = document.createElement("strong"),
                code:HTMLElement = document.createElement("code"),
                time:string = (function dashboard_log_time():string {
                    const output:string[] = [],
                        day:string = ul.getAttribute("data-day"),
                        date:Date = new Date(item.time),
                        hours:string = date.getHours().toString(),
                        minutes:string = date.getMinutes().toString(),
                        seconds:string = date.getSeconds().toString(),
                        milliseconds:string = date.getMilliseconds().toString(),
                        mil:string = (milliseconds.length === 1)
                            ? `00${milliseconds}`
                            : (milliseconds.length === 2)
                                ? `0${milliseconds}`
                                : milliseconds;
                    output.push((hours.length < 2)
                        ? `0${hours}`
                        : hours);
                    output.push((minutes.length < 2)
                        ? `0${minutes}`
                        : minutes);
                    output.push((seconds.length < 2)
                        ? `0${seconds}`
                        : seconds);
                    if (day === null || date.getDate().toString() !== day) {
                        timeElement.appendText(`[${date.toDateString()}]`);
                        li.appendChild(timeElement);
                        ul.appendChild(li);
                        li = document.createElement("li");
                        timeElement = document.createElement("time");
                        ul.setAttribute("data-day", date.getDate().toString());
                    }
                    return `[${output.join(":")}.${mil}]`;
                }());
            timeElement.appendText(time);
            li.appendChild(timeElement);
            li.setAttribute("class", `log-${item.status}`);
            if (item.status === "error") {
                strong.appendText(item.message);
                code.appendText(JSON.stringify(item.configuration));
                li.appendChild(strong);
                li.appendChild(code);
            } else {
                li.appendText(item.message);
            }
            ul.appendChild(li);
        },
        compose:module_compose = {
            // Download and install Docker to Windows with 'winget install --id=Docker.DockerCLI -e' and to Debian Linux with 'sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin'.
            cancel: function dashboard_composeCancel(event:MouseEvent):void {
                const target:HTMLElement = event.target.getAncestor("div", "tag"),
                    edit:HTMLElement = target.getElementsByClassName("compose-edit")[0] as HTMLElement,
                    buttons:HTMLElement = target.getElementsByClassName("buttons")[1] as HTMLElement,
                    ul:HTMLElement = target.getElementsByTagName("ul")[0];
                edit.parentNode.removeChild(edit);
                buttons.parentNode.removeChild(buttons);
                ul.style.display = "block";
                compose.nodes.variables_new.disabled = false;
            },
            editVariables: function dashboard_composeEditVariables():void {
                const p:HTMLElement = document.createElement("p"),
                    buttons:HTMLElement = document.createElement("p"),
                    label:HTMLElement = document.createElement("label"),
                    textArea:HTMLTextAreaElement = document.createElement("textarea"),
                    keys:string[] = Object.keys(payload.compose.variables).sort(),
                    output:string[] = [],
                    len:number = keys.length,
                    cancel:HTMLElement = document.createElement("button"),
                    save:HTMLElement = document.createElement("button");
                let index:number = 0;
                do {
                    output.push(`"${keys[index]}": "${payload.compose.variables[keys[index]]}"`);
                    index = index + 1;
                } while (index < len);
                cancel.appendText("⚠ Cancel");
                cancel.setAttribute("class", "server-cancel");
                cancel.onclick = compose.cancel;
                buttons.appendChild(cancel);
                save.appendText("🖪 Modify");
                save.setAttribute("class", "server-modify");
                save.onclick = compose.message;
                buttons.appendChild(save);
                textArea.value = `{\n    ${output.join(",\n    ")}\n}`;
                textArea.setAttribute("class", "compose-variables-edit");
                compose.nodes.variables_list.style.display = "none";
                label.appendText("Docker Compose Variables");
                label.appendChild(textArea);
                p.setAttribute("class", "compose-edit");
                p.appendChild(label);
                buttons.setAttribute("class", "buttons");
                compose.nodes.variables_list.parentNode.appendChild(p);
                compose.nodes.variables_list.parentNode.appendChild(buttons);
                compose.nodes.variables_new.disabled = true;
            },
            list: function dashboard_composeList():void {
                const populate = function dashboard_composeList_populate(type:"containers"|"variables"):void {
                    const list:string[] = Object.keys(payload.compose[type]).sort(),
                        parent:HTMLElement = compose.nodes[`${type}_list`],
                        len:number = list.length;
                    let li:HTMLElement = null,
                        strong:HTMLElement = null,
                        span:HTMLElement = null,
                        index:number = 0;
                    if (len > 0) {
                        do {
                            li = document.createElement("li");
                            if (type === "variables") {
                                strong = document.createElement("strong");
                                span = document.createElement("span");
                                strong.appendText(list[index]);
                                span.appendText(payload.compose[type][list[index]]);
                                li.appendChild(strong);
                                li.appendChild(span);
                                parent.appendChild(li);
                            }
                            index = index + 1;
                        } while (index < len);
                    } else {
                        parent.style.display = "none";
                    }
                };
                populate("containers");
                populate("variables");
                compose.nodes.variables_new.onclick = compose.editVariables;
            },
            message: function dashboard_composeMessage(event:MouseEvent):void {},
            nodes: {
                containers_list: document.getElementById("compose").getElementsByClassName("compose-container-list")[0] as HTMLElement,
                containers_new: document.getElementById("compose").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
                variables_list: document.getElementById("compose").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
                variables_new: document.getElementById("compose").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement
            }
        },
        message:module_message = {
            ports_active: function dashboard_messagePortsActive(name_server:string):HTMLElement {
                const div:HTMLElement = document.createElement("div"),
                    h5:HTMLElement = document.createElement("h5"),
                    portList:HTMLElement = document.createElement("ul"),
                    encryption:type_encryption = payload.servers[name_server].config.encryption,
                    ports:server_ports = payload.servers[name_server].status;
                let portItem:HTMLElement = document.createElement("li");
                h5.appendText("Active Ports");
                div.appendChild(h5);
                div.setAttribute("class", "active-ports");
                if (encryption === "both") {
                    if (ports.open === 0) {
                        portItem.appendText("Open - offline");
                    } else {
                        portItem.appendText(`Open - ${ports.open}`);
                    }
                    portList.appendChild(portItem);
                    portItem = document.createElement("li");
                    if (ports.secure === 0) {
                        portItem.appendText("Secure - offline");
                    } else {
                        portItem.appendText(`Secure - ${ports.secure}`);
                    }
                    portList.appendChild(portItem);
                } else if (encryption === "open") {
                    if (ports.open === 0) {
                        portItem.appendText("Open - offline");
                    } else {
                        portItem.appendText(`Open - ${ports.open}`);
                    }
                    portList.appendChild(portItem);
                } else {
                    if (ports.secure === 0) {
                        portItem.appendText("Secure - offline");
                    } else {
                        portItem.appendText(`Secure - ${ports.secure}`);
                    }
                    portList.appendChild(portItem);
                }
                div.appendChild(portList);
                return div;
            },
            receiver: function dashboard_messageReceiver(event:websocket_event):void {
                if (typeof event.data === "string") {
                    const data:services_dashboard_status = JSON.parse(event.data).data;
                    if (data.type !== "socket") {
                        log(data);
                    }
                    if (data.status !== "error") {
                        if (data.type === "server") {
                            const config:configuration_server = data.configuration as configuration_server,
                                list:HTMLCollectionOf<HTMLElement> = document.getElementById("servers").getElementsByTagName("li");
                            let index:number = list.length;
                            if (data.action === "destroy") {
                                delete payload.servers[config.name];
                                do {
                                    index = index - 1;
                                    if (list[index].getAttribute("data-name") === config.name) {
                                        list[index].parentNode.removeChild(list[index]);
                                        return;
                                    }
                                } while (index > 0);
                            } else if (data.action === "add") {
                                payload.servers[config.name] = {
                                    config: config,
                                    sockets: [],
                                    status: {
                                        open: 0,
                                        secure: 0
                                    }
                                };
                                const names:string[] = Object.keys(payload.servers),
                                    ul:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0].getElementsByTagName("ul")[0];
                                payload.servers[config.name].status = {
                                    open: 0,
                                    secure: 0
                                };
                                names.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                                    if (a < b) {
                                        return -1;
                                    }
                                    return 1;
                                });
                                index = names.length;
                                if (names[names.length - 1] === config.name) {
                                    ul.appendChild(server.title(config.name));
                                } else if (names[0] === config.name) {
                                    ul.insertBefore(server.title(config.name), ul.firstChild);
                                } else {
                                    do {
                                        index = index - 1;
                                        if (names[index] === config.name) {
                                            ul.insertBefore(server.title(config.name), ul.childNodes[index - 1]);
                                            break;
                                        }
                                    } while (index > 0);
                                }
                            } else if (data.action === "activate") {
                                payload.servers[config.name].status = config.ports;
                                const color:type_activation_status = message.server_color(config.name);
                                let oldPorts:HTMLElement = null,
                                    activate:HTMLButtonElement = null,
                                    deactivate:HTMLButtonElement = null;
                                do {
                                    index = index - 1;
                                    if (list[index].getAttribute("data-name") === config.name) {
                                        if (color[0] !== null) {
                                            list[index].setAttribute("class", color[0]);
                                        }
                                        list[index].getElementsByTagName("h4")[0].getElementsByTagName("button")[0].lastChild.textContent = `${config.name} - ${color[1]}`;
                                        oldPorts = list[index].getElementsByClassName("active-ports")[0] as HTMLElement;
                                        activate = list[index].getElementsByClassName("server-activate")[0] as HTMLButtonElement;
                                        deactivate = list[index].getElementsByClassName("server-deactivate")[0] as HTMLButtonElement;
                                        if (oldPorts !== undefined) {
                                            oldPorts.parentNode.insertBefore(message.ports_active(config.name), oldPorts);
                                            oldPorts.parentNode.removeChild(oldPorts);
                                        }
                                        if (activate !== undefined) {
                                            if (color[0] === "green") {
                                                activate.disabled = true;
                                            } else {
                                                activate.disabled = false;
                                            }
                                        }
                                        if (deactivate !== undefined) {
                                            if (color[0] === "red") {
                                                deactivate.disabled = true;
                                            } else {
                                                deactivate.disabled = false;
                                            }
                                        }
                                        break;
                                    }
                                } while (index > 0);
                                if (config.name.indexOf("dashboard-terminal-") === 0) {
                                    const encryption:"open"|"secure" = payload.servers[config.name].config.encryption as "open"|"secure",
                                        scheme:"ws"|"wss" = (encryption === "open")
                                            ? "ws"
                                            : "wss";
                                    terminal.socket = new WebSocket(`${scheme}://${location.host.split(":")[0]}:${config.ports[encryption]}`, ["terminal"]);
                                    terminal.socket.onmessage = terminal.events.data;
                                }
                            } else if (data.action === "deactivate") {
                                payload.servers[config.name].status = {
                                    open: 0,
                                    secure: 0
                                };
                                let oldPorts:HTMLElement = null,
                                    activate:HTMLButtonElement = null,
                                    deactivate:HTMLButtonElement = null;
                                do {
                                    index = index - 1;
                                    if (list[index].getAttribute("data-name") === config.name) {
                                        list[index].setAttribute("class", "red");
                                        list[index].getElementsByTagName("h4")[0].getElementsByTagName("button")[0].lastChild.textContent = `${config.name} - offline`;
                                        oldPorts = list[index].getElementsByClassName("active-ports")[0] as HTMLElement;
                                        activate = list[index].getElementsByClassName("server-activate")[0] as HTMLButtonElement;
                                        deactivate = list[index].getElementsByClassName("server-deactivate")[0] as HTMLButtonElement;
                                        if (oldPorts !== undefined) {
                                            oldPorts.parentNode.insertBefore(message.ports_active(config.name), oldPorts);
                                            oldPorts.parentNode.removeChild(oldPorts);
                                        }
                                        if (activate !== undefined) {
                                            activate.disabled = false;
                                        }
                                        if (deactivate !== undefined) {
                                            deactivate.disabled = true;
                                        }
                                        break;
                                    }
                                } while (index > 0);
                            }
                        } else if (data.type === "socket") {
                            const config:socket_summary = data.configuration as socket_summary;
                            if (data.action === "add") {
                                message.socket_destroy("dashboard");
                                message.socket_add(config);
                            } else if (data.action === "destroy") {
                                message.socket_destroy(config.hash);
                            }
                            ports.internal();
                        } else if (data.type === "port") {
                            ports.external(data.configuration as type_external_port[]);
                        }
                    }
                }
            },
            server_color: function dashboard_messageServerColor(name_server:string):type_activation_status {
                if (name_server === null) {
                    return [null, "new"];
                }
                if (payload.servers[name_server].config.activate === false) {
                    return [null, "deactivated"];
                }
                const encryption:type_encryption = payload.servers[name_server].config.encryption,
                    ports:server_ports = payload.servers[name_server].status;
                if (encryption === "both") {
                    if (ports.open === 0 && ports.secure === 0) {
                        return ["red", "offline"];
                    }
                    if (ports.open > 0 && ports.secure > 0) {
                        return ["green", "online"];
                    }
                    return ["amber", "partially online"];
                }
                if (encryption === "open") {
                    if (ports.open === 0) {
                        return ["red", "offline"];
                    }
                    return ["green", "online"];
                }
                if (encryption === "secure") {
                    if (ports.secure === 0) {
                        return ["red", "offline"];
                    }
                    return ["green", "online"];
                }
            },
            socket_add: function dashboard_messageSocketAdd(config:socket_summary):void {
                const tbody:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                    tr:HTMLElement = document.createElement("tr");
                let td:HTMLElement = document.createElement("Td");
                tr.setAttribute("data-name", config.hash);
                // server
                td.appendText(config.server);
                tr.appendChild(td);
                // id
                td = document.createElement("td");
                td.appendText(config.hash);
                tr.appendChild(td);
                // type
                td = document.createElement("td");
                td.appendText(config.type);
                tr.appendChild(td);
                // role
                td = document.createElement("td");
                td.appendText(config.role);
                tr.appendChild(td);
                // proxy
                td = document.createElement("td");
                td.appendText(config.proxy);
                tr.appendChild(td);
                // local ip
                td = document.createElement("td");
                td.appendText(config.address.local.address);
                tr.appendChild(td);
                // local port
                td = document.createElement("td");
                td.appendText(config.address.local.port.toString());
                tr.appendChild(td);
                // remote ip
                td = document.createElement("td");
                td.appendText(config.address.remote.address);
                tr.appendChild(td);
                // remote port
                td = document.createElement("td");
                td.appendText(config.address.remote.port.toString());
                tr.appendChild(td);
                tbody.appendChild(tr);
            },
            socket_destroy: function dashboard_messageSocketDestroy(hash:string):void {
                const tbody:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                    tr:HTMLCollectionOf<HTMLElement> = tbody.getElementsByTagName("tr");
                let index:number = tr.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (tr[index].getAttribute("data-name") === hash || (hash === "dashboard" && tr[index].getElementsByTagName("td")[2].textContent === "dashboard")) {
                            tbody.removeChild(tr[index]);
                            return;
                        }
                    } while (index > 0);
                }
            }
        },
        ports:module_port = {
            external: function dashboard_portsExternal(input:type_external_port[]):void {
                // must test
                // 1. bad command, display language not table
                // 2. on update then update table if not there
                const servers:string[] = Object.keys(payload.servers),
                    loop_ports = function dashboard_portsExternal(number:number):void {
                        let indexPorts:number = input.length;
                        if (indexPorts > 0) {
                            do {
                                indexPorts = indexPorts - 1;
                                if (number === input[indexPorts][0]) {
                                    input.splice(indexPorts, 1);
                                }
                            } while (indexPorts > 0);
                        }
                    },
                    portElement:HTMLElement = document.getElementById("ports"),
                    tbody_old:HTMLElement = portElement.getElementsByTagName("tbody")[0],
                    tbody_new:HTMLElement = document.createElement("tbody");
                let indexServers:number = servers.length,
                    indexPorts:number = input.length,
                    indexKeys:number = 0,
                    keys:string[] = null,
                    tr:HTMLElement = null,
                    td:HTMLElement = null;
                if (indexPorts < 1) {
                    return;
                }
                if (input[0] === null) {
                    const ul:HTMLElement = document.createElement("ul"),
                        p:HTMLElement = portElement.getElementsByTagName("p")[0];
                    let li:HTMLElement = document.createElement("li"),
                        code:HTMLElement = document.createElement("code");
                    p.textContent = `${input[1][1]} Download and install NMap with these commands:`;
                    li.appendText("Windows ");
                    code.appendText("winget install -e --id Insecure.Nmap");
                    li.appendChild(code);
                    ul.appendChild(li);
                    li = document.createElement("li");
                    code = document.createElement("code");
                    li.appendText("Debian Linux ");
                    code.appendText("sudo apt-get install nmap");
                    li.appendChild(code);
                    ul.appendChild(li);
                    p.parentNode.insertBefore(ul, p.nextSibling);
                    tbody_old.parentNode.style.display = "none";
                    return;
                }
                if (indexServers > 0) {
                    // per server
                    do {
                        indexPorts = input.length;
                        if (indexPorts < 1) {
                            break;
                        }
                        indexServers = indexServers - 1;
                        // per port, per server
                        loop_ports(payload.servers[servers[indexServers]].status.open);
                        loop_ports(payload.servers[servers[indexServers]].status.secure);
                        keys = (payload.servers[servers[indexServers]].config.redirect_domain === null || payload.servers[servers[indexServers]].config.redirect_domain === undefined)
                            ? null
                            : Object.keys(payload.servers[servers[indexServers]].config.redirect_domain);
                        indexKeys = (keys === null)
                            ? 0
                            : keys.length;
                        if (indexKeys > 0) {
                            do {
                                indexKeys = indexKeys - 1;
                                if (payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]] !== null && typeof payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][0] === "string" && payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][0] !== "") {
                                    loop_ports(payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][1]);
                                }
                            } while (indexKeys > 0);
                        }
                    } while (indexServers > 0);
                }
                indexPorts = 0;
                indexKeys = input.length;
                if (indexKeys > 0) {
                    do {
                        tr = document.createElement("tr");
                        td = document.createElement("td");
                        td.appendText(input[indexPorts][0].toString());
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(input[indexPorts][1]);
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(input[indexPorts][2]);
                        tr.appendChild(td);
                        tbody_new.appendChild(tr);
                        indexPorts = indexPorts + 1;
                    } while (indexPorts < indexKeys);
                    tbody_old.parentNode.appendChild(tbody_new);
                    tbody_old.parentNode.removeChild(tbody_old);
                }
            },
            internal: function dashboard_portsInternal():void {
                const output:[number, string, string, string, string][] = [],
                    tbody_old:HTMLElement = document.getElementById("ports").getElementsByTagName("tbody")[1],
                    tbody_new:HTMLElement = document.createElement("tbody"),
                    servers:string[] = Object.keys(payload.servers);
                let indexServers:number = servers.length,
                    tr:HTMLElement = null,
                    td:HTMLElement = null;
                ports.external(payload.ports);
                ports.nodes.port_refresh.onclick = ports.refresh;
                do {
                    indexServers = indexServers - 1;
                    if (typeof payload.servers[servers[indexServers]].status.open === "number" && payload.servers[servers[indexServers]].status.open > 0) {
                        output.push([payload.servers[servers[indexServers]].status.open, "tcp", "server", servers[indexServers], "Open server port"]);
                    }
                    if (typeof payload.servers[servers[indexServers]].status.secure === "number" && payload.servers[servers[indexServers]].status.secure > 0) {
                        output.push([payload.servers[servers[indexServers]].status.secure, "tcp", "server", servers[indexServers], "Secure server port"]);
                    }
                } while (indexServers > 0);
                output.sort(function dashboard_portsInternal_sort(a:[number, string, string, string, string], b:[number, string, string, string, string]):-1|1 {
                    if (a[0] < b[0]) {
                        return 1;
                    }
                    return -1;
                });
                indexServers = output.length;
                if (indexServers > 0) {
                    do {
                        indexServers = indexServers - 1;
                        tr = document.createElement("tr");
                        td = document.createElement("td");
                        td.appendText(output[indexServers][0].toString());
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(output[indexServers][1]);
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(output[indexServers][2]);
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(output[indexServers][3]);
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(output[indexServers][4]);
                        tr.appendChild(td);
                        tbody_new.appendChild(tr);
                    } while (indexServers > 0);
                    tbody_old.parentNode.appendChild(tbody_new);
                    tbody_old.parentNode.removeChild(tbody_old);
                }
            },
            nodes: {
                port_refresh: document.getElementById("ports").getElementsByTagName("button")[0]
            },
            refresh: function dashboard_portsRefresh():void {
                const payload:services_dashboard_action = {
                        action: "ports-refresh",
                        configuration: null
                    },
                    socket_data:socket_data = {
                        data: payload,
                        service: "dashboard-action"
                    };
                socket.queue(JSON.stringify(socket_data));
            }
        },
        server:module_server = {
            cancel: function dashboard_serverCancel(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    li:HTMLElement = target.getAncestor("li", "tag"),
                    servers:HTMLElement = li.getAncestor("servers", "id"),
                    create:HTMLButtonElement = servers.getElementsByClassName("server-new")[0] as HTMLButtonElement;
                li.parentNode.removeChild(li);
                create.disabled = false;
            },
            create: function dashboard_serverCreate(event:MouseEvent):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                server.details(event);
            },
            definitions: function dashboard_serverDefinitions(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    div:HTMLElement = target.getAncestor("div", "tag"),
                    dl:HTMLElement = div.parentNode.getElementsByTagName("dl")[0];
                if (target.textContent === "Expand") {
                    dl.style.display = "block";
                    target.textContent = "Hide";
                } else {
                    dl.style.display = "none";
                    target.textContent = "Expand";
                }
            },
            details: function dashboard_serverDetails(event:MouseEvent):void {
                let newFlag:boolean = false;
                const target:HTMLElement = (function dashboard_serverDetails_target():HTMLElement {
                        const el:HTMLElement = event.target;
                        if (el.getAttribute("class") === "server-new") {
                            const li:HTMLElement = server.title(null),
                                ul:HTMLElement = el.getAncestor("servers", "id").getElementsByClassName("server-list")[0].getElementsByTagName("ul")[0];
                            ul.insertBefore(li, ul.firstChild);
                            newFlag = true;
                            return li.getElementsByTagName("button")[0];
                        }
                        return el;
                    }()),
                    serverItem:HTMLElement = target.getAncestor("li", "tag"),
                    titleButton:HTMLElement = serverItem.getElementsByTagName("button")[0],
                    expandButton:HTMLElement = (newFlag === true)
                        ? null
                        : titleButton.getElementsByClassName("expand")[0] as HTMLElement,
                    expandText:string = (newFlag === true)
                        ? ""
                        : expandButton.textContent;
                if (newFlag === true || expandText === "Expand") {
                    const name_server:string = serverItem.getAttribute("data-name"),
                        details:HTMLElement = document.createElement("div"),
                        label:HTMLElement = document.createElement("label"),
                        textArea:HTMLTextAreaElement = document.createElement("textarea"),
                        span:HTMLElement = document.createElement("span"),
                        value:string = (function dashboard_serverDetails_value():string {
                            const array = function dashboard_serverDetails_value_array(indent:boolean, name:string, property:string[]):void {
                                    const ind:string = (indent === true)
                                        ? "    "
                                        : "";
                                    if (property === null || property === undefined || property.length < 1) {
                                        output.push(`${ind}"${name}": [],`);
                                    } else {
                                        output.push(`${ind}"${name}": [`);
                                        property.forEach(function dashboard_serverDetails_value_array_each(value:string):void {
                                            output.push(`${ind}    "${sanitize(value)}",`);
                                        });
                                        output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                        output.push(`${ind}],`);
                                    }
                                },
                                object = function dashboard_serverDetails_value_object(property:"redirect_domain"|"redirect_internal"):void {
                                    const list:string[] = Object.keys(serverData[property]),
                                        total:number = list.length,
                                        objValue = function dashboard_serverDetails_value_object(input:string):void {
                                            if (serverData.redirect_internal[input] === null || serverData.redirect_internal[input] === undefined) {
                                                output.push(`    "${sanitize(input)}": {},`);
                                            } else {
                                                const childList:string[] = Object.keys(serverData.redirect_internal[input]),
                                                    childTotal:number = childList.length;
                                                let childIndex:number = 0;
                                                if (childTotal < 1) {
                                                    output.push(`    "${sanitize(input)}": {},`);
                                                } else {
                                                    output.push(`    "${sanitize(input)}": {`);
                                                    do {
                                                        output.push(`        "${sanitize(childList[childIndex])}": "${sanitize(serverData.redirect_internal[input][childList[childIndex]])}",`);
                                                        childIndex = childIndex + 1;
                                                    } while (childIndex < childTotal);
                                                    output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                                    output.push("    },");
                                                }
                                            }
                                        };
                                    let index:number = 0;
                                    if (total < 1) {
                                        output.push(`"${property}": {},`);
                                        return;
                                    }
                                    output.push(`"${property}": {`);
                                    do {
                                        if (property === "redirect_domain") {
                                            output.push(`    "${sanitize(list[index])}": ${`["${sanitize(serverData.redirect_domain[list[index]][0])}", ${serverData.redirect_domain[list[index]][1]}]`},`);
                                        } else {
                                            objValue(list[index]);
                                        }
                                        index = index + 1;
                                    } while (index < total);
                                    output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                    output.push("},");
                                },
                                sanitize = function dashboard_serverDetails_value_sanitize(input:string):string {
                                    return input.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                                },
                                serverData:configuration_server = (newFlag === true)
                                    ? {
                                        activate: true,
                                        domain_local: [],
                                        encryption: "both",
                                        name: "new_server",
                                        ports: {
                                            open: 0,
                                            secure: 0
                                        }
                                    }
                                    : payload.servers[name_server].config,
                                output:string[] = [
                                        "{",
                                        `"activate": ${serverData.activate},`
                                    ];
                            if (serverData.block_list !== null && serverData.block_list !== undefined) {
                                output.push("\"block_list\": {");
                                array(true, "host", serverData.block_list.host);
                                array(true, "ip", serverData.block_list.ip);
                                array(true, "referrer", serverData.block_list.referrer);
                                output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                output.push("},");
                            }
                            array(false, "domain_local", serverData.domain_local);
                            if (serverData.encryption === "both" || serverData.encryption === "open" || serverData.encryption === "secure") {
                                output.push(`"encryption": "${serverData.encryption}",`);
                            } else {
                                output.push("\"encryption\": \"both\",");
                            }
                            if (serverData.http !== null && serverData.http !== undefined) {
                                output.push("\"http\": {");
                                output.push(`    "delete": "${sanitize(serverData.http.delete)}",`);
                                output.push(`    "post": "${sanitize(serverData.http.post)}",`);
                                output.push(`    "put": "${sanitize(serverData.http.put)}"`);
                                output.push("},");
                            }
                            if (newFlag === true) {
                                output.push("\"name\": \"new_server\",");
                            } else {
                                output.push(`"name": "${sanitize(name_server)}",`);
                            }
                            output.push("\"ports\": {");
                            if (serverData.encryption === "both") {
                                output.push(`    "open": ${serverData.ports.open},`);
                                output.push(`    "secure": ${serverData.ports.secure}`);
                            } else if (serverData.encryption === "open") {
                                output.push(`    "open": ${serverData.ports.open}`);
                            } else {
                                output.push(`    "secure": ${serverData.ports.secure}`);
                            }
                            output.push("},");
                            if (serverData.redirect_domain !== undefined && serverData.redirect_domain !== null) {
                                object("redirect_domain");
                            }
                            if (serverData.redirect_internal !== undefined && serverData.redirect_internal !== null) {
                                object("redirect_internal");
                            }
                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                            return `${output.join("\n    ")}\n}`;
                        }()),
                        summary:HTMLElement = document.createElement("div"),
                        summaryTitle:HTMLElement = document.createElement("h5"),
                        summaryUl:HTMLElement = document.createElement("ul"),
                        p:HTMLElement = document.createElement("p"),
                        editButton:HTMLElement = document.createElement("button"),
                        clear:HTMLElement = document.createElement("span");
                    summaryTitle.appendText("Edit Summary");
                    summary.appendChild(summaryTitle);
                    summary.appendChild(summaryUl);
                    summary.setAttribute("class", "summary");
                    textArea.value = value;
                    textArea.spellcheck = false;
                    textArea.readOnly = true;
                    details.setAttribute("class", "edit");
                    span.setAttribute("class", "text");
                    span.appendText("Server Configuration");
                    label.appendChild(span);
                    label.appendChild(textArea);
                    details.appendChild(label);
                    details.appendChild(summary);
                    if (newFlag === false) {
                        expandButton.textContent = "Hide";
                        editButton.appendText("✎ Edit");
                        editButton.setAttribute("class", "server-edit");
                        editButton.onclick = server.edit;
                        p.appendChild(editButton);
                        details.appendChild(message.ports_active(name_server));
                    }
                    clear.setAttribute("class", "clear");
                    p.appendChild(clear);
                    p.setAttribute("class", "buttons");
                    details.appendChild(p);
                    serverItem.appendChild(details);
                    if (newFlag === true) {
                        server.edit(event);
                    }
                } else {
                    do {
                        serverItem.removeChild(serverItem.lastChild);
                    } while (serverItem.childNodes.length > 1);
                    expandButton.textContent = "Expand";
                }
            },
            edit: function dashboard_serverEdit(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    listItem:HTMLElement = target.getAncestor("li", "tag"),
                    dashboard:boolean = (listItem.getAttribute("data-name") === "dashboard"),
                    p:HTMLElement = listItem.getElementsByClassName("edit")[0].lastChild as HTMLElement,
                    textArea:HTMLTextAreaElement = listItem.getElementsByTagName("textarea")[0],
                    activate:HTMLButtonElement = document.createElement("button"),
                    deactivate:HTMLButtonElement = document.createElement("button"),
                    destroy:HTMLButtonElement = document.createElement("button"),
                    save:HTMLButtonElement = document.createElement("button"),
                    createServer:boolean = (target.getAttribute("class") === "server-new"),
                    clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                    note:HTMLElement = document.createElement("p");
                save.disabled = true;
                if (createServer === false && dashboard === false) {
                    const span:HTMLElement = document.createElement("span"),
                        buttons:HTMLElement = document.createElement("p");
                    destroy.appendText("✘ Destroy");
                    destroy.setAttribute("class", "server-destroy");
                    destroy.onclick = server.message;
                    activate.appendText("⌁ Activate");
                    activate.setAttribute("class", "server-activate");
                    if (listItem.getAttribute("class") === "green") {
                        activate.disabled = true;
                    }
                    activate.onclick = server.message;
                    deactivate.appendText("። Deactivate");
                    deactivate.setAttribute("class", "server-deactivate");
                    deactivate.onclick = server.message;
                    if (listItem.getAttribute("class") === "red") {
                        deactivate.disabled = true;
                    }
                    buttons.appendChild(deactivate);
                    buttons.appendChild(activate);
                    span.setAttribute("class", "clear");
                    buttons.appendChild(span);
                    p.parentNode.insertBefore(buttons, p);
                    p.appendChild(destroy);
                }
                if (createServer === true) {
                    destroy.appendText("⚠ Cancel");
                    destroy.setAttribute("class", "server-cancel");
                    destroy.onclick = server.cancel;
                    p.appendChild(destroy);
                    save.appendText("✔ Create");
                    save.setAttribute("class", "server-add");
                } else {
                    p.removeChild(p.getElementsByClassName("server-edit")[0]);
                    save.appendText("🖪 Modify");
                    save.setAttribute("class", "server-modify");
                }
                save.onclick = server.message;
                p.appendChild(save);
                p.removeChild(clear);
                p.appendChild(clear);
                p.setAttribute("class", "buttons");
                if (createServer === true) {
                    note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                } else if (dashboard === false) {
                    note.textContent = "Deleting a server will delete all associated file system artifacts. Back up your data first.";
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                }
                textArea.readOnly = false;
                textArea.onkeyup = server.validate;
                textArea.onfocus = server.validate;
                textArea.focus();
            },
            list: function dashboard_serverList():void {
                const tag:HTMLElement = document.getElementById("servers"),
                    list:string[] = Object.keys(payload.servers),
                    list_old:HTMLElement = tag.getElementsByTagName("ul")[0],
                    ul:HTMLElement = document.createElement("ul"),
                    h3:HTMLElement = document.createElement("h3"),
                    div:HTMLElement = document.createElement("div"),
                    total:number = list.length;
                let index:number = 0,
                    indexSocket:number = 0,
                    totalSocket:number = 0;
                server.nodes.server_new.onclick = server.create;
                server.nodes.server_definitions.onclick = server.definitions;
                if (list_old !== undefined) {
                    tag.removeChild(list_old);
                }
                list.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                    if (a < b) {
                        return -1;
                    }
                    return 1;
                });
                do {
                    ul.appendChild(server.title(list[index]));
                    totalSocket = payload.servers[list[index]].sockets.length;
                    if (totalSocket > 0) {
                        indexSocket = 0;
                        do {
                            message.socket_add(payload.servers[list[index]].sockets[indexSocket]);
                            indexSocket = indexSocket + 1;
                        } while (indexSocket < totalSocket);
                    }
                    index = index + 1;
                } while (index < total);
                h3.appendText("Server List");
                div.setAttribute("class", "server-list");
                div.appendChild(h3);
                div.appendChild(ul);
                tag.appendChild(div);
            },
            message: function dashboard_serverMessage(event:MouseEvent): void {
                const target:HTMLElement = event.target,
                    li:HTMLElement = target.getAncestor("li", "tag"),
                    textArea:HTMLTextAreaElement = li.getElementsByTagName("textarea")[0],
                    action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                    cancel:HTMLElement = li.getElementsByClassName("server-cancel")[0] as HTMLElement,
                    configuration:configuration_server = (function dashboard_serverMessage_configuration():configuration_server {
                        const config:configuration_server = JSON.parse(textArea.value);
                        config.modification_name = li.getAttribute("data-name");
                        return config;
                    }()),
                    payload:services_dashboard_action = {
                        action: action,
                        configuration: configuration
                    },
                    message:socket_data = {
                        data: payload,
                        service: "dashboard-action"
                    };
                socket.queue(JSON.stringify(message));
                if (cancel !== undefined) {
                    server.cancel(event);
                }
            },
            nodes: {
                server_definitions: document.getElementsByClassName("server-definitions")[0].getElementsByTagName("button")[0],
                server_new: document.getElementsByClassName("server-new")[0] as HTMLElement
            },
            title: function dashboard_serverTitle(name_server:string):HTMLElement {
                const li:HTMLElement = document.createElement("li"),
                    h4:HTMLElement = document.createElement("h4"),
                    expand:HTMLButtonElement = document.createElement("button"),
                    span:HTMLElement = document.createElement("span"),
                    name:string = (name_server === null)
                        ? "new_server"
                        : name_server;
                if (name_server === null) {
                    expand.appendText(name);
                } else {
                    const color:type_activation_status = message.server_color(name_server);
                    span.appendText("Expand");
                    span.setAttribute("class", "expand");
                    expand.appendChild(span);
                    expand.onclick = server.details;
                    li.setAttribute("data-name", name);
                    expand.appendText(`${name} - ${color[1]}`);
                    if (color[0] !== null) {
                        li.setAttribute("class", color[0]);
                    }
                    if (payload.servers[name_server].config.modification_name === null || payload.servers[name_server].config.modification_name === undefined) {
                        payload.servers[name_server].config.modification_name = name_server;
                    }
                }
                h4.appendChild(expand);
                li.appendChild(h4);
                return li;
            },
            validate: function dashboard_serverValidate(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                    listItem:HTMLElement = target.getAncestor("li", "tag"),
                    name_attribute:string = listItem.getAttribute("data-name"),
                    name_server:string = (name_attribute === null)
                        ? "new_server"
                        : name_attribute,
                    value:string = target.value,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                    ul:HTMLElement = document.createElement("ul"),
                    pathReg:RegExp = new RegExp(`(\\\\|\\/)${name_server}(\\\\|\\/)`, "g"),
                    populate = function dashboard_serverValidate_populate(pass:boolean, message:string):void {
                        const li:HTMLElement = document.createElement("li");
                        if (pass === null) {
                            li.setAttribute("class", "pass-warn");
                            li.appendText(`Warning: ${message}`);
                        } else {
                            li.setAttribute("class", `pass-${pass}`);
                            li.appendText(message);
                        }
                        ul.appendChild(li);
                        if (pass === false) {
                            failures = failures + 1;
                        }
                    },
                    disable = function dashboard_serverValidate_disable():void {
                        const save:HTMLButtonElement = (name_attribute === null)
                                ? listItem.getElementsByClassName("server-add")[0] as HTMLButtonElement
                                : listItem.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                            order = function dashboard_serverValidate_disable_order(item:configuration_server):string {
                                const keys:type_server_property[] = Object.keys(item).sort() as type_server_property[],
                                    output:object = {},
                                    len:number = keys.length;
                                let index:number = 0;
                                do {
                                    // @ts-expect-error - warns on implied any, but we know that the key values are extract from the same object
                                    output[keys[index]] = item[keys[index]];
                                    index = index + 1;
                                } while (index < len);
                                return JSON.stringify(output);
                            };
                        summary.removeChild(summary.getElementsByTagName("ul")[0]);
                        summary.appendChild(ul);
                        if (failures > 0) {
                            const plural:string = (failures === 1)
                                ? ""
                                : "s";
                            save.disabled = true;
                            populate(false, `The server configuration contains ${failures} violation${plural}.`);
                        } else if (name_attribute !== null && order(serverData) === order(payload.servers[name_server].config)) {
                            save.disabled = true;
                            populate(false, "The server configuration is valid, but not modified.");
                        } else {
                            save.disabled = false;
                            populate(true, "The server configuration is valid.");
                        }
                    },
                    stringArray = function dashboard_serverValidate_stringArray(required:boolean, name:string, property:string[]):boolean {
                        let index:number = (property === null || property === undefined)
                                ? 0
                                : property.length;
                        const requirement:string = (required === true)
                                ? "Required"
                                : "Optional";
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if (typeof property[index] !== "string") {
                                    const requirement_lower:string = (required === true)
                                        ? "required"
                                        : "optional";
                                    populate(false, `Index ${index} of ${requirement_lower} property ${name} is not a string.`);
                                    return false;
                                }
                            } while (index > 0);
                            if (name.includes(".") === false) {
                                populate(true, `${requirement} property '${name}' is an array only containing strings.`);
                                return true;
                            }
                        } else if (name.includes(".") === false) {
                            if (serverData.domain_local === null) {
                                populate(required, `${requirement} property '${name}' is null.`);
                            } else if (serverData.domain_local === undefined) {
                                populate(required, `${requirement} property '${name}' is undefined.`);
                            }
                            return required;
                        }
                    },
                    keys = function dashboard_serverValidate_keys(config:config_validate_serverKeys):void {
                        const requirement_child:string = (config.required_property === true)
                                ? "required"
                                : "supported",
                            requirement_parent:string = (config.required_name === true)
                                ? "Required"
                                : "Optional",
                            keys:string[] = (config.name === null)
                                ? Object.keys(serverData)
                                : (serverData[config.name] === null || serverData[config.name] === undefined)
                                    ? []
                                    : Object.keys(serverData[config.name]);
                        let value:string = null,
                            redirect:[string, number] = null,
                            indexActual:number = keys.length,
                            indexSupported:number = 0,
                            pass:boolean = true;
                        if (config.name !== null) {
                            if (serverData[config.name] === null) {
                                if (config.required_name === true) {
                                    populate(false, `${requirement_parent} property '${config.name}' is null, but is required.`);
                                } else {
                                    populate(true, `${requirement_parent} property '${config.name}' is null and that is acceptable.`);
                                }
                                return;
                            }
                            if (serverData[config.name] === undefined) {
                                if (config.required_name === true) {
                                    populate(false, `${requirement_parent} property '${config.name}' is undefined, but is required.`);
                                } else {
                                    populate(true, `${requirement_parent} property '${config.name}' is undefined and that is acceptable.`);
                                }
                                return;
                            }
                        }
                        if (indexActual > 0) {
                            do {
                                indexActual = indexActual - 1;
                                indexSupported = config.supported.length;
                                value = (serverData[config.name] === undefined || serverData[config.name] === null)
                                    ? null
                                    // @ts-expect-error - The following line forces an implicit any, but we don't care because we are only evaluating for data type not value or assignment
                                    : serverData[config.name][keys[indexActual]];
                                if ((
                                    (config.type === "array" && Array.isArray(value) === false) ||
                                    ((config.type === "string" || config.type === "path") && typeof value !== "string") ||
                                    (config.type === "number" && typeof value !== "number")
                                ) && value !== null) {
                                    populate(false, `Property '${keys[indexActual]}' of '${config.name}' is not of type: ${config.type}.`);
                                    pass = false;
                                } else if (config.type === "path" && serverData.name !== name_server && pathReg.test(value) === true) {
                                    populate(null, `Property '${keys[indexActual]}' of '${config.name}' is a file system path that contains a directory references to a prior or default server name.`);
                                    // @ts-expect-error - The following line complains about comparing a string to a number when the value is not actually a string
                                } else if (config.name === "ports" && value > 65535) {
                                    populate(false, `Property '${keys[indexActual]}' of 'ports' must be a value in range 0 to 65535.`);
                                    pass = false;
                                } else if (config.type === "array") {
                                    if (config.name === "redirect_domain") {
                                        redirect = serverData.redirect_domain[keys[indexActual]];
                                        if (redirect.length !== 2 || typeof redirect[0] !== "string" || typeof redirect[1] !== "number" ) {
                                            populate(false, `Property '${keys[indexActual]}' of 'redirect_domain' is not a 2 index array with the first index of string type and the second of type number.`);
                                            pass = false;
                                        }
                                    } else {
                                        // @ts-expect-error - The last argument expects a string[] but variable value is superficially typed as string
                                        if (stringArray(config.required_property, `${config.name}.${keys[indexActual]}`, value) === false) {
                                            pass = false;
                                        }
                                    }
                                } else if (config.type === "store") {
                                    const childKeys:string[] = Object.keys(value);
                                    let childIndex:number = childKeys.length;
                                    if (childIndex > 0) {
                                        do {
                                            childIndex = childIndex - 1;
                                            // @ts-expect-error - The following line forces an implicit any, but we expect it to be a string value on a string store as a child of a larger string store
                                            if (typeof value[childKeys[childIndex]] !== "string") {
                                                populate(false, `Property '${keys[indexActual]}.${[childKeys[childIndex]]}' of '${config.name}' is not type: string.`);
                                                pass = false;
                                            }
                                        } while (childIndex > 0);
                                    }
                                }
                                if (indexSupported > 0) {
                                    do {
                                        indexSupported = indexSupported - 1;
                                        if (keys[indexActual] === config.supported[indexSupported]) {
                                            keys.splice(indexActual, 1);
                                            config.supported.splice(indexSupported, 1);
                                        } else if (config.name === "ports" && ((serverData.encryption === "open" && config.supported[indexSupported] === "secure") || (serverData.encryption === "secure" && config.supported[indexSupported] === "open"))) {
                                            config.supported.splice(indexSupported, 1);
                                        } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "http" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_internal")) {
                                            config.supported.splice(indexSupported, 1);
                                        }
                                    } while (indexSupported > 0);
                                }
                            } while (indexActual > 0);
                        }
                        if (config.name === "redirect_domain" || config.name === "redirect_internal") {
                            if (pass === true) {
                                populate(true, `${requirement_parent} property '${config.name}' contains values of the proper type.`);
                            }
                        } else {
                            if (keys.length === 0 && config.supported.length === 0) {
                                if (config.name === null) {
                                    populate(true, "Configuration contains only optional property names and all required primary property names.");
                                } else {
                                    populate(true, `${requirement_parent} property '${config.name}' contains only the ${requirement_child} property names.`);
                                }
                            } else {
                                if (config.supported.length > 0 && config.required_property === true) {
                                    if (config.name === null) {
                                        populate(false, `Configuration is missing required primary properties: ${JSON.stringify(config.supported)}.`);
                                    } else {
                                        populate(false, `${requirement_parent} property '${config.name}' is missing required properties: ${JSON.stringify(config.supported)}.`);
                                    }
                                }
                                if (keys.length > 0) {
                                    if (config.name === null) {
                                        populate(false, `Configuration contains unsupported primary properties: ${JSON.stringify(keys)}.`);
                                    } else {
                                        populate(false, `${requirement_parent} property '${config.name}' contains unsupported properties: ${JSON.stringify(keys)}.`);
                                    }
                                }
                            }
                        }
                    },
                    rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "http", "name", "ports", "redirect_domain", "redirect_internal", "temporary"];
                let serverData:configuration_server = null,
                    failures:number = 0;
                summary.style.display = "block";
                // eslint-disable-next-line no-restricted-syntax
                try {
                    serverData = JSON.parse(value);
                } catch (e:unknown) {
                    const error:Error = e as Error;
                    populate(false, error.message);
                    disable();
                    return;
                }
                if (name_attribute !== null) {
                    serverData.modification_name = payload.servers[name_server].config.modification_name;
                    rootProperties.push("modification_name");
                }
                // activate
                if (typeof serverData.activate === "boolean") {
                    populate(true, "Required property 'activate' has boolean type value.");
                } else {
                    populate(false, "Required property 'activate' expects a boolean type value.");
                }
                // block_list
                keys({
                    name: "block_list",
                    required_name: false,
                    required_property: true,
                    supported: ["host", "ip", "referrer"],
                    type: "array"
                });
                // domain_local
                stringArray(false, "domain_local", serverData.domain_local);
                // encryption
                if (serverData.encryption === "both" || serverData.encryption === "open" || serverData.encryption === "secure") {
                    populate(true, "Required property 'encryption' has an appropriate value of: \"both\", \"open\", or \"secure\".");
                } else {
                    populate(false, "Required property 'encryption' is not assigned a supported value: \"both\", \"open\", or \"secure\".");
                }
                // http
                keys({
                    name: "http",
                    required_name: false,
                    required_property: false,
                    supported: ["delete", "post", "put"],
                    type: "path"
                });
                // name
                if (listItem.getAttribute("data-name") === "dashboard" && serverData.name !== "dashboard") {
                    populate(false, "The dashboard server cannot be renamed.");
                } else if (typeof serverData.name === "string" && serverData.name !== "") {
                    if (serverData.name === "new_server") {
                        populate(null, "The name 'new_server' is a default placeholder. A more unique name is preferred.");
                    } else if (serverData.name === name_server || payload.servers[serverData.name] === undefined) {
                        populate(true, "Required property 'name' has an appropriate value.");
                    } else {
                        populate(false, `Name ${serverData.name} is already in use. Value for required property 'name' must be unique.`);
                    }
                } else {
                    populate(false, "Required property 'name' is not assigned an appropriate string value.");
                }
                // ports
                if ((serverData.ports.open === 0 && (serverData.encryption === "both" || serverData.encryption === "open")) || (serverData.ports.secure === 0 && (serverData.encryption === "both" || serverData.encryption === "secure"))) {
                    populate(null, "A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred.");
                }
                keys({
                    name: "ports",
                    required_name: true,
                    required_property: true,
                    supported: ["open", "secure"],
                    type: "number"
                });
                // redirect_domain
                keys({
                    name: "redirect_domain",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "array"
                });
                // redirect_internal
                keys({
                    name: "redirect_internal",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "store"
                });
                // activate
                if (typeof serverData.temporary === "boolean") {
                    populate(true, "Optional property 'temporary' has boolean type value.");
                } else if (serverData.temporary === null || serverData.temporary === undefined) {
                    populate(true, "Optional property 'temporary' is either null or undefined.");
                } else {
                    populate(false, "Optional property 'temporary' expects a boolean type value.");
                }
                // parent properties
                keys({
                    name: null,
                    required_name: false,
                    required_property: true,
                    supported: rootProperties,
                    type: null
                });
                disable();
            }
        },
        terminal:module_terminal = {
            events: {
                data: function dashboard_terminalData(event:websocket_event):void {
                    terminal.write(event.data);
                },
                input: function dashboard_terminalInput(input:terminal_input):void {
                    terminal.socket.send(input.key);
                }
            },
            info: {
                entries: [],
                lenVert: 0,
                posVert: 0,
                prompt: 0
            },
            init: function dashboard_terminalItem():void {
                const encryption:type_encryption = (location.protocol === "https")
                        ? "secure"
                        : "open",
                    server:services_dashboard_action = {
                        action: "add",
                        configuration: {
                            activate: true,
                            domain_local: [],
                            encryption: encryption,
                            name: `dashboard-terminal-${Math.random() + Date.now()}`,
                            ports: {
                                [encryption]: 0
                            }
                        }
                    },
                    terminal_message:socket_data = {
                        data: server,
                        service: "dashboard-terminal"
                    };
                terminal.item = new Terminal({
                    cols: payload.terminal.cols,
                    cursorBlink: true,
                    cursorStyle: "underline",
                    disableStdin: false,
                    rows: payload.terminal.rows,
                    theme: {
                        background: "#222",
                        selectionBackground: "#444"
                    }
                });
                terminal.item.open(terminal.nodes.output);
                terminal.item.onKey(terminal.events.input);
                terminal.write("Terminal emulator running...");
                // client-side terminal is ready, so alert the backend to initiate a pseudo-terminal
                socket.queue(JSON.stringify(terminal_message));
            },
            item: null,
            nodes: {
                output: document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement
            },
            socket: null,
            write: function dashboard_terminalWrite(input:string):void {
                if (input === "") {
                    return;
                }
                terminal.item.write(input);
            }
        },
        // @ts-expect-error - replace_me is not a variable, but a text segment that is externally replaced at page http request time
        payload:transmit_dashboard = replace_me,
        socket:socket_object = core(message.receiver, "dashboard", log);

    // start up logic for browser
    {
        const navigation = function dashboard_navigation(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    buttons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button");
                let index:number = sections.length;
                do {
                    index = index - 1;
                    document.getElementById(sections[index]).style.display = "none";
                } while (index > 0);
                index = buttons.length;
                do {
                    index = index - 1;
                    buttons[index].removeAttribute("class");
                } while (index > 0);
                document.getElementById(target.getAttribute("data-section")).style.display = "block";
                target.setAttribute("class", "nav-focus");
            },
            // dynamically discover navigation and assign navigation event handler
            sections:string[] = (function dashboard_sections():string[] {
                const buttons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button"),
                    output:string[] = [];
                let index:number = buttons.length;
                do {
                    index = index - 1;
                    output.push(buttons[index].getAttribute("data-section"));
                    buttons[index].onclick = navigation;
                } while (index > 0);
                return output;
            }());
        socket.invoke();
        // populate docker containers
        compose.list();
        // populate server list
        server.list();
        // populate log data
        payload.logs.forEach(function dashboard_logsEach(item:services_dashboard_status):void {
            log(item);
        });
        // port data
        ports.internal();
        // start the terminal
        terminal.init();
    }
};

export default dashboard;