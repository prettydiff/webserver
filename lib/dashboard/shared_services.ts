
import dashboard from "./dashboard.ts";
// cspell: words PGID, PUID

const ui_shared_services = function ui_shared_services():void {
    const shared_services:dashboard_shared_services = {
        // back out of server and docker compose editing
        cancel: function dashboard_shareServices_cancel(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                edit:HTMLElement = target.getAncestor("edit", "class"),
                create:HTMLButtonElement = (dashboard.global.section === "servers-web")
                    ? dashboard.sections[dashboard.global.section as "servers-web"].nodes.service_new
                    : dashboard.sections[dashboard.global.section as "compose-containers"].nodes.new_variable;
            edit.parentNode.removeChild(edit);
            create.disabled = false;
        },
        // server and docker compose status colors
        color: function dashboard_shareServices_color(id:string, type:type_dashboard_list):type_activation_status {
            if (id === undefined) {
                return [null, "new"];
            }
            if (type === "container") {
                if (dashboard.global.payload.compose.containers[id].state === "running") {
                    return ["green", "online"];
                }
                return ["red", "offline"];
            }
            if (dashboard.global.payload.server[id].config.activate === false) {
                return [null, "deactivated"];
            }
            const encryption:type_encryption = dashboard.global.payload.server[id].config.encryption,
                ports:core_server_ports = dashboard.global.payload.server[id].ports;
            if (ports === undefined) {
                return ["red", "offline"];
            }
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
            return ["red", "offline"];
        },
        create: function dashboard_shareServices_create(event:MouseEvent):void {
            const button:HTMLButtonElement = event.target as HTMLButtonElement;
            button.disabled = true;
            dashboard.shared_services.details(event);
        },
        // server and docker compose instance details
        details: function dashboard_shareServices_details(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                classy:string = target.getAttribute("class"),
                newFlag:boolean = (classy === "server-new" || classy === "compose-container-new"),
                serverItem:HTMLElement = (newFlag === true)
                    ? dashboard.sections[dashboard.global.section as "servers-web"].nodes.list
                    : target.getAncestor("li", "tag"),
                titleButton:HTMLElement = serverItem.getElementsByTagName("button")[0],
                expandButton:HTMLElement = (newFlag === true)
                    ? null
                    : titleButton.getElementsByClassName("expand")[0] as HTMLElement,
                expandText:string = (newFlag === true)
                    ? ""
                    : expandButton.textContent;
            if (newFlag === true || expandText === "Expand") {
                let p:HTMLElement = null;
                const id:string = serverItem.dataset.id,
                    details:HTMLElement = document.createElement("div"),
                    label:HTMLElement = document.createElement("label"),
                    textArea:HTMLTextAreaElement = document.createElement("textarea"),
                    span:HTMLElement = document.createElement("span"),
                    value:string = (dashboard.global.section === "servers-web")
                        ? (function dashboard_shareServices_details_serversWeb():string {
                            const array = function dashboard_shareServices_details_serversWeb_array(indent:boolean, name:string, property:string[]):void {
                                    const ind:string = (indent === true)
                                        ? "    "
                                        : "";
                                    if (property === null || property === undefined || property.length < 1) {
                                        output.push(`${ind}"${name}": [],`);
                                    } else {
                                        output.push(`${ind}"${name}": [`);
                                        property.forEach(function dashboard_shareServices_details_serversWeb_array_each(value:string):void {
                                            output.push(`${ind}    "${sanitize(value)}",`);
                                        });
                                        output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                                        output.push(`${ind}],`);
                                    }
                                },
                                object = function dashboard_shareServices_details_serversWeb_object(property:"redirect_asset"|"redirect_domain"):void {
                                    const list:string[] = Object.keys(serverData[property]),
                                        total:number = list.length,
                                        objValue = function dashboard_shareServices_details_serversWeb_object_value(input:string):void {
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
                                methods = function dashboard_shareServices_details_serversWeb_methods():void {
                                    if (serverData.method !== null && serverData.method !== undefined) {
                                        const keys:string[] = Object.keys(serverData.method),
                                            len:number = keys.length;
                                        keys.sort();
                                        if (len > 0) {
                                            output.push("\"method\": {");
                                            keys.forEach(function dashboard_commonDetails_value_methods_key(key:string) {
                                                output.push(`    "${key.toLowerCase()}: {`);
                                                output.push(`        "address": "${serverData.method[key as "delete"].address}",`);
                                                output.push(`        "port": ${serverData.method[key as "delete"].address}`);
                                                output.push("    }");
                                            });
                                            output.push("},");
                                        }
                                    }
                                },
                                sanitize = function dashboard_shareServices_details_serversWeb_sanitize(input:string):string {
                                    return input.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
                                },
                                serverData:supplemental_server_config = (newFlag === true)
                                    ? {
                                        activate: true,
                                        certificate_path: {
                                            ca: "",
                                            cert: "",
                                            key: ""
                                        },
                                        domain_local: ["localhost"],
                                        encryption: "both",
                                        id: "",
                                        message_segmentation: 1e6,
                                        mutual_tls: false,
                                        name: "new_server",
                                        ports: {
                                            open: 0,
                                            secure: 0
                                        },
                                        upgrade: false
                                    }
                                    : dashboard.global.payload.server[id].config,
                                output:string[] = [
                                        "{",
                                        `"activate": ${serverData.activate},`
                                    ];
                            if (typeof serverData.activate !== "boolean") {
                                output.push("\"activate\": true,");
                            }
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
                            output.push(`"id": "${serverData.id}",`);
                            methods();
                            if (newFlag === true) {
                                output.push("\"message_segmentation\": 1e6,");
                            } else {
                                output.push(`"message_segmentation": ${serverData.message_segmentation},`);
                            }
                            if (newFlag === true) {
                                output.push("\"mutual_tls\": false,");
                            } else {
                                output.push(`"mutual_tls": ${serverData.mutual_tls},`);
                            }
                            if (newFlag === true) {
                                output.push("\"name\": \"new_server\",");
                            } else {
                                output.push(`"name": "${sanitize(serverData.name)}",`);
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
                            if (serverData.redirect_asset !== undefined && serverData.redirect_asset !== null) {
                                object("redirect_asset");
                            }
                            if (serverData.redirect_domain !== undefined && serverData.redirect_domain !== null) {
                                object("redirect_domain");
                            }
                            if (serverData.single_socket !== undefined && serverData.single_socket !== null) {
                                if (serverData.single_socket === true) {
                                    output.push("\"single_socket\": true,");
                                } else {
                                    output.push("\"single_socket\": false,");
                                }
                            }
                            if (serverData.temporary !== undefined && serverData.temporary !== null) {
                                if (serverData.temporary === true) {
                                    output.push("\"temporary\": true,");
                                } else {
                                    output.push("\"temporary\": false,");
                                }
                            }
                            if (typeof serverData.upgrade === "boolean") {
                                output.push(`"upgrade": ${serverData.upgrade}`);
                            } else {
                                output.push("\"upgrade\": false");
                            }
                            output[output.length - 1] = output[output.length - 1].replace(/,$/, "");
                            return `${output.join("\n    ")}\n}`;
                        }())
                        : (newFlag === true || dashboard.global.payload.compose === null)
                            ? ""
                            : dashboard.global.payload.compose.containers[id].compose,
                    summary:HTMLElement = document.createElement("div"),
                    summaryTitle:HTMLElement = document.createElement("h5"),
                    summaryUl:HTMLElement = document.createElement("ul"),
                    editButton:HTMLElement = document.createElement("button"),
                    clear:HTMLElement = document.createElement("span");
                p = document.createElement("p");
                p.textContent = "Altering the 'id' property will have no effect as it will not change except for new servers awaiting a dynamically created id value.";
                summaryUl.setAttribute("class", "edit-summary");
                summaryTitle.appendText("Edit Summary");
                summary.appendChild(p);
                summary.appendChild(summaryTitle);
                summary.appendChild(summaryUl);
                summary.setAttribute("class", "summary");
                details.setAttribute("class", "edit");
                span.setAttribute("class", "text");
                textArea.value = value;
                textArea.spellcheck = false;
                textArea.readOnly = true;
                if (dashboard.global.section === "compose-containers") {
                    span.appendText("Docker Compose YAML");
                } else {
                    span.appendText("Server Configuration");
                }
                label.appendChild(span);
                label.appendChild(textArea);
                p = document.createElement("p");
                p.appendChild(label);
                details.appendChild(p);
                details.appendChild(summary);
                if (newFlag === false) {
                    const method:"activePorts"|"descriptions" = (dashboard.global.section === "servers-web")
                        ? "activePorts"
                        : "descriptions";
                    expandButton.textContent = "Hide";
                    editButton.appendText("✎ Edit");
                    editButton.setAttribute("class", "server-edit");
                    editButton.onclick = dashboard.shared_services.edit;
                    p.appendChild(editButton);
                    details.appendChild(dashboard.sections[dashboard.global.section as "servers-web"].tools[method as "activePorts"](id));
                }
                clear.setAttribute("class", "clear");
                p = document.createElement("p");
                p.appendChild(clear);
                p.setAttribute("class", "buttons");
                details.appendChild(p);
                if (newFlag === true) {
                    serverItem.parentNode.insertBefore(details, serverItem);
                    dashboard.shared_services.edit(event);
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
        // modify server and docker compose information
        edit: function dashboard_sharedServices_edit(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                classy:string = target.getAttribute("class"),
                createServer:boolean = (classy === "server-new" || classy === "compose-container-new"),
                edit:HTMLElement = (createServer === true)
                    ? target.getAncestor("section", "class").getElementsByClassName("edit")[0] as HTMLElement
                    : target.getAncestor("edit", "class"),
                editButton:HTMLElement = edit.getElementsByClassName("server-edit")[0] as HTMLElement,
                listItem:HTMLElement = edit.parentNode,
                dashboard_server:boolean = (createServer === false && listItem.dataset.id === dashboard.global.payload.id.dashboard_server),
                p:HTMLElement = edit.lastChild as HTMLElement,
                activate:HTMLButtonElement = document.createElement("button"),
                deactivate:HTMLButtonElement = document.createElement("button"),
                destroy:HTMLButtonElement = document.createElement("button"),
                save:HTMLButtonElement = document.createElement("button"),
                clear:HTMLElement = p.getElementsByClassName("clear")[0] as HTMLElement,
                note:HTMLElement = document.createElement("p"),
                textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                summary:HTMLElement = edit.getElementsByClassName("summary")[0] as HTMLElement,
                message:(event:MouseEvent) => void = (dashboard.global.section === "compose-containers")
                    ? dashboard.sections["compose-containers"].events.message_container
                    : dashboard.sections[dashboard.global.section as "servers-web"].events.message;
            save.disabled = true;
            summary.style.display = "block";
            if (createServer === false && dashboard_server === false) {
                const span:HTMLElement = document.createElement("span"),
                    buttons:HTMLElement = document.createElement("p");
                buttons.setAttribute("class", "buttons");
                destroy.appendText("✘ Destroy");
                destroy.setAttribute("class", "server-destroy");
                destroy.onclick = message;
                activate.appendText("⌁ Activate");
                activate.setAttribute("class", "server-activate");
                if (listItem.getAttribute("class") !== "red") {
                    activate.disabled = true;
                }
                activate.onclick = message;
                deactivate.appendText("። Deactivate");
                deactivate.setAttribute("class", "server-deactivate");
                deactivate.onclick = message;
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
                destroy.onclick = dashboard.shared_services.cancel;
                p.appendChild(destroy);
                save.appendText("✔ Create");
                save.setAttribute("class", "server-add");
            } else {
                editButton.parentNode.removeChild(editButton);
                save.appendText("🖪 Modify");
                save.setAttribute("class", "server-modify");
            }
            save.onclick = message;
            p.appendChild(save);
            p.removeChild(clear);
            p.appendChild(clear);
            p.setAttribute("class", "buttons");
            if (createServer === true) {
                if (dashboard.global.section === "compose-containers") {
                    note.textContent = "Container status messaging redirected to terminal.";
                } else {
                    note.textContent = "Please be patient with new secure server activation as creating new TLS certificates requires several seconds.";
                }
                note.setAttribute("class", "note");
                p.parentNode.appendChild(note);
            } else if (dashboard_server === false) {
                note.textContent = (dashboard.global.section === "compose-containers")
                    ? `Changing the container name of an existing container will create a new container. Ensure the compose file mentions PUID and PGID with values ${dashboard.global.payload.os.main.user_account.uid} and ${dashboard.global.payload.os.main.user_account.gid} to prevent writing files as root.`
                    : "Destroying a server will delete all associated file system artifacts. Back up your data first.";
                note.setAttribute("class", "note");
                p.parentNode.appendChild(note);
            }
            if (dashboard.global.section === "compose-containers") {
                textArea.onkeyup = dashboard.sections["compose-containers"].events.validate_containers;
                textArea.onfocus = dashboard.sections["compose-containers"].events.validate_containers;
            } else {
                textArea.onkeyup = dashboard.sections["servers-web"].events.validate;
                textArea.onfocus = dashboard.sections["servers-web"].events.validate;
            }
            textArea.readOnly = false;
            textArea.focus();
        },
        shellResize: function dashboard_sharedServices_shellResize(config:config_resize):void {
            dashboard.sections[config.section as "terminal"].events.resize = function dashboard_shareServices_shellResize_instance():void {
                if (dashboard.global.state.nav === config.section) {
                    const char_height:number = (config.shell === null)
                            ? 17
                            : (document.getElementById(config.section).getElementsByClassName("xterm-rows")[0] === undefined)
                                ? 17
                                : Number(document.getElementById(config.section).getElementsByClassName("xterm-rows")[0].getElementsByTagName("div")[0].style.height.replace("px", "")),
                        char_width:number = 9,
                        output_height:number = window.innerHeight - 110,
                        output_width:number = config.node.clientWidth,
                        cols:number = Math.floor(output_width / char_width),
                        rows:number = (config.section === "terminal")
                            ? Math.floor(output_height / char_height)
                            : 10,
                        node_col:HTMLElement = dashboard.sections[config.section as "terminal"].nodes.cols,
                        node_row:HTMLElement = dashboard.sections[config.section as "terminal"].nodes.rows;
                    if (output_width < 1) {
                        setTimeout(function dashboard_sharedServices_shellResize_instance_recurse():void {
                            dashboard_sharedServices_shellResize(config);
                        }, 10);
                    } else if (dashboard.sections[config.section as "terminal"].cols !== cols || dashboard.sections[config.section as "terminal"].rows !== rows) {
                        dashboard.sections[config.section as "terminal"].cols = cols;
                        dashboard.sections[config.section as "terminal"].rows = rows;
                        if (config.section === "terminal") {
                            config.node.style.height = `${output_height / 10}em`;
                        }
                        config.node.setAttribute("data-size", JSON.stringify({
                            col: cols,
                            row: rows
                        }));
                        node_col.textContent = cols.toString();
                        node_row.textContent = rows.toString();
                        if (config.shell !== null) {
                            config.shell.resize(cols, rows);
                        }
                        if ((config.section === "terminal" && dashboard.sections["terminal"].info !== null) || config.section !== "terminal") {
                            dashboard.message.send({
                                data: {
                                    cols: cols,
                                    hash: (config.section === "terminal")
                                        ? dashboard.sections["terminal"].info.socket_hash
                                        : "",
                                    rows: rows,
                                    secure: (location.protocol === "http:")
                                        ? "open"
                                        : "secure",
                                    section: config.section
                                } as services_terminal_resize,
                                service: "services_terminal_resize"
                            });
                        }
                    }
                }
            };
            dashboard.sections[config.section as "terminal"].events.resize();
        },
        // expands server and docker compose sections
        title: function dashboard_sharedServices_title(id:string, type:type_dashboard_list):HTMLElement {
            const li:HTMLElement = document.createElement("li"),
                h4:HTMLElement = document.createElement("h4"),
                expand:HTMLButtonElement = document.createElement("button"),
                span:HTMLElement = document.createElement("span"),
                name:string = (id === undefined)
                    ? `new_${type}`
                    : (type === "server")
                        ? dashboard.global.payload.server[id].config.name
                        : (dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                            ? id
                            : dashboard.global.payload.compose.containers[id].name;
            if (id === undefined) {
                expand.appendText(name);
            } else {
                const color:type_activation_status = dashboard.shared_services.color(id, type);
                span.appendText("Expand");
                span.setAttribute("class", "expand");
                expand.appendChild(span);
                expand.onclick = dashboard.shared_services.details;
                li.setAttribute("data-id", id);
                expand.appendText(`${name} - ${color[1]}`);
                if (color[0] !== null) {
                    li.setAttribute("class", color[0]);
                }
            }
            h4.appendChild(expand);
            li.appendChild(h4);
            return li;
        }
    };
    dashboard.shared_services = shared_services;
};

export default ui_shared_services;