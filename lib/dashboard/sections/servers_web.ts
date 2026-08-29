

import dashboard from "../dashboard.ts";

const ui_servers_web = function ui_servers_web():void {
    const servers_web:section_servers_web = {
        events: {
            message: function dashboard_sections_serversWeb_message(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                    cancel:HTMLElement = edit.getElementsByClassName("server-cancel")[0] as HTMLElement,
                    configuration:supplemental_server_config = (function dashboard_serverMessage_configuration():supplemental_server_config {
                        const textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                            config:supplemental_server_config = JSON.parse(textArea.value);
                        if (dashboard.global.payload.server[config.id] !== undefined) {
                            dashboard.global.payload.server[config.id].config.encryption = config.encryption;
                        }
                        return config;
                    }()),
                    data:services_server_action = {
                        action: action,
                        server: configuration
                    };
                dashboard.message.send({data: data, service: "services_server_action"});
                if (cancel === undefined) {
                    edit.parentNode.getElementsByTagName("button")[0].click();
                } else {
                    dashboard.shared_services.cancel(event);
                    dashboard.sections["servers-web"].nodes.service_new.disabled = false;
                }
            },
            validate: function dashboard_sections_serversWeb_validate(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                    listItem:HTMLElement = target.getAncestor("li", "tag"),
                    id:string = listItem.dataset.id,
                    value:string = target.value,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                    ul:HTMLElement = summary.getElementsByTagName("ul")[0],
                    populate = function dashboard_sections_serversWeb_validate_populate(pass:boolean, message:string):void {
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
                    disable = function dashboard_sections_serversWeb_validate_disable():void {
                        const save:HTMLButtonElement = (id === undefined)
                                ? listItem.getElementsByClassName("server-add")[0] as HTMLButtonElement
                                : listItem.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                            order = function dashboard_sections_serversWeb_validate_disable_order(item:supplemental_server_config):string {
                                const keys:type_server_property[] = Object.keys(item).sort() as type_server_property[],
                                    output:object = {},
                                    len:number = keys.length;
                                let index:number = 0;
                                do {
                                    // @ts-expect-error - warns on implied any, but we know that the key values are extracted from the same object
                                    output[keys[index]] = item[keys[index]];
                                    index = index + 1;
                                } while (index < len);
                                return JSON.stringify(output);
                            };
                        if (failures > 0) {
                            const plural:string = (failures === 1)
                                ? ""
                                : "s";
                            save.disabled = true;
                            populate(false, `The server configuration contains ${failures} violation${plural}.`);
                        } else if (id !== null && id !== undefined && order(serverData) === order(dashboard.global.payload.server[id].config)) {
                            save.disabled = true;
                            populate(false, "The server configuration is valid, but not modified.");
                        } else {
                            save.disabled = false;
                            populate(true, "The server configuration is valid.");
                        }
                    },
                    stringArray = function dashboard_sections_serversWeb_validate_stringArray(required:boolean, name:string, property:string[]):boolean {
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
                        }
                        return required;
                    },
                    key_test = function dashboard_sections_serversWeb_validate_keyTest(config:config_validate_serverKeys):void {
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
                                    (config.type === "string" && typeof value !== "string") ||
                                    (config.type === "number" && typeof value !== "number")
                                ) && value !== null) {
                                    populate(false, `Property '${keys[indexActual]}' of '${config.name}' is not of type: ${config.type}.`);
                                    pass = false;
                                } else if (config.name === "ports" && typeof value === "number" && value > 65535) {
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
                                    let upper:string = null,
                                        key:string = null;
                                    do {
                                        indexSupported = indexSupported - 1;
                                        upper = config.supported[indexSupported].toUpperCase();
                                        if (keys[indexActual] === config.supported[indexSupported] || (keys[indexActual] === upper && config.name === "method")) {
                                            if (config.name === "method") {
                                                key = (keys[indexActual] === upper)
                                                    ? upper
                                                    : config.supported[indexSupported];
                                                if (typeof serverData.method[key as "delete"].address !== "string") {
                                                    populate(false, `Property method.${key}.address must be a string.`);
                                                } else {
                                                    delete serverData.method[key as "delete"].address;
                                                }
                                                if (typeof serverData.method[key as "delete"].port !== "number" || serverData.method[key as "delete"].port > 65535) {
                                                    populate(false, `Property method.${key}.port must be an integer less than 65536.`);
                                                } else {
                                                    delete serverData.method[key as "delete"].port;
                                                }
                                                delete serverData.method[key as "delete"];
                                                if (keys.includes("delete") === true) {
                                                    keys.splice(keys.indexOf("delete"), 1);
                                                }
                                                if (keys.length > 0) {
                                                    populate(false, `Property method.${key} contains unsupported child properties.`);
                                                }
                                            }
                                            keys.splice(indexActual, 1);
                                            config.supported.splice(indexSupported, 1);
                                            indexActual = indexActual - 1;
                                        } else if (config.name === "ports" && ((serverData.encryption === "open" && config.supported[indexSupported] === "secure") || (serverData.encryption === "secure" && config.supported[indexSupported] === "open"))) {
                                            config.supported.splice(indexSupported, 1);
                                        } else if (config.name === null && keys.includes(config.supported[indexSupported]) === false && (config.supported[indexSupported] === "block_list" || config.supported[indexSupported] === "domain_local" || config.supported[indexSupported] === "method" || config.supported[indexSupported] === "redirect_domain" || config.supported[indexSupported] === "redirect_asset") || config.supported[indexSupported] === "single_socket" || config.supported[indexSupported] === "temporary") {
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
                    rootProperties:string[] = ["activate", "block_list", "domain_local", "encryption", "id", "method", "message_segmentation", "mutual_tls", "name", "ports", "redirect_asset", "redirect_domain", "single_socket", "temporary", "upgrade"];
                let serverData:supplemental_server_config = null,
                    failures:number = 0;
                ul.textContent = "";
                summary.style.display = "block";
                // eslint-disable-next-line no-restricted-syntax
                try {
                    serverData = JSON.parse(value);
                } catch(e:unknown) {
                    const error:Error = e as Error;
                    populate(false, error.message);
                    disable();
                    return;
                }
                // activate
                if (typeof serverData.activate === "boolean") {
                    populate(true, "Required property 'activate' has boolean type value.");
                } else {
                    populate(false, "Required property 'activate' expects a boolean type value.");
                }
                // block_list
                key_test({
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
                // id
                if (typeof serverData.id === "string") {
                    populate(true, "Required property 'id' is a read only string.");
                } else {
                    populate(false, "Required property 'id' must be a string.");
                }
                // message_segmentation
                if (typeof serverData.message_segmentation === "number" && Math.floor(serverData.message_segmentation) > 0) {
                    populate(true, "Required property 'message_segmentation' is present with a positive numeric value.");
                } else {
                    populate(false, "Required property 'message_segmentation' must have a numeric value greater than 0.");
                }
                // method
                key_test({
                    name: "method",
                    required_name: false,
                    required_property: false,
                    supported: ["delete", "patch", "post", "put"],
                    type: "method"
                });
                // mutual_tls
                if (typeof serverData.mutual_tls === "boolean") {
                    populate(true, "Required property 'mutual_tls' is present with either a 'true' or 'false' boolean value.");
                } else {
                    populate(false, "Required property 'mutual_tls' must have a boolean type value or 'true' or 'false'.");
                }
                // name
                if (typeof serverData.name === "string" && serverData.name !== "") {
                    if (serverData.name === "new_server") {
                        populate(null, "The name 'new_server' is a default placeholder. A more unique name is preferred.");
                    } else {
                        populate(true, "Required property 'name' is present with a value.");
                    }
                } else {
                    populate(false, "Required property 'name' is not assigned an appropriate string value.");
                }
                // ports
                if (serverData.encryption === "open" && serverData.ports.secure === undefined) {
                    serverData.ports.secure = 0;
                }
                if (serverData.encryption === "secure" && serverData.ports.open === undefined) {
                    serverData.ports.open = 0;
                }
                if (
                    (serverData.ports.open === 0 && (serverData.encryption === "both" || serverData.encryption === "open")) ||
                    (serverData.ports.secure === 0 && (serverData.encryption === "both" || serverData.encryption === "secure"))
                ) {
                    populate(null, "A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred.");
                }
                key_test({
                    name: "ports",
                    required_name: true,
                    required_property: true,
                    supported: ["open", "secure"],
                    type: "number"
                });
                // redirect_asset
                key_test({
                    name: "redirect_asset",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "store"
                });
                // redirect_domain
                key_test({
                    name: "redirect_domain",
                    required_name: false,
                    required_property: false,
                    supported: [],
                    type: "array"
                });
                // single_socket
                if (typeof serverData.single_socket === "boolean") {
                    populate(true, "Optional property 'single_socket' has boolean type value.");
                } else if (serverData.single_socket === null || serverData.single_socket === undefined) {
                    populate(true, "Optional property 'single_socket' is either null or undefined.");
                } else {
                    populate(false, "Optional property 'single_socket' expects a boolean type value.");
                }
                // temporary
                if (typeof serverData.temporary === "boolean") {
                    populate(true, "Optional property 'temporary' has boolean type value.");
                } else if (serverData.temporary === null || serverData.temporary === undefined) {
                    populate(true, "Optional property 'temporary' is either null or undefined.");
                } else {
                    populate(false, "Optional property 'temporary' expects a boolean type value.");
                }
                // upgrade
                if (typeof serverData.upgrade === "boolean") {
                    populate(true, "Property 'upgrade' has boolean type value.");
                } else {
                    populate(false, "Property 'upgrade' expects a boolean type value.");
                }
                // parent properties
                key_test({
                    name: null,
                    required_name: false,
                    required_property: true,
                    supported: rootProperties,
                    type: null
                });
                disable();
            }
        },
        init: function dashboard_sections_serversWeb_init():void {
            dashboard.sections["servers-web"].receive({
                data: dashboard.global.payload.server,
                service: "services_server_update"
            });
        },
        nodes: {
            list: document.getElementById("servers-web").getElementsByClassName("server-list")[0] as HTMLElement,
            service_new: document.getElementById("servers-web").getElementsByClassName("server-new")[0] as HTMLButtonElement
        },
        receive: function dashboard_sections_serversWeb_receive(socket_data:socket_data):void {
            const data:services_server_update = socket_data.data as services_server_update,
                list:string[] = Object.keys(data),
                list_node:HTMLElement = dashboard.sections["servers-web"].nodes.list,
                total:number = list.length;
            let index:number = 0;
            dashboard.global.payload.server = data;
            dashboard.sections["servers-web"].nodes.service_new.onclick = dashboard.shared_services.create;
            list.sort(function dashboard_sections_serversWeb_receive_sort(a:string, b:string):-1|1 {
                if (a < b) {
                    return -1;
                }
                return 1;
            });
            list_node.textContent = "";
            if (total > 0) {
                do {
                    if (dashboard.global.payload.server[list[index]] !== undefined) {
                        list_node.appendChild(dashboard.shared_services.title(dashboard.global.payload.server[list[index]].config.id, "server"));
                    }
                    index = index + 1;
                } while (index < total);
            }
        },
        tools: {
            activePorts: function dashboard_sections_serversWeb_activePorts(id:boolean|string):HTMLElement {
                const div:HTMLElement = document.createElement("div"),
                    h5_ports:HTMLElement = document.createElement("h5"),
                    h5_crt:HTMLElement = document.createElement("h5"),
                    h5_pfx:HTMLElement = document.createElement("h5"),
                    portList:HTMLElement = document.createElement("ul"),
                    encryption:type_encryption = dashboard.global.payload.server[id as string].config.encryption,
                    ports:core_server_ports = dashboard.global.payload.server[id as string].ports,
                    cert = function dashboard_sections_serversWeb_activePorts_certs(type:"crt"|"pfx"):void {
                        const p:HTMLElement = document.createElement("p"),
                            code:HTMLElement = document.createElement("code");
                        code.textContent = dashboard.global.payload.server[id as string].certificates_client[type];
                        p.appendChild(code);
                        div.appendChild(p);
                    };
                let portItem:HTMLElement = document.createElement("li");
                h5_ports.appendText("Active Ports");
                h5_crt.appendText("Client Certificate in crt format (utf-8)");
                h5_pfx.appendText("Client Certificate in pfx format (base64, must be converted to a binary buffer when saving to a file)");
                div.appendChild(h5_ports);
                div.setAttribute("class", "active-ports");
                portList.setAttribute("class", "container-ports");
                
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
                div.appendChild(h5_crt);
                cert("crt");
                div.appendChild(h5_pfx);
                cert("pfx");
                return div;
            }
        }
    };
    dashboard.sections["servers-web"] = servers_web;
};

export default ui_servers_web;