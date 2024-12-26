
import core from "../browser/core.js";
// @ts-expect-error - TypeScript claims xterm has no default export, but this is how the documentation says to use it.
import Terminal from "@xterm/xterm";

// cspell: words buildx, containerd, nmap, winget

const dashboard = function dashboard():void {
    let payload:transmit_dashboard = null,
        loaded:boolean = false,
        ports_external:boolean = false,
        section:type_dashboard_sections = "servers";
    const log = function dashboard_log(item:services_dashboard_status):void {
            const li:HTMLElement = document.createElement("li"),
                timeElement:HTMLElement = document.createElement("time"),
                ul:HTMLElement = document.getElementById("logs").getElementsByTagName("ul")[0],
                strong:HTMLElement = document.createElement("strong"),
                code:HTMLElement = document.createElement("code"),
                time:string = item.time.dateTime(false);
            timeElement.appendText(time);
            li.appendChild(timeElement);
            li.setAttribute("class", `log-${item.status}`);
            if (item.status === "error" && item.configuration !== null) {
                strong.appendText(item.message);
                code.appendText(JSON.stringify(item.configuration));
                li.appendChild(strong);
                li.appendChild(code);
            } else {
                li.appendText(item.message);
            }
            if (ul.childNodes.length > 100) {
                ul.removeChild(ul.firstChild);
            }
            ul.appendChild(li);
        },
        baseline = function dashboard_baseline():void {
            const serverList:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                logs_old:HTMLElement = document.getElementById("logs").getElementsByTagName("ul")[0],
                ports_old:HTMLCollectionOf<HTMLElement> = document.getElementById("ports").getElementsByTagName("tbody"),
                sockets_old:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                status:HTMLElement = document.getElementById("connection-status"),
                terminal_output:HTMLElement = document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
                replace = function dashboard_baseline_replace(node:HTMLElement, className:boolean):HTMLElement {
                    if (node !== null && node !== undefined && node.parentNode !== null) {
                        const node_new:HTMLElement = document.createElement(node.nodeName.toLowerCase());
                        if (className === true) {
                            node_new.setAttribute("class", node.getAttribute("class"));
                        }
                        node.parentNode.appendChild(node_new);
                        node.parentNode.removeChild(node);
                        return node_new;
                    }
                    return null;
                };
            if (loaded === true) {
                const server_new:HTMLButtonElement = document.getElementById("servers").getElementsByClassName("server-new")[0] as HTMLButtonElement;
                loaded = false;
                server_new.disabled = false;
                status.setAttribute("class", "connection-offline");
                status.getElementsByTagName("strong")[0].textContent = "Offline";
                if (compose.nodes !== null) {
                    compose.nodes.containers_list = replace(compose.nodes.containers_list, true);
                    compose.nodes.variables_list = replace(compose.nodes.variables_list, true);
                    if (compose.nodes.containers_new.disabled === true) {
                        const compose_containers_cancel:HTMLButtonElement = document.getElementById("compose").getElementsByClassName("section")[1].getElementsByClassName("server-cancel")[0] as HTMLButtonElement;
                        compose_containers_cancel.click();
                    }
                    if (compose.nodes.variables_new.disabled === true) {
                        const compose_variable_cancel:HTMLButtonElement = document.getElementById("compose").getElementsByClassName("section")[0].getElementsByClassName("server-cancel")[0] as HTMLButtonElement;
                        compose_variable_cancel.click();
                    }
                }
                terminal.nodes.output = replace(terminal_output, true);
                server.nodes.list = replace(serverList, true);
                replace(logs_old, false);
                replace(ports_old[0], false);
                replace(ports_old[1], false);
                replace(sockets_old, false);
                socket.socket = null;
                if (terminal.socket !== null) {
                    terminal.socket.close();
                }
            }
        },
        common:module_common = {
            cancel: function dashboard_commonCancel(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    create:HTMLButtonElement = (section === "servers")
                        ? server.nodes.server_new
                        : compose.nodes.containers_new;
                edit.parentNode.removeChild(edit);
                create.disabled = false;
            },
            color: function dashboard_commonColor(name_server:string, type:type_dashboard_list):type_activation_status {
                if (name_server === null) {
                    return [null, "new"];
                }
                if (type === "container") {
                    if (payload.compose.containers[name_server].state === "running") {
                        return ["green", "online"];
                    }
                    return ["red", "offline"];
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
            details: function dashboard_commonDetails(event:MouseEvent):void {
               const target:HTMLElement = event.target,
                    classy:string = target.getAttribute("class"),
                    newFlag:boolean = (classy === "server-new" || classy === "compose-container-new"),
                    serverItem:HTMLElement = (newFlag === true)
                        ? (section === "servers")
                            ? server.nodes.list
                            : compose.nodes.containers_list
                        : target.getAncestor("li", "tag"),
                    titleButton:HTMLElement = serverItem.getElementsByTagName("button")[0],
                    expandButton:HTMLElement = (newFlag === true)
                        ? null
                        : titleButton.getElementsByClassName("expand")[0] as HTMLElement,
                    expandText:string = (newFlag === true)
                        ? ""
                        : expandButton.textContent;
                if (newFlag === true || expandText === "Expand") {
                    let p:HTMLElement = document.createElement("p");
                    const name_server:string = serverItem.getAttribute("data-name"),
                        details:HTMLElement = document.createElement("div"),
                        label:HTMLElement = document.createElement("label"),
                        textArea:HTMLTextAreaElement = document.createElement("textarea"),
                        span:HTMLElement = document.createElement("span"),
                        value:string = (section === "servers")
                            ? (function dashboard_commonDetails_value():string {
                                const array = function dashboard_commonDetails_value_array(indent:boolean, name:string, property:string[]):void {
                                        const ind:string = (indent === true)
                                            ? "    "
                                            : "";
                                        if (property === null || property === undefined || property.length < 1) {
                                            output.push(`${ind}"${name}": [],`);
                                        } else {
                                            output.push(`${ind}"${name}": [`);
                                            property.forEach(function dashboard_commonDetails_value_array_each(value:string):void {
                                                output.push(`${ind}    "${sanitize(value)}",`);
                                            });
                                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                            output.push(`${ind}],`);
                                        }
                                    },
                                    object = function dashboard_commonDetails_value_object(property:"redirect_asset"|"redirect_domain"):void {
                                        const list:string[] = Object.keys(serverData[property]),
                                            total:number = list.length,
                                            objValue = function dashboard_commonDetails_value_object(input:string):void {
                                                if (serverData.redirect_asset[input] === null || serverData.redirect_asset[input] === undefined) {
                                                    output.push(`    "${sanitize(input)}": {},`);
                                                } else {
                                                    const childList:string[] = Object.keys(serverData.redirect_asset[input]),
                                                        childTotal:number = childList.length;
                                                    let childIndex:number = 0;
                                                    if (childTotal < 1) {
                                                        output.push(`    "${sanitize(input)}": {},`);
                                                    } else {
                                                        output.push(`    "${sanitize(input)}": {`);
                                                        do {
                                                            output.push(`        "${sanitize(childList[childIndex])}": "${sanitize(serverData.redirect_asset[input][childList[childIndex]])}",`);
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
                                    sanitize = function dashboard_commonDetails_value_sanitize(input:string):string {
                                        return input.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                                    },
                                    serverData:services_server = (newFlag === true)
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
                                if (serverData.redirect_asset !== undefined && serverData.redirect_asset !== null) {
                                    object("redirect_asset");
                                }
                                output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                return `${output.join("\n    ")}\n}`;
                            }())
                            : (newFlag === true)
                                ? ""
                                : payload.compose.containers[name_server].compose,
                        summary:HTMLElement = document.createElement("div"),
                        summaryTitle:HTMLElement = document.createElement("h5"),
                        summaryUl:HTMLElement = document.createElement("ul"),
                        editButton:HTMLElement = document.createElement("button"),
                        clear:HTMLElement = document.createElement("span");
                    if (section === "compose") {
                        const textArea:HTMLTextAreaElement = document.createElement("textarea");
                        let p:HTMLElement = document.createElement("p"),
                            label:HTMLElement = document.createElement("label"),
                            span:HTMLElement = document.createElement("span");

                        // compose textarea
                        textArea.spellcheck = false;
                        textArea.readOnly = true;
                        if (newFlag === false) {
                            textArea.value = payload.compose.containers[name_server].description;
                        }
                        p = document.createElement("p");
                        label = document.createElement("label");
                        span = document.createElement("span");
                        span.appendText("Description (optional)");
                        span.setAttribute("class", "text");
                        textArea.setAttribute("class", "short");
                        label.appendChild(span);
                        label.appendChild(textArea);
                        p.appendChild(label);
                        details.appendChild(p);
                    }
                    summaryTitle.appendText("Edit Summary");
                    summary.appendChild(summaryTitle);
                    summary.appendChild(summaryUl);
                    summary.setAttribute("class", "summary");
                    details.setAttribute("class", "edit");
                    span.setAttribute("class", "text");
                    textArea.value = value;
                    textArea.spellcheck = false;
                    textArea.readOnly = true;
                    if (section === "compose") {
                        span.appendText("Compose YAML");
                    } else {
                        span.appendText("Server Configuration");
                    }
                    label.appendChild(span);
                    label.appendChild(textArea);
                    p.appendChild(label);
                    details.appendChild(p);
                    details.appendChild(summary);
                    if (newFlag === false) {
                        expandButton.textContent = "Hide";
                        editButton.appendText("✎ Edit");
                        editButton.setAttribute("class", "server-edit");
                        editButton.onclick = common.edit;
                        p.appendChild(editButton);
                        if (section === "compose") {
                            details.appendChild(compose.activePorts(name_server));
                        } else {
                            details.appendChild(server.activePorts(name_server));
                        }
                    }
                    clear.setAttribute("class", "clear");
                    p = document.createElement("p");
                    p.appendChild(clear);
                    p.setAttribute("class", "buttons");
                    details.appendChild(p);
                    if (newFlag === true) {
                        serverItem.parentNode.insertBefore(details, serverItem);
                        common.edit(event);
                    } else {
                        serverItem.appendChild(details);
                    }
                } else {
                    do {
                        serverItem.removeChild(serverItem.lastChild);
                    } while (serverItem.childNodes.length > 1);
                    expandButton.textContent = "Expand";
                }
            },
            edit: function dashboard_commonEdit(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    classy:string = target.getAttribute("class"),
                    createServer:boolean = (classy === "server-new" || classy === "compose-container-new"),
                    edit:HTMLElement = (createServer === true)
                        ? target.getAncestor("section", "class").getElementsByClassName("edit")[0] as HTMLElement
                        : target.getAncestor("edit", "class"),
                    editButton:HTMLElement = edit.getElementsByClassName("server-edit")[0] as HTMLElement,
                    listItem:HTMLElement = edit.parentNode,
                    dashboard:boolean = (createServer === false && listItem.getAttribute("data-name") === "dashboard"),
                    p:HTMLElement = edit.lastChild as HTMLElement,
                    activate:HTMLButtonElement = document.createElement("button"),
                    deactivate:HTMLButtonElement = document.createElement("button"),
                    destroy:HTMLButtonElement = document.createElement("button"),
                    save:HTMLButtonElement = document.createElement("button"),
                    clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                    note:HTMLElement = document.createElement("p");
                save.disabled = true;
                if (createServer === false && dashboard === false) {
                    const span:HTMLElement = document.createElement("span"),
                        buttons:HTMLElement = document.createElement("p");
                    buttons.setAttribute("class", "buttons");
                    destroy.appendText("✘ Destroy");
                    destroy.setAttribute("class", "server-destroy");
                    destroy.onclick = (section === "compose")
                        ? compose.message
                        : server.message;
                    activate.appendText("⌁ Activate");
                    activate.setAttribute("class", "server-activate");
                    if (listItem.getAttribute("class") === "green") {
                        activate.disabled = true;
                    }
                    activate.onclick = (section === "compose")
                        ? compose.message
                        : server.message;
                    deactivate.appendText("። Deactivate");
                    deactivate.setAttribute("class", "server-deactivate");
                    deactivate.onclick = (section === "compose")
                        ? compose.message
                        : server.message;
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
                    destroy.onclick = common.cancel;
                    p.appendChild(destroy);
                    save.appendText("✔ Create");
                    save.setAttribute("class", "server-add");
                } else {
                    editButton.parentNode.removeChild(editButton);
                    save.appendText("🖪 Modify");
                    save.setAttribute("class", "server-modify");
                }
                save.onclick = (section === "compose")
                    ? compose.message
                    : server.message;
                p.appendChild(save);
                p.removeChild(clear);
                p.appendChild(clear);
                p.setAttribute("class", "buttons");
                if (createServer === true) {
                    if (section === "compose") {
                        note.textContent = "Container status messaging redirected to terminal.";
                    } else {
                        note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                    }
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                } else if (dashboard === false) {
                    note.textContent = (section === "compose")
                        ? `Changing the container name of an existing container will create a new container. Ensure the compose file mentions PUID and PGID with values ${payload.user.uid} and ${payload.user.gid} to prevent writing files as root.`
                        : "Destroying a server will delete all associated file system artifacts. Back up your data first.";
                    note.setAttribute("class", "note");
                    p.parentNode.appendChild(note);
                }
                if (section === "compose") {
                    const textArea0:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                        textArea1:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[1];
                    textArea0.readOnly = false;
                    textArea1.readOnly = false;
                    textArea1.onkeyup = compose.validateContainer;
                    textArea1.onfocus = compose.validateContainer;
                    textArea0.focus();
                } else {
                    const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0];
                    textArea.readOnly = false;
                    textArea.onkeyup = server.validate;
                    textArea.onfocus = server.validate;
                    textArea.focus();
                }
            },
            title: function dashboard_commonTitle(name_server:string, type:type_dashboard_list):HTMLElement {
                const li:HTMLElement = document.createElement("li"),
                    h4:HTMLElement = document.createElement("h4"),
                    expand:HTMLButtonElement = document.createElement("button"),
                    span:HTMLElement = document.createElement("span"),
                    name:string = (name_server === null)
                        ? `new_${type}`
                        : name_server;
                if (name_server === null) {
                    expand.appendText(name);
                } else {
                    const color:type_activation_status = common.color(name_server, type);
                    span.appendText("Expand");
                    span.setAttribute("class", "expand");
                    expand.appendChild(span);
                    expand.onclick = common.details;
                    li.setAttribute("data-name", name);
                    expand.appendText(`${name} - ${color[1]}`);
                    if (color[0] !== null) {
                        li.setAttribute("class", color[0]);
                    }
                    if (type === "server" && (payload.servers[name_server].config.modification_name === null || payload.servers[name_server].config.modification_name === undefined)) {
                        payload.servers[name_server].config.modification_name = name_server;
                    }
                }
                h4.appendChild(expand);
                li.appendChild(h4);
                return li;
            }
        },
        compose:module_compose = {
            activePorts: function dashboard_composeActivePorts(name_server:string):HTMLElement {
                const div:HTMLElement = document.createElement("div"),
                    h5:HTMLElement = document.createElement("h5"),
                    portList:HTMLElement = document.createElement("ul"),
                    ports:services_docker_compose_publishers[] = payload.compose.containers[name_server].publishers;
                let portItem:HTMLElement = null,
                    index:number = ports.length;
                if (index < 1) {
                    return div;
                }
                ports.sort(function dashboard_composeActivePorts_sort(a:services_docker_compose_publishers,b:services_docker_compose_publishers):-1|1 {
                    if (a.PublishedPort < b.PublishedPort) {
                        return 1;
                    }
                    return -1;
                });
                h5.appendText("Active Ports");
                div.appendChild(h5);
                div.setAttribute("class", "active-ports");
                do {
                    index = index - 1;
                    portItem = document.createElement("li");
                    portItem.appendText(`${ports[index].PublishedPort} (${ports[index].Protocol.toUpperCase()})`);
                    portList.appendChild(portItem);
                    // prevent redudant output in the case of reporting for both IPv4 and IPv6
                    if (index > 0 && ports[index - 1].PublishedPort === ports[index].PublishedPort) {
                        index = index - 1;
                    }
                } while (index > 0);
                div.appendChild(portList);
                return div;
            },
            cancelVariables: function dashboard_composeCancelVariables(event:MouseEvent):void {
                const target:HTMLElement = event.target.getAncestor("div", "tag"),
                    section:HTMLElement = target.getAncestor("section", "class"),
                    edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement;
                edit.parentNode.removeChild(edit);
                compose.nodes.variables_list.style.display = "block";
                compose.nodes.variables_new.disabled = false;
            },
            container: function dashboard_composeContainer(config:services_docker_compose):void {
                const list:HTMLCollectionOf<HTMLElement> = compose.nodes.containers_list.getElementsByTagName("li");
                let index:number = list.length;
                payload.compose.containers[config.name] = config;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (list[index].getAttribute("data-name") === config.name) {
                            compose.nodes.containers_list.insertBefore(common.title(config.name, "container"), list[index]);
                            compose.nodes.containers_list.removeChild(list[index]);
                            return;
                        }
                    } while (index > 0);
                }
                compose.nodes.containers_list.appendChild(common.title(config.name, "container"));
            },
            create: function dashboard_composeCreate(event:MouseEvent):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                common.details(event);
            },
            destroyContainer: function dashboard_composeDestroyContainer(config:services_docker_compose):void {
                delete payload.compose.containers[config.name];
                if (compose.nodes !== null) {
                    const list:HTMLCollectionOf<HTMLElement> = compose.nodes.containers_list.getElementsByTagName("li");
                    let index:number = list.length;
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (list[index].getAttribute("data-name") === config.name) {
                                list[index].parentNode.removeChild(list[index]);
                                break;
                            }
                        } while (index > 0);
                    }
                }
            },
            editVariables: function dashboard_composeEditVariables():void {
                const p:HTMLElement = document.createElement("p"),
                    buttons:HTMLElement = document.createElement("p"),
                    label:HTMLElement = document.createElement("label"),
                    edit:HTMLElement = document.createElement("div"),
                    ul:HTMLElement = document.createElement("ul"),
                    textArea:HTMLTextAreaElement = document.createElement("textarea"),
                    keys:string[] = Object.keys(payload.compose.variables).sort(),
                    output:string[] = [],
                    len:number = keys.length,
                    cancel:HTMLElement = document.createElement("button"),
                    save:HTMLElement = document.createElement("button");
                let index:number = 0;
                edit.setAttribute("class", "edit");
                if (len > 0) {
                    do {
                        output.push(`"${keys[index]}": "${payload.compose.variables[keys[index]]}"`);
                        index = index + 1;
                    } while (index < len);
                    textArea.value = `{\n    ${output.join(",\n    ")}\n}`;
                }
                cancel.appendText("⚠ Cancel");
                cancel.setAttribute("class", "server-cancel");
                cancel.onclick = compose.cancelVariables;
                buttons.appendChild(cancel);
                save.appendText("🖪 Modify");
                save.setAttribute("class", "server-modify");
                save.onclick = compose.message;
                buttons.appendChild(save);
                textArea.setAttribute("class", "compose-variables-edit");
                compose.nodes.variables_list.style.display = "none";
                label.appendText("Docker Compose Variables");
                label.appendChild(textArea);
                p.setAttribute("class", "compose-edit");
                p.appendChild(label);
                buttons.setAttribute("class", "buttons");
                edit.appendChild(p);
                edit.appendChild(ul);
                edit.appendChild(buttons);
                compose.nodes.variables_list.parentNode.appendChild(edit);
                compose.nodes.variables_new.disabled = true;
                textArea.onkeyup = compose.validateVariables;
                textArea.onfocus = compose.validateVariables;
                textArea.focus();
            },
            getTitle: function dashboard_composeGetTitle(textArea:HTMLTextAreaElement):string {
                const regTitle:RegExp = (/^\s+container_name\s*:\s*/),
                    values:string[] = textArea.value.split("\n"),
                    len:number = values.length;
                let index:number = 0;
                if (len > 0) {
                    do {
                        if (regTitle.test(values[index]) === true) {
                            return values[index].replace(regTitle, "").replace(/^("|')/, "").replace(/\s*("|')$/, "");
                        }
                        index = index + 1;
                    } while (index < len);
                }
                return "";
            },
            init: function dashboard_composeInit():void {
                if (payload.compose === null) {
                    if (compose.nodes !== null) {
                        const composeElement:HTMLElement = document.getElementById("compose"),
                            sections:HTMLCollectionOf<HTMLElement> = composeElement.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>,
                            p:HTMLElement = document.createElement("p");
                        compose.nodes = null;
                        p.appendText("Docker Compose is not available. Please see the logs for additional information.");
                        composeElement.removeChild(sections[1]);
                        composeElement.removeChild(sections[0]);
                        composeElement.appendChild(p);
                    }
                    return;
                }
                compose.list("containers");
                compose.list("variables");
                compose.nodes.variables_new.onclick = compose.editVariables;
                compose.nodes.containers_new.onclick = compose.create;
            },
            list: function dashboard_composeList(type:"containers"|"variables"):void {
                const list:string[] = Object.keys(payload.compose[type]).sort(),
                    parent:HTMLElement = compose.nodes[`${type}_list`],
                    ul:HTMLElement = document.createElement("ul"),
                    len:number = list.length;
                let li:HTMLElement = null,
                    strong:HTMLElement = null,
                    span:HTMLElement = null,
                    index:number = 0;
                ul.setAttribute("class", parent.getAttribute("class"));
                if (len > 0) {
                    do {
                        if (type === "containers") {
                            li = common.title(payload.compose.containers[list[index]].name, "container");
                            ul.appendChild(li);
                        } else if (type === "variables") {
                            li = document.createElement("li");
                            strong = document.createElement("strong");
                            span = document.createElement("span");
                            strong.appendText(list[index]);
                            span.appendText(payload.compose[type][list[index]]);
                            li.appendChild(strong);
                            li.appendChild(span);
                            ul.appendChild(li);
                        }
                        index = index + 1;
                    } while (index < len);
                    parent.parentNode.insertBefore(ul, parent);
                    parent.parentNode.removeChild(parent);
                    compose.nodes[`${type}_list`] = ul;
                } else {
                    parent.style.display = "none";
                }
            },
            message: function dashboard_composeMessage(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    classy:string = target.getAttribute("class"),
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    section:HTMLElement = edit.getAncestor("section", "class"),
                    title:string = section.getElementsByTagName("h3")[0].textContent,
                    cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                    textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[1],
                    value:string = edit.getElementsByTagName("textarea")[0].value;
                if (title === "Environmental Variables") {
                    const variables:store_string = JSON.parse(value);
                    message.send("modify", variables, "dashboard-compose-variables");
                    compose.nodes.variables_new.disabled = false;
                } else {
                    const action:type_dashboard_action = classy.replace("server-", "") as type_dashboard_action,
                        newTitle:string = compose.getTitle(textArea);
                    if (action === "activate" || action === "deactivate") {
                        const direction:"down"|"up --detach" = (action === "activate")
                            ? "up --detach"
                            : "down";
                        terminal.socket.send(`docker compose -f ${payload.path.compose + newTitle}.yml ${direction}\n`);
                    } else {
                        const yaml:string = textArea.value,
                            trim = function dashboard_composeMessage_trim(input:string):string {
                                return input.replace(/^\s+/, "").replace(/\s+$/, "");
                            },
                            item:services_docker_compose = (payload.compose.containers[newTitle] === undefined)
                                ? {
                                    command: "",
                                    compose: "",
                                    createdAt: "",
                                    description: "",
                                    exitCode: 0,
                                    health: "",
                                    id: "",
                                    image: "",
                                    labels: [],
                                    localVolumes: null,
                                    mounts: [],
                                    name: newTitle,
                                    names: [newTitle],
                                    networks: [],
                                    ports: [],
                                    project: "",
                                    publishers: [],
                                    runningFor: "",
                                    service: "",
                                    size: null,
                                    state: "dead",
                                    status: ""
                                }
                                : payload.compose.containers[newTitle];
                        item.compose = trim(yaml);
                        item.description = trim(value);
                        payload.compose.containers[newTitle] = item;
                        message.send(action, item, "dashboard-compose-container");
                    }
                    compose.nodes.containers_new.disabled = false;
                }
                if (cancel === undefined) {
                    edit.parentNode.getElementsByTagName("button")[0].click();
                } else {
                    common.cancel(event);
                }
            },
            nodes: {
                containers_list: document.getElementById("compose").getElementsByClassName("compose-container-list")[0] as HTMLElement,
                containers_new: document.getElementById("compose").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
                variables_list: document.getElementById("compose").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
                variables_new: document.getElementById("compose").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement
            },
            validateContainer: function dashboard_composeValidateContainer(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLElement = event.target,
                    section:HTMLElement = target.getAncestor("edit", "class"),
                    newItem:boolean = (section.parentNode.getAttribute("class") === "section"),
                    textArea:HTMLTextAreaElement = section.getElementsByTagName("textarea")[1],
                    summary:HTMLElement = section.getElementsByClassName("summary")[0] as HTMLElement,
                    old:HTMLElement = summary.getElementsByTagName("ul")[0] as HTMLElement,
                    modify:HTMLButtonElement = (newItem === true)
                        ? section.getElementsByClassName("server-add")[0] as HTMLButtonElement
                        : section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                    ul:HTMLElement = document.createElement("ul"),
                    reg:RegExp = (/^\s*$/),
                    title:string = compose.getTitle(textArea),
                    value:string = textArea.value;
                let valid:boolean = true,
                    li:HTMLElement = document.createElement("li");
                summary.style.display = "block";
                if (reg.test(value) === true) {
                    valid = false;
                    li.appendText("Compose file contents must have a value.");
                    li.setAttribute("class", "pass-false");
                } else if (title === "") {
                    valid = false;
                    li.appendText("Compose file does not contain a valid container name.");
                    li.setAttribute("class", "pass-false");
                } else {
                    li.appendText("Compose file contents field contains a value.");
                    li.setAttribute("class", "pass-true");
                }
                ul.appendChild(li);
                if (valid === true && payload.compose.containers[title] !== undefined) {
                    if (newItem === true) {
                        valid = false;
                        li = document.createElement("li");
                        li.appendText("There is already a container with this name.");
                        li.setAttribute("class", "pass-false");
                        ul.appendChild(li);
                    } else if (payload.compose.containers[title].compose === value) {
                        valid = false;
                        li = document.createElement("li");
                        li.appendText("Values are populated, but aren't modified.");
                        li.setAttribute("class", "pass-false");
                        ul.appendChild(li);
                    }
                }
                if (valid === true) {
                    modify.disabled = false;
                } else {
                    modify.disabled = true;
                }
                old.parentNode.insertBefore(ul, old);
                old.parentNode.removeChild(old);
            },
            validateVariables: function dashboard_composeValidateVariables(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                    value:string = target.value,
                    section:HTMLElement = target.getAncestor("section", "class"),
                    edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement,
                    modify:HTMLButtonElement = section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                    ulOld:HTMLElement = edit.getElementsByTagName("ul")[0],
                    ulNew:HTMLElement = document.createElement("ul"),
                    text = function dashboard_composeValidateVariables_fail(message:string, pass:boolean):void {
                        const li:HTMLElement = document.createElement("li");
                        if (pass === true) {
                            modify.disabled = false;
                        } else {
                            modify.disabled = true;
                        }
                        li.setAttribute("class", `pass-${pass}`);
                        li.appendText(message);
                        ulNew.appendChild(li);
                    },
                    sort = function dashboard_composeValidateVariables_sort(object:store_string):string {
                        const store:store_string = {},
                            keys:string[] = Object.keys(object),
                            len:number = keys.length;
                        let index:number = 0;
                        keys.sort();
                        do {
                            store[keys[index]] = object[keys[index]];
                            index = index + 1;
                        } while (index < len);
                        return JSON.stringify(store);
                    };
                let variables:store_string = null;
                ulOld.parentNode.insertBefore(ulNew, ulOld);
                ulOld.parentNode.removeChild(ulOld);
                if (value === "" || (/^\s*\{\s*\}\s*$/).test(value) === true) {
                    text("Supply key/value pairs in JSON format.", false);
                } else {
                    // eslint-disable-next-line no-restricted-syntax
                    try {
                        variables = JSON.parse(value);
                    } catch (e:unknown) {
                        const error:Error = e as Error;
                        text(error.message, false);
                        return;
                    }
                    if (sort(variables) === sort(payload.compose.variables)) {
                        text("Value is valid JSON, but is not modified.", false);
                    } else {
                        text("Input is valid JSON format.", true);
                    }
                }
            }
        },
        message:module_message = {
            receiver: function dashboard_messageReceiver(event:websocket_event):void {
                if (typeof event.data === "string") {
                    const message_item:socket_data = JSON.parse(event.data);
                    if (message_item.service === "dashboard-payload" && loaded === false) {
                        payload = message_item.data as transmit_dashboard;
                        // populate log data
                        payload.logs.forEach(function dashboard_messageReceiver_logsEach(item:services_dashboard_status):void {
                            log(item);
                        });
                        if (loaded === false) {
                            loaded = true;
                            log({
                                action: "activate",
                                configuration: null,
                                message: "Dashboard browser connection online.",
                                status: "informational",
                                time: Date.now(),
                                type: "log"
                            });
                        }
                        // populate docker containers
                        compose.init();
                        // populate server list
                        server.list();
                        // port data from nmap
                        ports.external(payload.ports);
                        // port data from application
                        ports.internal();
                        // start the terminal
                        terminal.init();
                    } else if (message_item.service === "dashboard-status") {
                        const data:services_dashboard_status = message_item.data as services_dashboard_status,
                            socket_destroy = function dashboard_messageReceiver_socketDestroy(hash:string):void {
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
                            };
                        if (data.type !== "port" && data.type !== "socket" && data.message !== "Container status refreshed.") {
                            log(data);
                        }
                        if (data.status === "error") {
                            if (data.type === "socket") {
                                const config:services_socket = data.configuration as services_socket;
                                socket_destroy(config.hash);
                            }
                        } else {
                            if (data.type === "server") {
                                const config:services_server = data.configuration as services_server,
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
                                } else if (data.action === "add" && payload.servers[config.name] === undefined) {
                                    payload.servers[config.name] = {
                                        config: config,
                                        sockets: [],
                                        status: {
                                            open: 0,
                                            secure: 0
                                        }
                                    };
                                    const names:string[] = Object.keys(payload.servers),
                                        ul_current:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                                        ul:HTMLElement = (ul_current === undefined)
                                            ? document.createElement("ul")
                                            : ul_current;
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
                                        ul.appendChild(common.title(config.name, "server"));
                                    } else if (names[0] === config.name) {
                                        ul.insertBefore(common.title(config.name, "server"), ul.firstChild);
                                    } else {
                                        do {
                                            index = index - 1;
                                            if (names[index] === config.name) {
                                                ul.insertBefore(common.title(config.name, "server"), ul.childNodes[index - 1]);
                                                break;
                                            }
                                        } while (index > 0);
                                    }
                                } else if (data.action === "activate") {
                                    payload.servers[config.name].status = config.ports;
                                    const color:type_activation_status = common.color(config.name, "server");
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
                                                oldPorts.parentNode.insertBefore(server.activePorts(config.name), oldPorts);
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
                                                oldPorts.parentNode.insertBefore(server.activePorts(config.name), oldPorts);
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
                                } else if (data.action === "modify") {
                                    const list:HTMLElement = document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                                        items:HTMLCollectionOf<HTMLElement> = list.getElementsByTagName("li");
                                    let index:number = items.length;
                                    payload.servers[config.name].config = config;
                                    if (index > 0) {
                                        do {
                                            index = index - 1;
                                            if (items[index].getAttribute("data-name") === config.name) {
                                                list.insertBefore(common.title(config.name, "server"), items[index]);
                                                list.removeChild(items[index]);
                                                break;
                                            }
                                        } while (index > 0);
                                    }
                                }
                                ports.internal();
                            } else if (data.type === "socket") {
                                const config:services_socket = data.configuration as services_socket;
                                if (data.action === "add") {
                                    socket_destroy(config.hash);
                                    server.socket_add(config);
                                } else if (data.action === "destroy") {
                                    socket_destroy(config.hash);
                                }
                                ports.internal();
                            } else if (data.type === "port") {
                                ports.external(data.configuration as external_ports);
                            } else if (data.type === "compose-containers") {
                                if (data.action === "destroy") {
                                    compose.destroyContainer(data.configuration as services_docker_compose);
                                } else {
                                    compose.container(data.configuration as services_docker_compose);
                                }
                                ports.internal();
                            } else if (data.type === "compose-variables") {
                                const store:store_string = data.configuration as store_string;
                                payload.compose.variables = store;
                                compose.list("variables");
                            }
                        }
                    }
                }
            },
            send: function dashboard_messageSend(action:type_dashboard_action, config:services_docker_compose|services_server|store_string, service:type_service):void {
                const payload:services_dashboard_action = {
                        action: action,
                        configuration: config as services_server
                    },
                    message = {
                        data: payload,
                        service: service
                    };
                socket.queue(JSON.stringify(message));
            }
        },
        ports:module_port = {
            external: function dashboard_portsExternal(input:external_ports):void {
                if (ports_external === true) {
                    return;
                }
                const servers:string[] = Object.keys(payload.servers),
                    compose:string[] = (payload.compose === null)
                        ? null
                        : Object.keys(payload.compose.containers),
                    loop_ports = function dashboard_portsExternal(number:number):void {
                        let indexPorts:number = input.list.length;
                        if (indexPorts > 0) {
                            do {
                                indexPorts = indexPorts - 1;
                                if (number === input.list[indexPorts][0]) {
                                    input.list.splice(indexPorts, 1);
                                }
                            } while (indexPorts > 0);
                        }
                    },
                    portElement:HTMLElement = document.getElementById("ports"),
                    updated:HTMLElement = portElement.getElementsByClassName("updated")[0] as HTMLElement,
                    tbody_old:HTMLElement = portElement.getElementsByTagName("tbody")[0],
                    tbody_new:HTMLElement = document.createElement("tbody");
                if (input.list[0] === null) {
                    if (updated.style.display !== "none") {
                        const ulNew:HTMLElement = document.createElement("ul"),
                            section:HTMLElement = portElement.getElementsByClassName("section")[0] as HTMLElement,
                            ulOld:HTMLElement = section.getElementsByTagName("ul")[0],
                            p:HTMLElement = section.getElementsByTagName("p")[0],
                            em:HTMLElement = document.createElement("em"),
                            text:string[] = input.list[1][1].split("'");
                        let li:HTMLElement = document.createElement("li"),
                            code:HTMLElement = document.createElement("code"),
                            para:HTMLElement = document.createElement("p");
                        if (ulOld !== undefined) {
                            ulOld.parentNode.removeChild(ulOld);
                        }
                        p.textContent = text[0];
                        em.textContent = text[1];
                        p.appendChild(em);
                        p.appendText(`${text[2]} Download and install NMap with these commands:`);
                        para.appendText("Windows ");
                        code.appendText("winget install -e --id Insecure.Nmap");
                        para.appendChild(code);
                        li.appendChild(para);
                        ulNew.appendChild(li);
                        li = document.createElement("li");
                        code = document.createElement("code");
                        para = document.createElement("p");
                        para.appendText("Debian Linux ");
                        code.appendText("sudo apt-get install nmap");
                        para.appendChild(code);
                        li.appendChild(para);
                        ulNew.appendChild(li);
                        p.parentNode.insertBefore(ulNew, p.nextSibling);
                        tbody_old.parentNode.style.display = "none";
                        updated.style.display = "none";
                        ports_external = true;
                    }
                    return;
                }
                let indexServers:number = servers.length,
                    indexPorts:number = input.list.length,
                    indexKeys:number = 0,
                    keys:string[] = null,
                    tr:HTMLElement = null,
                    td:HTMLElement = null;
                if (indexPorts < 1) {
                    return;
                }

                // per server
                if (indexServers > 0) {
                    do {
                        indexPorts = input.list.length;
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
                                if (
                                    payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]] !== null &&
                                    typeof payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][0] === "string" &&
                                    payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][0] !== ""
                                ) {
                                    loop_ports(payload.servers[servers[indexServers]].config.redirect_domain[keys[indexKeys]][1]);
                                }
                            } while (indexKeys > 0);
                        }
                    } while (indexServers > 0);
                }
                // per container
                indexServers = (compose === null)
                    ? 0
                    : compose.length;
                if (indexServers > 0) {
                    do {
                        indexServers = indexServers - 1;
                        indexKeys = payload.compose.containers[compose[indexServers]].ports.length;
                        if (indexKeys > 0 && payload.compose.containers[compose[indexServers]].status.indexOf("Up ") === 0) {
                            do {
                                indexKeys = indexKeys - 1;
                                loop_ports(payload.compose.containers[compose[indexServers]].publishers[indexKeys].PublishedPort);
                            } while (indexKeys > 0);
                        }
                    } while (indexServers > 0);
                }
                indexPorts = 0;
                indexKeys = input.list.length;
                if (indexKeys > 0) {
                    do {
                        tr = document.createElement("tr");
                        td = document.createElement("td");
                        td.appendText(input.list[indexPorts][0].toString());
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(input.list[indexPorts][1].toUpperCase());
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.appendText(input.list[indexPorts][2]);
                        tr.appendChild(td);
                        tbody_new.appendChild(tr);
                        indexPorts = indexPorts + 1;
                    } while (indexPorts < indexKeys);
                    tbody_old.parentNode.appendChild(tbody_new);
                    tbody_old.parentNode.removeChild(tbody_old);
                }
                updated.getElementsByTagName("em")[0].textContent = input.time.dateTime(true);
            },
            internal: function dashboard_portsInternal():void {
                const output:[number, string, string, string, string][] = [],
                    tbody_old:HTMLElement = document.getElementById("ports").getElementsByTagName("tbody")[1],
                    tbody_new:HTMLElement = document.createElement("tbody"),
                    servers:string[] = Object.keys(payload.servers),
                    compose:string[] = (payload.compose === null)
                        ? null
                        : Object.keys(payload.compose.containers);
                let indexServers:number = servers.length,
                    indexPorts:number = 0,
                    tr:HTMLElement = null,
                    td:HTMLElement = null;
                // per server
                ports.external(payload.ports);
                if (indexServers > 0) {
                    do {
                        indexServers = indexServers - 1;
                        if (typeof payload.servers[servers[indexServers]].status.open === "number" && payload.servers[servers[indexServers]].status.open > 0) {
                            output.push([payload.servers[servers[indexServers]].status.open, "TCP", "server", servers[indexServers], "Open server port"]);
                        }
                        if (typeof payload.servers[servers[indexServers]].status.secure === "number" && payload.servers[servers[indexServers]].status.secure > 0) {
                            output.push([payload.servers[servers[indexServers]].status.secure, "TCP", "server", servers[indexServers], "Secure server port"]);
                        }
                    } while (indexServers > 0);
                }

                // per container
                indexServers = (compose === null)
                    ? 0
                    : compose.length;
                if (indexServers > 0) {
                    do {
                        indexServers = indexServers - 1;
                        indexPorts = payload.compose.containers[compose[indexServers]].ports.length;
                        if (indexPorts > 0 && payload.compose.containers[compose[indexServers]].status.indexOf("Up ") === 0) {
                            do {
                                indexPorts = indexPorts - 1;
                                output.push([payload.compose.containers[compose[indexServers]].publishers[indexPorts].PublishedPort, payload.compose.containers[compose[indexServers]].publishers[indexPorts].Protocol.toUpperCase(), "container", compose[indexServers], "Container port"]);
                            } while (indexPorts > 0);
                        }
                    } while (indexServers > 0);
                }
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
            }
        },
        server:module_server = {
            activePorts: function dashboard_serverActivePorts(name_server:string):HTMLElement {
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
                        portItem.appendText(`Open - ${ports.open} (TCP)`);
                    }
                    portList.appendChild(portItem);
                    portItem = document.createElement("li");
                    if (ports.secure === 0) {
                        portItem.appendText("Secure - offline");
                    } else {
                        portItem.appendText(`Secure - ${ports.secure} (TCP)`);
                    }
                    portList.appendChild(portItem);
                } else if (encryption === "open") {
                    if (ports.open === 0) {
                        portItem.appendText("Open - offline");
                    } else {
                        portItem.appendText(`Open - ${ports.open} (TCP)`);
                    }
                    portList.appendChild(portItem);
                } else {
                    if (ports.secure === 0) {
                        portItem.appendText("Secure - offline");
                    } else {
                        portItem.appendText(`Secure - ${ports.secure} (TCP)`);
                    }
                    portList.appendChild(portItem);
                }
                div.appendChild(portList);
                return div;
            },
            create: function dashboard_serverCreate(event:MouseEvent):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                common.details(event);
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
            list: function dashboard_serverList():void {
                const list:string[] = Object.keys(payload.servers),
                    list_old:HTMLElement = server.nodes.list,
                    list_new:HTMLElement = document.createElement("ul"),
                    total:number = list.length;
                let index:number = 0,
                    indexSocket:number = 0,
                    totalSocket:number = 0;
                server.nodes.server_new.onclick = server.create;
                server.nodes.server_definitions.onclick = server.definitions;
                list_new.setAttribute("class", list_old.getAttribute("class"));
                list.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                    if (a < b) {
                        return -1;
                    }
                    return 1;
                });
                do {
                    list_new.appendChild(common.title(list[index], "server"));
                    totalSocket = payload.servers[list[index]].sockets.length;
                    if (totalSocket > 0) {
                        indexSocket = 0;
                        do {
                            server.socket_add(payload.servers[list[index]].sockets[indexSocket]);
                            indexSocket = indexSocket + 1;
                        } while (indexSocket < totalSocket);
                    }
                    index = index + 1;
                } while (index < total);
                list_old.parentNode.insertBefore(list_new, list_old);
                list_old.parentNode.removeChild(list_old);
                server.nodes.list = list_new;
            },
            message: function dashboard_serverMessage(event:MouseEvent): void {
                const target:HTMLElement = event.target,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                    cancel:HTMLElement = edit.getElementsByClassName("server-cancel")[0] as HTMLElement,
                    configuration:services_server = (function dashboard_serverMessage_configuration():services_server {
                        const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                            config:services_server = JSON.parse(textArea.value);
                        config.modification_name = edit.parentNode.getAttribute("data-name");
                        return config;
                    }());
                message.send(action, configuration, "dashboard-server");
                if (cancel === undefined) {
                    edit.parentNode.getElementsByTagName("button")[0].click();
                } else {
                    common.cancel(event);
                    server.nodes.server_new.disabled = false;
                }
            },
            nodes: {
                list: document.getElementById("servers").getElementsByClassName("server-list")[0] as HTMLElement,
                server_definitions: document.getElementById("servers").getElementsByClassName("expand")[0] as HTMLElement,
                server_new: document.getElementById("servers").getElementsByClassName("server-new")[0] as HTMLButtonElement
            },
            socket_add: function dashboard_serverSocketAdd(config:services_socket):void {
                const tbody:HTMLElement = document.getElementById("sockets").getElementsByTagName("tbody")[0],
                    tr:HTMLElement = document.createElement("tr");
                let td:HTMLElement = document.createElement("td");
                if (config.address.local.port === undefined || config.address.remote.port === undefined) {
                    return;
                }
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
                // encrypted
                td = document.createElement("td");
                td.appendText((config.encrypted === true) ? "true" : "false");
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
                            order = function dashboard_serverValidate_disable_order(item:services_server):string {
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
                                        } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "http" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_asset") || config.supported[indexSupported] === "temporary") {
                                            config.supported.splice(indexSupported, 1);
                                        }
                                    } while (indexSupported > 0);
                                }
                            } while (indexActual > 0);
                        }
                        if (config.name === "redirect_domain" || config.name === "redirect_asset") {
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
                    rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "http", "name", "ports", "redirect_asset", "redirect_domain", "temporary"];
                let serverData:services_server = null,
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
                // redirect_asset
                keys({
                    name: "redirect_asset",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "store"
                });
                // redirect_domain
                keys({
                    name: "redirect_domain",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "array"
                });
                // temporary
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
            // https://xtermjs.org/docs/
            events: {
                data: function dashboard_terminalData(event:websocket_event):void {
                    terminal.item.write(event.data);
                },
                firstData: function dashboard_terminalFirstData(event:websocket_event):void {
                    terminal.socket.onmessage = terminal.events.data;
                    terminal.info = JSON.parse(event.data);
                    terminal.nodes.output.setAttribute("data-info", event.data);
                },
                input: function dashboard_terminalInput(input:terminal_input):void {
                    if (terminal.socket.readyState === 1) {
                        terminal.socket.send(input.key);
                    }
                },
                selection: function dashboard_terminalSelection():void {
                    if (typeof ClipboardItem !== "undefined") {
                        const clip:ClipboardItem = new ClipboardItem({["text/plain"]: terminal.item.getSelection()});
                        navigator.clipboard.write([clip]);
                    }
                }
            },
            id: null,
            info: null,
            init: function dashboard_terminalItem():void {
                if (typeof Terminal === "undefined") {
                    setTimeout(dashboard_terminalItem, 100);
                } else {
                    const encryption:type_encryption = (location.protocol === "https")
                            ? "secure"
                            : "open",
                        scheme:"ws"|"wss" = (encryption === "open")
                            ? "ws"
                            : "wss",
                        id:string = `dashboard-terminal-${Math.random() + Date.now()}`;
                    terminal.id = id;
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
                    terminal.item.write("Terminal emulator pending connection...\r\n");
                    terminal.item.onSelectionChange(terminal.events.selection);
                    // client-side terminal is ready, so alert the backend to initiate a pseudo-terminal
                    terminal.socket = new WebSocket(`${scheme}://${location.host}`, [id]);
                    terminal.socket.onmessage = terminal.events.firstData;
                    if (typeof ClipboardItem === "undefined") {
                        const em:HTMLElement = document.getElementById("terminal").getElementsByClassName("tab-description")[0].getElementsByTagName("em")[0] as HTMLElement;
                        if (em !== undefined) {
                            em.parentNode.removeChild(em);
                        }
                    }
                }
            },
            item: null,
            nodes: {
                output: document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement
            },
            socket: null
        },
        socket:socket_object = core({
            close: function dashboard_socketClose():void {
                const status:HTMLElement = document.getElementById("connection-status");
                if (log !== undefined && status !== null && status.getAttribute("class") === "connection-online") {
                    log({
                        action: "activate",
                        configuration: null,
                        message: "Dashboard browser connection offline.",
                        status: "error",
                        time: Date.now(),
                        type: "log"
                    });
                }
                baseline();
                setTimeout(function core_close_delay():void {
                    socket.invoke();
                }, 10000);
            },
            message: message.receiver,
            open: function dashboard_socketOpen(event:Event):void {
                const target:WebSocket = event.target as WebSocket,
                    status:HTMLElement = document.getElementById("connection-status"),
                    payload:socket_data = {
                        data: null,
                        service: "dashboard-payload"
                    };
                if (status !== null ) {
                    status.getElementsByTagName("strong")[0].textContent = "Online";
                    status.setAttribute("class", "connection-online");
                }
                target.send(JSON.stringify(payload));
                socket.socket = target;
                if (socket.queueStore.length > 0) {
                    do {
                        socket.socket.send(socket.queueStore[0]);
                        socket.queueStore.splice(0, 1);
                    } while (socket.queueStore.length > 0);
                }
            },
            type: "dashboard"
        });

    // start up logic for browser
    {
        const navigation = function dashboard_navigation(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    buttons:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("nav")[0].getElementsByTagName("button");
                let index:number = sections.length;
                section = target.getAttribute("data-section") as type_dashboard_sections;
                do {
                    index = index - 1;
                    document.getElementById(sections[index]).style.display = "none";
                } while (index > 0);
                index = buttons.length;
                do {
                    index = index - 1;
                    buttons[index].removeAttribute("class");
                } while (index > 0);
                document.getElementById(section).style.display = "block";
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
    }
};

export default dashboard;