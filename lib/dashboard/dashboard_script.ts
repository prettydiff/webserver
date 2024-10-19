
import core from "../browser/core.js";

const dashboard = function dashboard():void {
    // 1. test for port conflicts when creating servers from the dashboard
    // 2. multiple instances and load balancing
    // 3. page for arbitrary http requests and socket connections
    // 4. server type as an option (type of protocol/service)


    const socketOpen = function dashboard_socketOpen():void {},
        socketMessage = function dashboard_socketMessage(event:websocket_event):void {
            if (typeof event.data === "string") {
                const data:services_dashboard_status = JSON.parse(event.data).data;
                log(data);
                if (data.status !== "error") {
                    if (data.type === "server") {
                        const config:server = data.configuration as server,
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
                            payload.servers[config.name] = config;
                            const names:string[] = Object.keys(payload.servers),
                                ul:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0].getElementsByTagName("ul")[0];
                            payload.server_status[config.name] = (config.encryption === "both")
                                ? {
                                    open: 0,
                                    secure: 0
                                }
                                : (config.encryption === "open")
                                    ? {
                                        open: 0
                                    }
                                    : {
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
                                ul.appendChild(serverTitle(config.name));
                            } else if (names[0] === config.name) {
                                ul.insertBefore(serverTitle(config.name), ul.firstChild);
                            } else {
                                do {
                                    index = index - 1;
                                    if (names[index] === config.name) {
                                        ul.insertBefore(serverTitle(config.name), ul.childNodes[index - 1]);
                                        break;
                                    }
                                } while (index > 0);
                            }
                        } else if (data.action === "activate") {
                            payload.server_status[config.name] = config.ports;
                            let oldPorts:HTMLElement = null,
                                color:type_server_color = serverColor(config.name),
                                status:string = (color === "amber")
                                    ? "partially online"
                                    : (color === "green")
                                        ? "online"
                                        : "offline";
                            do {
                                index = index - 1;
                                if (list[index].getAttribute("data-name") === config.name) {
                                    list[index].setAttribute("class", color);
                                    if (color === "amber")
                                    list[index].getElementsByTagName("h4")[0].getElementsByTagName("button")[0].lastChild.textContent = `${config.name} - ${status}`;
                                    oldPorts = list[index].getElementsByClassName("active-ports")[0] as HTMLElement;
                                    if (oldPorts !== undefined) {
                                        oldPorts.parentNode.insertBefore(activePorts(config.name), oldPorts);
                                        oldPorts.parentNode.removeChild(oldPorts);
                                    }
                                    break;
                                }
                            } while (index > 0);
                        }
                    }
                }
            }
        },
        activePorts = function dashboard_activePorts(name_server:string):HTMLElement {
            const div:HTMLElement = document.createElement("div"),
                h5:HTMLElement = document.createElement("h5"),
                ports:HTMLElement = document.createElement("ul"),
                encryption:type_encryption = payload.servers[name_server].encryption;
            let portItem:HTMLElement = document.createElement("li");
            h5.appendText("Active Ports");
            div.appendChild(h5);
            div.setAttribute("class", "active-ports");
            if (encryption === "both") {
                if (payload.server_status[name_server].open === 0) {
                    portItem.appendText(`Open - offline`);
                } else {
                    portItem.appendText(`Open - ${payload.server_status[name_server].open}`);
                }
                ports.appendChild(portItem);
                portItem = document.createElement("li");
                if (payload.server_status[name_server].secure === 0) {
                    portItem.appendText(`Secure - offline`);
                } else {
                    portItem.appendText(`Secure - ${payload.server_status[name_server].secure}`);
                }
                ports.appendChild(portItem);
            } else if (encryption === "open") {
                if (payload.server_status[name_server].open === 0) {
                    portItem.appendText(`Open - offline`);
                } else {
                    portItem.appendText(`Open - ${payload.server_status[name_server].open}`);
                }
                ports.appendChild(portItem);
            } else {
                if (payload.server_status[name_server].secure === 0) {
                    portItem.appendText(`Secure - offline`);
                } else {
                    portItem.appendText(`Secure - ${payload.server_status[name_server].secure}`);
                }
                ports.appendChild(portItem);
            }
            div.appendChild(ports);
            return div;
        },
        serverColor = function dashboard_serverColor(name_server:string):type_server_color {
            if (name_server === null || payload.servers[name_server].activate === false) {
                return null;
            }
            const encryption:type_encryption = payload.servers[name_server].encryption;
            if (encryption === "both") {
                if (payload.server_status[name_server].open === 0 && payload.server_status[name_server].secure === 0) {
                    return "red";
                }
                if (payload.server_status[name_server].open > 0 && payload.server_status[name_server].secure > 0) {
                    return "green";
                }
                return "amber";
            }
            if (encryption === "open") {
                if (payload.server_status[name_server].open === 0) {
                    return "red";
                }
                return "green";
            }
            if (encryption === "secure") {
                if (payload.server_status[name_server].secure === 0) {
                    return "red";
                }
                return "green";
            }
        },
        socket:browserSocket = core(socketOpen, socketMessage, "browser"),
        payload:transmit_dashboard = JSON.parse(document.getElementsByTagName("input")[0].value),
        server_new:HTMLButtonElement = document.getElementsByClassName("server-new")[0] as HTMLButtonElement,
        definitions:HTMLButtonElement = document.getElementsByClassName("server-definitions")[0].getElementsByTagName("button")[0],
        serverTitle = function dashboard_serverTitle(name_server:string):HTMLElement {
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
                const color:type_server_color = serverColor(name_server),
                    statusLabel:string = (name_server === null)
                        ? "new"
                        : (payload.servers[name_server].activate === false)
                            ? "deactivated"
                            : (color === "amber")
                                ? "partially online"
                                : (color === "green")
                                    ? "online"
                                    : "offline";
                span.appendText("Expand");
                span.setAttribute("class", "expand");
                expand.appendChild(span);
                expand.onclick = server.details;
                li.setAttribute("data-name", name);
                expand.appendText(`${name} - ${statusLabel}`);
                if (status !== null) {
                    li.setAttribute("class", serverColor(name_server));
                }
            }
            h4.appendChild(expand);
            li.appendChild(h4);
            return li;
        },
        server:store_action = {
            cancel: function dashboard_serverCancel(event:type_user_event):void {
                const target:HTMLElement = event.target,
                    li:HTMLElement = target.getAncestor("li", "tag"),
                    servers:HTMLElement = li.getAncestor("servers", "id"),
                    create:HTMLButtonElement = servers.getElementsByClassName("server-new")[0] as HTMLButtonElement;
                li.parentNode.removeChild(li);
                create.disabled = false;
            },
            create: function dashboard_serverCreate(event:type_user_event):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                server.details(event);
            },
            definitions: function dashboard_serverDefinitions(event:type_user_event):void {
                const target:HTMLElement = event.target,
                    dl:HTMLElement = target.parentNode.getElementsByTagName("dl")[0];
                if (target.textContent === "Expand") {
                    dl.style.display = "block";
                    target.textContent = "Hide";
                } else {
                    dl.style.display = "none";
                    target.textContent = "Expand";
                }
            },
            details: function dashboard_serverDetails(event:type_user_event):void {
                let newFlag:boolean = false;
                const target:HTMLElement = (function dashboard_serverDetails_target():HTMLElement {
                        const el:HTMLElement = event.target;
                        if (el.getAttribute("class") === "server-new") {
                            const li:HTMLElement = serverTitle(null),
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
                                serverData:server = (newFlag === true)
                                    ? {
                                        activate: true,
                                        block_list: {
                                            host: [],
                                            ip: [],
                                            referrer: []
                                        },
                                        domain_local: [],
                                        encryption: "both",
                                        http: {
                                            delete: "",
                                            post: "",
                                            put: ""
                                        },
                                        name: "new_server",
                                        path: {
                                            certificates: payload.servers.dashboard.path.certificates.replace("dashboard", "new_server"),
                                            storage: payload.servers.dashboard.path.storage.replace("dashboard", "new_server"),
                                            web_root: payload.servers.dashboard.path.web_root.replace("dashboard", "new_server")
                                        },
                                        ports: {
                                            open: 0,
                                            secure: 0
                                        },
                                        redirect_domain: {},
                                        redirect_internal: {}
                                    }
                                    : payload.servers[name_server],
                                output:string[] = [
                                        "{",
                                        `"activate": ${serverData.activate},`,
                                        "\"block_list\": {"
                                    ];
                            if (serverData.block_list === null || serverData.block_list === undefined) {
                                array(true, "host", null);
                                array(true, "ip", null);
                                array(true, "referrer", null);
                            } else {
                                array(true, "host", serverData.block_list.host);
                                array(true, "ip", serverData.block_list.ip);
                                array(true, "referrer", serverData.block_list.referrer);
                            }
                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                            output.push("},");
                            array(false, "domain_local", serverData.domain_local);
                            if (serverData.encryption === "both" || serverData.encryption === "open" || serverData.encryption === "secure") {
                                output.push(`"encryption": "${serverData.encryption}",`);
                            } else {
                                output.push("\"encryption\": \"both\",");
                            }
                            output.push("\"http\": {");
                            if (serverData.http === null || serverData.http === undefined) {
                                output.push("    \"delete\": \"\",");
                                output.push("    \"post\": \"\",");
                                output.push("    \"put\": \"\"");
                            } else {
                                output.push(`    "delete": "${sanitize(serverData.http.delete)}",`);
                                output.push(`    "post": "${sanitize(serverData.http.post)}",`);
                                output.push(`    "put": "${sanitize(serverData.http.put)}"`);
                            }
                            output.push("},");
                            if (newFlag === true) {
                                output.push("\"name\": \"new_server\",");
                            } else {
                                output.push(`"name": "${sanitize(name_server)}",`);
                            }
                            output.push("\"path\": {");
                            output.push(`    "certificates": "${sanitize(serverData.path.certificates)}",`);
                            output.push(`    "storage": "${sanitize(serverData.path.storage)}",`);
                            output.push(`    "web_root": "${sanitize(serverData.path.web_root)}"`);
                            output.push("},");
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
                            object("redirect_domain");
                            object("redirect_internal");
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
                    textArea.onkeyup = server.validate;
                    textArea.onfocus = server.validate;
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
                        details.appendChild(activePorts(name_server));
                    }
                    clear.setAttribute("class", "clear");
                    p.appendChild(clear);
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
            edit: function dashboard_serverEdit(event:type_user_event):void {
                const target:HTMLElement = event.target,
                    listItem:HTMLElement = target.getAncestor("li", "tag"),
                    p:HTMLElement = listItem.getElementsByClassName("edit")[0].lastChild as HTMLElement,
                    textArea:HTMLTextAreaElement = listItem.getElementsByTagName("textarea")[0],
                    destroy:HTMLButtonElement = document.createElement("button"),
                    save:HTMLButtonElement = document.createElement("button"),
                    createServer:boolean = (target.getAttribute("class") === "server-new");
                save.disabled = true;
                if (createServer === false && listItem.getAttribute("data-name") !== "dashboard") {
                    destroy.appendText("✘ Destroy");
                    destroy.setAttribute("class", "server-destroy");
                    destroy.onclick = server.message;
                    p.insertBefore(destroy, p.firstChild);
                }
                if (createServer === true) {
                    destroy.appendText("⚠ Cancel");
                    destroy.setAttribute("class", "server-cancel");
                    destroy.onclick = server.cancel;
                    p.insertBefore(destroy, p.firstChild);
                    save.appendText("✔ Create");
                    save.setAttribute("class", "server-create");
                } else {
                    p.removeChild(p.getElementsByClassName("server-edit")[0]);
                    save.appendText("🖪 Save");
                    save.setAttribute("class", "server-save");
                }
                save.onclick = server.message;
                p.insertBefore(save, p.firstChild);
                textArea.readOnly = false;
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
                let index:number = 0;
    
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
                    ul.appendChild(serverTitle(list[index]));
                    index = index + 1;
                } while (index < total);
                h3.appendText("Server List");
                div.setAttribute("class", "server-list");
                div.appendChild(h3);
                div.appendChild(ul);
                tag.appendChild(div);
            },
            message: function dashboard_serverMessage(event:type_user_event): void {
                const target:HTMLElement = event.target,
                    li:HTMLElement = target.getAncestor("li", "tag"),
                    textArea:HTMLTextAreaElement = li.getElementsByTagName("textarea")[0],
                    action:"create"|"destroy"|"save" = target.getAttribute("class").replace("server-", "") as "create"|"destroy"|"save",
                    cancel:HTMLElement = li.getElementsByClassName("server-cancel")[0] as HTMLElement,
                    configuration:server = (function dashboard_serverMessage_configuration():server {
                        const config:server = JSON.parse(textArea.value);
                        config.modification_name = li.getAttribute("data-name");
                        return config;
                    }()),
                    payload:services_dashboard_action = {
                        action: `server-${action}`,
                        configuration: configuration
                    },
                    message:socket_data = {
                        service: "dashboard-action",
                        data: payload
                    };
                socket.queue(JSON.stringify(message));
                if (cancel !== undefined) {
                    server.cancel(event);
                }
            },
            validate: function dashboard_serverValidate(event:type_user_event):void {
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
                            ? listItem.getElementsByClassName("server-create")[0] as HTMLButtonElement
                            : listItem.getElementsByClassName("server-save")[0] as HTMLButtonElement;
                        summary.removeChild(summary.getElementsByTagName("ul")[0]);
                        summary.appendChild(ul);
                        if (failures > 0) {
                            const plural:string = (failures === 1)
                                ? ""
                                : "s";
                            save.disabled = true;
                            populate(false, `The server configuration contains ${failures} violation${plural}.`);
                        } else if (JSON.stringify(serverData) === JSON.stringify(payload.servers[name_server])) {
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
                    };
                let serverData:server = null,
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
                // activate
                if (typeof serverData.activate === "boolean") {
                    populate(true, "Required property 'activate' has boolean type value.");
                } else {
                    populate(true, "Required property 'activate' expects a boolean type value.");
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
                // path
                keys({
                    name: "path",
                    required_name: true,
                    required_property: true,
                    supported: ["certificates", "storage", "web_root"],
                    type: "path"
                });
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
                // parent properties
                keys({
                    name: null,
                    required_name: false,
                    required_property: true,
                    supported: ["activate", "block_list", "domain_local", "encryption", "http", "name", "path", "ports", "redirect_domain", "redirect_internal"],
                    type: null
                });
                disable();
            }
        },
        log = function dashboard_log(item:services_dashboard_status):void {
            let li:HTMLElement = document.createElement("li"),
                timeElement:HTMLElement = document.createElement("time");
            const ul:HTMLElement = document.getElementById("logs").getElementsByTagName("ul")[0],
                strong:HTMLElement = document.createElement("strong"),
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
                li.appendChild(strong);
            } else {
                li.appendText(item.message);
            }
            ul.appendChild(li);
        },
        navigation = function dashboard_navigation(event:MouseEvent):void {
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
    server_new.onclick = server.create;
    definitions.onclick = server.definitions;
    server.list();
    payload.logs.forEach(function dashboard_logsEach(item:services_dashboard_status):void {
        log(item);
    });
};

export default dashboard;