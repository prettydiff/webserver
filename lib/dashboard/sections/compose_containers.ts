
import dashboard from "../dashboard.ts";
import Terminal from "@xterm/xterm";

const ui_compose_containers = function ui_compose_containers():void {
    const compose_containers:section_compose_containers = {
        cols: 0,
        events: {
            cancel_variable: function dashboard_sections_composeContainers_cancelVariable(event:MouseEvent):void {
                const target:HTMLElement = event.target as HTMLElement,
                    ancestor:HTMLElement = target.getAncestor("div", "tag"),
                    section:HTMLElement = ancestor.getAncestor("section", "class"),
                    edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement;
                edit.parentNode.removeChild(edit);
                dashboard.sections["compose-containers"].nodes.list_variables.style.display = "block";
                dashboard.sections["compose-containers"].nodes.new_variable.disabled = false;
            },
            edit_variable: function dashboard_sections_composeContainers_editVariable():void {
                const p:HTMLElement = document.createElement("p"),
                    buttons:HTMLElement = document.createElement("p"),
                    label:HTMLElement = document.createElement("label"),
                    edit:HTMLElement = document.createElement("div"),
                    ul:HTMLElement = document.createElement("ul"),
                    textArea:HTMLTextAreaElement = document.createElement("textarea"),
                    keys:string[] = Object.keys(dashboard.global.payload.compose.variables).sort(),
                    output:string[] = [],
                    len:number = keys.length,
                    cancel:HTMLElement = document.createElement("button"),
                    save:HTMLElement = document.createElement("button");
                let index:number = 0;
                edit.setAttribute("class", "edit");
                if (len > 0) {
                    do {
                        output.push(`"${keys[index]}": "${dashboard.global.payload.compose.variables[keys[index]]}"`);
                        index = index + 1;
                    } while (index < len);
                    textArea.value = `{\n    ${output.join(",\n    ")}\n}`;
                }
                ul.setAttribute("class", "edit-summary");
                cancel.appendText("⚠ Cancel");
                cancel.setAttribute("class", "server-cancel");
                cancel.onclick = dashboard.sections["compose-containers"].events.cancel_variable;
                buttons.appendChild(cancel);
                save.appendText("🖪 Modify");
                save.setAttribute("class", "server-modify");
                save.onclick = dashboard.sections["compose-containers"].events.message_variable;
                buttons.appendChild(save);
                textArea.setAttribute("class", "compose-variables-edit");
                dashboard.sections["compose-containers"].nodes.list_variables.style.display = "none";
                label.appendText("Docker Compose Variables");
                label.appendChild(textArea);
                p.setAttribute("class", "compose-edit");
                p.appendChild(label);
                buttons.setAttribute("class", "buttons");
                edit.appendChild(p);
                edit.appendChild(ul);
                edit.appendChild(buttons);
                dashboard.sections["compose-containers"].nodes.list_variables.parentNode.appendChild(edit);
                dashboard.sections["compose-containers"].nodes.new_variable.disabled = true;
                textArea.onkeyup = dashboard.sections["compose-containers"].events.validate_variables;
                textArea.onfocus = dashboard.sections["compose-containers"].events.validate_variables;
                textArea.focus();
            },
            message_container: function dashboard_sections_composeContainers_messageContainer(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    action:type_dashboard_action = target.getAttribute("class").replace("server-", "") as type_dashboard_action,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                    textArea:HTMLTextAreaElement = edit.getElementsByTagName("textarea")[0],
                    id:string = (action === "add")
                        ? ""
                        : edit.getAncestor("li", "tag").dataset.id,
                    message:services_compose_container = {
                        action: action,
                        compose: textArea.value.trim(),
                        id: id,
                        location: (action === "add")
                            ? ""
                            : dashboard.global.payload.compose.containers[id].location
                    };
                dashboard.message.send({data: message, service: "services_compose_container"});
                dashboard.sections["compose-containers"].nodes.new_container.disabled = false;
                if (cancel === undefined) {
                    edit.parentNode.getElementsByTagName("button")[0].click();
                } else {
                    dashboard.shared_services.cancel(event);
                }
            },
            message_variable: function dashboard_sections_composeContainers_messageVariable(event:MouseEvent):void {
                const target:HTMLElement = event.target,
                    edit:HTMLElement = target.getAncestor("edit", "class"),
                    cancel:HTMLButtonElement = edit.getElementsByClassName("server-cancel")[0] as HTMLButtonElement,
                    value:string = edit.getElementsByTagName("textarea")[0].value,
                    variables:store_string = JSON.parse(value);
                dashboard.message.send({data: variables, service: "services_compose_variables"});
                dashboard.sections["compose-containers"].nodes.new_variable.disabled = false;
                if (cancel === undefined) {
                    edit.parentNode.getElementsByTagName("button")[0].click();
                } else {
                    dashboard.shared_services.cancel(event);
                }
            },
            resize: null,
            selection: function dashboard_sections_composeContainers_selection():void {
                if (dashboard.global.click === true) {
                    navigator.clipboard.write([
                        new ClipboardItem({["text/plain"]: dashboard.sections["compose-containers"].shell.getSelection()})
                    ]);
                }
            },
            update: function dashboard_sections_composeContainers_update():void {
                const message:services_compose_container = {
                    action: "update",
                    compose: "",
                    id: "",
                    location: ""
                };
                dashboard.message.send({data: message, service: "services_compose_container"});
            },
            validate_containers: function dashboard_sections_composeContainers_validateContainers(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLElement = event.target,
                    id:string = target.getAncestor("li", "tag").dataset.id,
                    section:HTMLElement = target.getAncestor("edit", "class"),
                    newItem:boolean = (section.parentNode.getAttribute("class") === "section"),
                    textArea:HTMLTextAreaElement = section.getElementsByTagName("textarea")[0],
                    summary:HTMLElement = section.getElementsByClassName("summary")[0] as HTMLElement,
                    ul:HTMLElement = summary.getElementsByTagName("ul")[0] as HTMLElement,
                    modify:HTMLButtonElement = (newItem === true)
                        ? section.getElementsByClassName("server-add")[0] as HTMLButtonElement
                        : section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                    reg:RegExp = (/^\s*$/),
                    value:string = textArea.value;
                let valid:boolean = true,
                    li:HTMLElement = document.createElement("li"),
                    name:string = value.split("container_name")[1];
                name = (name === undefined)
                    ? ""
                    : name.split("\n")[0].replace(/\s*:/, "").trim();
                summary.style.display = "block";
                ul.textContent = "";
                if (reg.test(value) === true) {
                    valid = false;
                    li.appendText("Compose file contents must have a value in YAML format.");
                    li.setAttribute("class", "pass-false");
                } else {
                    li.appendText("Compose file contents field contains a value.");
                    li.setAttribute("class", "pass-true");
                }
                ul.appendChild(li);
                li = document.createElement("li");
                if (name === undefined || name === "") {
                    valid = false;
                    li.appendText("Compose file must contain a 'container_name' property.");
                    li.setAttribute("class", "pass-false");
                } else {
                    li.appendText("Compose file contains a 'container_name' property.");
                    li.setAttribute("class", "pass-true");
                }
                ul.appendChild(li);
                if (valid === true && id !== undefined && dashboard.global.payload.compose.containers[id].compose === value) {
                    valid = false;
                    li = document.createElement("li");
                    li.appendText("Values are populated, but aren't modified.");
                    li.setAttribute("class", "pass-false");
                    ul.appendChild(li);
                }
                if (valid === true) {
                    modify.disabled = false;
                } else {
                    modify.disabled = true;
                }
            },
            validate_variables: function dashboard_sections_composeContainers_validateVariables(event:FocusEvent|KeyboardEvent):void {
                const target:HTMLTextAreaElement = event.target as HTMLTextAreaElement,
                    value:string = target.value,
                    section:HTMLElement = target.getAncestor("section", "class"),
                    edit:HTMLElement = section.getElementsByClassName("edit")[0] as HTMLElement,
                    modify:HTMLButtonElement = section.getElementsByClassName("server-modify")[0] as HTMLButtonElement,
                    ul:HTMLElement = edit.getElementsByTagName("ul")[0],
                    text = function dashboard_sections_composeContainers_validateVariables_text(message:string, pass:boolean):void {
                        const li:HTMLElement = document.createElement("li");
                        if (pass === true) {
                            modify.disabled = false;
                        } else {
                            modify.disabled = true;
                        }
                        li.setAttribute("class", `pass-${pass}`);
                        li.appendText(message);
                        ul.appendChild(li);
                    },
                    sort = function dashboard_sections_composeContainers_validateVariables_sort(object:store_string):string {
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
                ul.textContent = "";
                if (value === "" || (/^\s*\{\s*\}\s*$/).test(value) === true) {
                    text("Supply key/value pairs in JSON format.", false);
                } else {
                    // eslint-disable-next-line no-restricted-syntax
                    try {
                        variables = JSON.parse(value);
                    } catch(e:unknown) {
                        const error:Error = e as Error;
                        text(error.message, false);
                        return;
                    }
                    if (sort(variables) === sort(dashboard.global.payload.compose.variables)) {
                        text("Value is valid JSON, but is not modified.", false);
                    } else {
                        text("Input is valid JSON format.", true);
                    }
                }
            }
        },
        init: function dashboard_sections_composeContainers_init():void {
            if (dashboard.global.payload.compose.status === "") {
                const shell = function dashboard_sections_composeContainers_init_shell():void {
                    if (dashboard.sections["compose-containers"].shell === null) {
                        if (typeof Terminal === "undefined") {
                            setTimeout(dashboard_sections_composeContainers_init_shell, 200);
                        } else {
                            // @ts-expect-error - xterm has not updated their types to reflect Terminal is a constructor
                            dashboard.sections["compose-containers"].shell = new Terminal({
                                cols: dashboard.sections["compose-containers"].cols,
                                cursorBlink: true,
                                cursorStyle: "underline",
                                disableStdin: false,
                                readonly: true,
                                rows: dashboard.sections["compose-containers"].rows,
                                theme: {
                                    background: "#222",
                                    selectionBackground: "#444"
                                }
                            });
                            dashboard.sections["compose-containers"].shell.open(dashboard.sections["compose-containers"].nodes.shell);
                            if (typeof navigator.clipboard !== "undefined") {
                                dashboard.sections["compose-containers"].shell.onSelectionChange(dashboard.sections["compose-containers"].events.selection);
                            }
                        }
                    }
                };
                if (dashboard.global.payload.demo === true) {
                    const p:HTMLElement = document.createElement("p");
                    p.textContent = "Shell output disabled in demo mode.";
                    dashboard.sections["compose-containers"].nodes.shell.appendChild(p);
                } else {
                    shell();
                    dashboard.shared_services.shellResize({
                        node: dashboard.sections["compose-containers"].nodes.shell,
                        section: "compose-containers",
                        shell: dashboard.sections["compose-containers"].shell
                    });
                    dashboard.sections["compose-containers"].nodes.new_container.onclick = dashboard.shared_services.create;
                }
                dashboard.sections["compose-containers"].nodes.new_variable.onclick = dashboard.sections["compose-containers"].events.edit_variable;
                dashboard.sections["compose-containers"].nodes.update_button.onclick = dashboard.sections["compose-containers"].events.update;
                dashboard.sections["compose-containers"].nodes.update_time.onclick = null;
                dashboard.sections["compose-containers"].receive({
                    data: dashboard.global.payload.compose,
                    service: "services_compose"
                });
            } else {
                const strong:HTMLElement = document.createElement("strong");
                strong.textContent = "Error: ";
                dashboard.sections["compose-containers"].nodes.body.style.display = "none";
                dashboard.sections["compose-containers"].nodes.status.appendChild(strong);
                dashboard.sections["compose-containers"].nodes.status.appendText(dashboard.global.payload.compose.status);
                dashboard.sections["compose-containers"].nodes.status.style.display = "block";
            }
            if (dashboard.global.payload.demo === true) {
                dashboard.sections["compose-containers"].nodes.demo_containers.style.display = "block";
            }
        },
        nodes: {
            body: document.getElementById("compose-containers").getElementsByClassName("compose-body")[0] as HTMLElement,
            cols: document.getElementById("compose-containers").getElementsByClassName("section")[2].getElementsByTagName("p")[0].getElementsByTagName("em")[0] as HTMLElement,
            demo_containers: document.getElementById("compose-containers").getElementsByClassName("section")[3].getElementsByClassName("demo-containers")[0] as HTMLElement,
            list: document.getElementById("compose-containers").getElementsByClassName("compose-container-list")[0] as HTMLElement,
            list_variables: document.getElementById("compose-containers").getElementsByClassName("compose-variable-list")[0] as HTMLElement,
            new_container: document.getElementById("compose-containers").getElementsByClassName("compose-container-new")[0] as HTMLButtonElement,
            new_variable: document.getElementById("compose-containers").getElementsByClassName("compose-variable-new")[0] as HTMLButtonElement,
            rows: document.getElementById("compose-containers").getElementsByClassName("section")[2].getElementsByTagName("p")[0].getElementsByTagName("em")[1] as HTMLElement,
            shell: document.getElementById("compose-containers").getElementsByClassName("terminal-output")[0] as HTMLElement,
            status: document.getElementById("compose-containers").getElementsByClassName("status")[0] as HTMLElement,
            update_button: document.getElementById("compose-containers").getElementsByClassName("update-button")[0].getElementsByTagName("button")[0],
            update_containers: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("em")[0],
            update_time: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("time")[0],
            update_variables: document.getElementById("compose-containers").getElementsByClassName("section")[0].getElementsByTagName("em")[1]
        },
        receive: function dashboard_sections_composeContainers_receive(socket_data:socket_data):void {
            const data:services_compose = socket_data.data as services_compose,
                list:string[] = (data.containers === null)
                    ? []
                    : Object.keys(data.containers).sort(function dashboard_sections_composeContainers_receive_keys(a:string, b:string):-1|1 {
                        const nameA:string = (a.includes(".y") === true)
                                ? a.split(dashboard.global.payload.path.sep).pop()
                                : data.containers[a].name,
                            nameB:string = (b.includes(".y") === true)
                                ? b.split(dashboard.global.payload.path.sep).pop()
                                : data.containers[b].name;
                        if (nameA < nameB) {
                            return -1;
                        }
                        return 1;
                    }),
                variables:string[] = (data.variables === null)
                    ? []
                    : Object.keys(data.variables).sort(),
                list_containers:HTMLElement = dashboard.sections["compose-containers"].nodes.list,
                list_variables:HTMLElement = dashboard.sections["compose-containers"].nodes.list_variables,
                len_containers:number = list.length,
                len_variables:number = variables.length;
            let li:HTMLElement = null,
                index:number = 0;
            if (data.containers !== null) {
                list_containers.textContent = "";
                dashboard.global.payload.compose.containers = data.containers;
                if (len_containers > 0) {
                    do {
                        if (data.containers[list[index]] !== undefined) {
                            li = dashboard.shared_services.title(list[index], "container");
                            li.setAttribute("data-id", data.containers[list[index]].id);
                            list_containers.appendChild(li);
                        }
                        index = index + 1;
                    } while (index < len_containers);
                    list_containers.style.display = "block";
                } else {
                    list_containers.style.display = "none";
                }
            }
            if (data.variables !== null) {
                index = 0;
                list_variables.textContent = "";
                dashboard.global.payload.compose.variables = data.variables;
                if (len_variables > 0) {
                    let span:HTMLElement = null,
                        strong:HTMLElement = null,
                        strong_list:HTMLCollectionOf<HTMLElement> = null,
                        longest:number = 0;
                    do {
                        li = document.createElement("li");
                        strong = document.createElement("strong");
                        span = document.createElement("span");
                        strong.appendText(variables[index]);
                        if (variables[index].length > longest) {
                            longest = variables[index].length;
                        }
                        span.appendText(dashboard.global.payload.compose.variables[variables[index]]);
                        li.appendChild(strong);
                        li.appendChild(span);
                        list_variables.appendChild(li);
                        index = index + 1;
                    } while (index < len_variables);
                    list_variables.style.display = "block";
                    index = 0;
                    strong_list = list_variables.getElementsByTagName("strong");
                    do {
                        strong_list[index].style.width = `${((longest / 1.2) - 3).toFixed(1)}em`;
                        index = index + 1;
                    } while (index < len_variables);
                } else {
                    list_variables.style.display = "none";
                }
            }
            dashboard.sections["compose-containers"].nodes.update_containers.textContent = len_containers.toString();
            dashboard.sections["compose-containers"].nodes.update_variables.textContent = len_variables.toString();
            dashboard.sections["compose-containers"].nodes.update_time.textContent = data.time.dateTime(true, dashboard.global.payload.timeZone_offset);
        },
        rows: 0,
        shell: null,
        status_out: function dashboard_sections_composeContainers_statusOut(socket_data:socket_data):void {
            const data:services_compose_out = socket_data.data as services_compose_out;
            dashboard.sections["compose-containers"].shell.write(data.status);
        },
        tools: {
            descriptions: function dashboard_sections_composeContainers_description(id:boolean|string):HTMLElement {
                const div:HTMLElement = document.createElement("div"),
                    p:HTMLElement = document.createElement("p"),
                    portHeading:HTMLElement = document.createElement("strong"),
                    portList:HTMLElement = document.createElement("ul"),
                    container:core_compose_container = dashboard.global.payload.compose.containers[id as string],
                    ports:type_docker_ports = container.ports,
                    len:number = (ports === null)
                        ? 0
                        : ports.length,
                    ul:HTMLElement = document.createElement("ul"),
                    properties = function dashboard_sections_composeContainers_description_properties(name:string, value:string):void {
                        const li:HTMLElement = document.createElement("li"),
                            strong:HTMLElement = document.createElement("strong"),
                            span:HTMLElement = document.createElement("span");
                        strong.textContent = name;
                        span.textContent = value;
                        li.appendChild(strong);
                        li.appendChild(span);
                        ul.appendChild(li);
                    };
                let portItem:HTMLElement = null,
                    index:number = 0;
                if (container !== undefined) {
                    if (len > 0) {
                        portHeading.textContent = "Active Ports";
                        p.appendChild(portHeading);
                        div.appendChild(p);
                        do {
                            portItem = document.createElement("li");
                            portItem.appendText(`${ports[index][0]} (${ports[index][1].toUpperCase()})`);
                            portList.appendChild(portItem);
                            index = index + 1;
                        } while (index < len);
                        portList.setAttribute("class", "container-ports");
                        div.appendChild(portList);
                    }
                    div.setAttribute("class", "active-ports");
                    ul.setAttribute("class", "container-properties");
                    properties("Created On", container.created.dateTime(true, dashboard.global.payload.timeZone_offset));
                    properties("Config Location", container.location);
                    properties("Description", container.description);
                    properties("ID", container.id);
                    properties("Image", container.image);
                    properties("License", container.license);
                    properties("State", container.state);
                    properties("Status", container.status);
                    properties("Version", container.version);
                    div.appendChild(ul);
                }
                return div;
            }
        }
    };
    dashboard.sections["compose-containers"] = compose_containers;
};

export default ui_compose_containers;