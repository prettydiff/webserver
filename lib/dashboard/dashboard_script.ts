
import core from "../browser/core.js";

const dashboard = function dashboard():void {
    // 1. test for port conflicts when creating servers from the dashboard
    // 2. multiple instances and load balancing
    // 3. page for arbitrary http requests and socket connections
    // 4. server type as an option (type of protocol/service)


    const socketOpen = function dashboard_socketOpen():void {},
        socketMessage = function dashboard_socketMessage():void {}, 
        socket:browserSocket = core(socketOpen, socketMessage),
        payload:transmit_dashboard = JSON.parse(document.getElementsByTagName("input")[0].value),
        server_create:HTMLButtonElement = document.getElementsByClassName("server-create")[0] as HTMLButtonElement,
        serverTitle = function dashboard_serverTitle(name_server:string):HTMLElement {
            const li:HTMLElement = document.createElement("li"),
                h4:HTMLElement = document.createElement("h4"),
                expand:HTMLButtonElement = document.createElement("button"),
                span:HTMLElement = document.createElement("span"),
                name:string = (name_server === null)
                    ? "new_server"
                    : name_server;
            expand.appendText(name);
            if (name_server !== null) {
                span.appendText("Expand");
                span.setAttribute("class", "expand");
                expand.appendChild(span);
                expand.onclick = server.details;
                li.setAttribute("data-name", name);
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
                    create:HTMLButtonElement = servers.getElementsByClassName("server-create")[0] as HTMLButtonElement;
                li.parentNode.removeChild(li);
                create.disabled = false;
            },
            create: function dashboard_serverCreate(event:type_user_event):void {
                const button:HTMLButtonElement = event.target as HTMLButtonElement;
                button.disabled = true;
                server.details(event);
            },
            details: function dashboard_serverDetails(event:type_user_event):void {
                let newFlag:boolean = false;
                const target:HTMLElement = (function dashboard_serverDetails_target():HTMLElement {
                        const el:HTMLElement = event.target;
                        if (el.getAttribute("class") === "server-create") {
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
                                output:string[] = [
                                    "{",
                                    "\"block_list\": {"
                                ],
                                serverData:server = (newFlag === true)
                                    ? {
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
                                    : payload.servers[name_server];
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
                                output.push(`"encryption": "both",`);
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
                    createServer:boolean = (target.getAttribute("class") === "server-create");
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
                } else {
                    p.removeChild(p.getElementsByClassName("server-edit")[0]);
                }
                save.appendText("🖪 Save");
                save.setAttribute("class", "server-save");
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
                    div:HTMLElement = document.createElement("div");
                let index:number = list.length;
    
                if (list_old !== undefined) {
                    tag.removeChild(list_old);
                }
                list.sort(function dashboard_serverList_sort(a:string, b:string):-1|1 {
                    if (a > b) {
                        return -1;
                    }
                    return 1;
                });
                do {
                    index = index - 1;
                    ul.appendChild(serverTitle(list[index]));
                } while (index > 0);
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
                    action:"destroy"|"save" = target.getAttribute("class").replace("server-", "") as "destroy"|"save",
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
                        service: `dashboard`,
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
                            li.setAttribute("class", `pass-warn`);
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
                        const save:HTMLButtonElement = listItem.getElementsByClassName("server-save")[0] as HTMLButtonElement;
                        summary.removeChild(summary.getElementsByTagName("ul")[0]);
                        summary.appendChild(ul);
                        if (failures > 0) {
                            save.disabled = true;const plural:string = (failures === 1)
                                ? ""
                                : "s";
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
                                : property.length,
                            requirement:string = (required === true)
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
                                : "Optional";
                        let keys:string[] = (config.name === null)
                                ? Object.keys(serverData)
                                : (serverData[config.name] === null || serverData[config.name] === undefined)
                                    ? []
                                    : Object.keys(serverData[config.name]),
                            value:string = null,
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
                                // @ts-ignore - The following line forces an implicit any, but we don't care because we are only evaluating for data type not value or assignment
                                value = serverData[config.name][keys[indexActual]];
                                if ((
                                    (config.type === "array" && Array.isArray(value) === false) ||
                                    ((config.type === "string" || config.type === "path") && typeof value !== "string") ||
                                    (config.type === "number" && typeof value !== "number")
                                ) && value !== null) {
                                    populate(false, `Property '${keys[indexActual]}' of '${config.name}' is not of type: ${config.type}.`);
                                    pass = false;
                                } else if (config.type === "path" && serverData.name !== name_server && pathReg.test(value) === true) {
                                    populate(null, `Property '${keys[indexActual]}' of '${config.name}' is a file system path that contains a directory references to a prior or default server name.`);
                                    // @ts-ignore - The following line complains about comparing a string to a number when the value is not actually a string
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
                                        // @ts-ignore - The last argument expects a string[] but variable value is superficially typed as string
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
                                            // @ts-ignore - The following line forces an implicit any, but we expect it to be a string value on a string store as a child of a larger string store
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
                                    populate(true, `Configuration contains only optional property names and all required primary property names.`);
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
                try {
                    serverData = JSON.parse(value);
                } catch (e:any) {
                    const error:Error = e as Error;
                    populate(false, error.message);
                    disable();
                    return;
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
                        populate(true, "Required property 'name' has an appropriate value.")
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
                    supported: ["block_list", "domain_local", "encryption", "http", "name", "path", "ports", "redirect_domain", "redirect_internal"],
                    type: null
                });
                disable();
            }
        };

    socket.call();
    server_create.onclick = server.create;
    server.list();
};

export default dashboard;