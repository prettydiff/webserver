
import dashboard from "./dashboard.ts";
// cspell: words serv, stcp, sudp

const ui_tables = function ui_tables():void {
    const tables:dashboard_tables = {
        cell: function dashboard_tables_cell(tr:HTMLElement, text:string, raw:string):void {
            const td:HTMLElement = document.createElement("td");
            td.textContent = text;
            if (raw !== null) {
                td.setAttribute("class", "right");
                if (raw === "id") {
                    td.setAttribute("class", "server_id");
                    td.setAttribute("title", text);
                } else if (raw !== text) {
                    td.setAttribute("data-raw", raw);
                }
            }
            tr.appendChild(td);
        },
        // filter large data tables
        filter: function dashboard_tables_filter(event:Event, target?:HTMLInputElement):void {
            if (event !== null) {
                const key:KeyboardEvent = event as KeyboardEvent;
                if (event.type === "keyup" && key.key !== "Enter") {
                    return;
                }
                target = event.target as HTMLInputElement;
                dashboard.utility.setState();
            }
            const section:HTMLElement = target.getAncestor("form", "class"),
                tab:HTMLElement = section.getAncestor("tab", "class"),
                tab_name:type_dashboard_tables = tab.getAttribute("id") as type_dashboard_tables,
                module_map:store_module_map = {
                    "devices": dashboard.sections["devices"],
                    "ports-application": dashboard.sections["ports-application"],
                    "processes": dashboard.sections["processes"],
                    "services-os": dashboard.sections["services-os"],
                    "sockets-application-tcp": dashboard.sections["sockets-application-tcp"],
                    "sockets-application-udp": dashboard.sections["sockets-application-udp"],
                    "sockets-os-tcp": dashboard.sections["sockets-os-tcp"],
                    "sockets-os-udp": dashboard.sections["sockets-os-udp"],
                    "users": dashboard.sections["users"]
                },
                module:module_list|section_ports_application|section_sockets_application = module_map[tab_name],
                columnIndex:number = module.nodes.filter_column.selectedIndex - 1,
                list:HTMLCollectionOf<HTMLElement> = module.nodes.list.getElementsByTagName("tr"),
                cell_length:number = module.nodes.list.parentNode.getElementsByTagName("thead")[0].getElementsByTagName("th").length,
                sensitive:boolean = module.nodes.caseSensitive.checked,
                value:string = (sensitive === true)
                    ? module.nodes.filter_value.value
                    : module.nodes.filter_value.value.toLowerCase();
            let index:number = list.length,
                cells:HTMLCollectionOf<HTMLElement> = null,
                count:number = 0,
                test:boolean = false,
                cell_index:number = 0;
            if (module === undefined) {
                return;
            }
            if (index > 0) {
                do {
                    index = index - 1;
                    cells = list[index].getElementsByTagName("td");
                    cell_index = cell_length;
                    if (value === "") {
                        list[index].style.display = "table-row";
                        count = count + 1;
                    } else if (columnIndex < 0) {
                        test = false;
                        do {
                            cell_index = cell_index - 1;
                            if ((sensitive === true && cells[cell_index].textContent.includes(value) === true) || (sensitive === false && cells[cell_index].textContent.toLowerCase().includes(value) === true)) {
                                list[index].style.display = "table-row";
                                count = count + 1;
                                test = true;
                                break;
                            }
                        } while (cell_index > 0);
                        if (test === false) {
                            list[index].style.display = "none";
                        }
                    } else if ((sensitive === true && cells[columnIndex].textContent.includes(value) === true) || (sensitive === false && cells[columnIndex].textContent.toLowerCase().includes(value) === true)) {
                        list[index].style.display = "table-row";
                        count = count + 1;
                    } else {
                        list[index].style.display = "none";
                    }
                } while (index > 0);
                module.nodes.filter_count.textContent = String(count);
                index = 0;
                count = 0;
                do {
                    if (list[index].style.display === "table-row") {
                        if (count % 2 === 0) {
                            list[index].setAttribute("class", "even");
                        } else {
                            list[index].setAttribute("class", "odd");
                        }
                        count = count + 1;
                    }
                    index = index + 1;
                } while (index < list.length);
            }
        },
        // attaches event listeners to data tables and restores state
        init: function dashboard_tables_init(module:module_list|section_ports_application|section_sockets_application):void {
            const select = function dashboard_tables_init_select(table:HTMLElement, select:HTMLSelectElement):void {
                    const th:HTMLCollectionOf<HTMLElement> = table.getElementsByTagName("th"),
                        len:number = th.length;
                    let index:number = 0,
                        option:HTMLElement = document.createElement("option");
                    option.textContent = "All";
                    select.appendChild(option);
                    if (len > 0) {
                        do {
                            option = document.createElement("option");
                            option.textContent = th[index].getElementsByTagName("button")[0].textContent;
                            select.appendChild(option);
                            index = index + 1;
                        } while (index < len);
                    }
                },
                data_type:type_list_services = (module.dataName === "ports-application")
                    ? dashboard.global.payload["ports-application"]
                        : (module.dataName === "sockets-application-tcp" || module.dataName === "sockets-application-udp")
                            ? null
                            : dashboard.global.payload.os[module.dataName as type_os_list_names];
            if (dashboard.global.state.table_os[module.dataName] === undefined || dashboard.global.state.table_os[module.dataName] === null) {
                dashboard.global.state.table_os[module.dataName] = {
                    filter_column: module.nodes.filter_column.selectedIndex,
                    filter_sensitive: module.nodes.caseSensitive.checked,
                    filter_value: module.nodes.filter_value.value
                };
            } else {
                module.nodes.filter_column.selectedIndex = dashboard.global.state.table_os[module.dataName].filter_column;
                module.nodes.caseSensitive.checked = dashboard.global.state.table_os[module.dataName].filter_sensitive;
                module.nodes.filter_value.value = dashboard.global.state.table_os[module.dataName].filter_value;
            }
            module.nodes.filter_column.onchange = dashboard.tables.filter;
            module.nodes.caseSensitive.onclick = dashboard.utility.setState;
            module.nodes.filter_value.onblur = dashboard.tables.filter;
            module.nodes.filter_value.onkeyup = dashboard.tables.filter;
            module.nodes.update_button.onclick = dashboard.tables.update;
            module.nodes.update_button.setAttribute("data-list", module.dataName);
            module.receive = dashboard.tables.receive;
            select(module.nodes.list.parentNode, module.nodes.filter_column);
            if (module.dataName === "sockets-application-tcp") {
                dashboard.tables.populate(dashboard.sections["sockets-application-tcp"], {
                    data: dashboard.global.payload.sockets.tcp,
                    time: dashboard.global.payload.sockets.time
                });
            } else if (module.dataName === "sockets-application-udp") {
                dashboard.tables.populate(dashboard.sections["sockets-application-udp"], {
                    data: dashboard.global.payload.sockets.udp,
                    time: dashboard.global.payload.sockets.time
                });
            } else {
                dashboard.tables.populate(module, data_type);
            }
        },
        // populate large data tables
        populate: function dashboard_tables_populate(module:module_list, item:type_list_services):void {
            const len:number = item.data.length,
                list:HTMLElement = module.nodes.list,
                table:HTMLElement = (list === null)
                    ? null
                    : list.parentNode;
            if (len > 0) {
                if (table !== null) {
                    let index:number = 0,
                        row:HTMLElement = null;
                    list.textContent = "";
                    do {
                        row = document.createElement("tr");
                        module.row(item.data[index], row);
                        row.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                        list.appendChild(row);
                        index = index + 1;
                    } while (index < len);
                    module.nodes.list = table.getElementsByTagName("tbody")[0];
                    dashboard.tables.filter(null, module.nodes.filter_value);
                    dashboard.tables.sort(null, module.nodes.list.parentNode, Number(module.nodes.list.parentNode.dataset["column"]));
                }
                module.nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                module.nodes.count.textContent = String(item.data.length);
            } else {
                module.nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
                module.nodes.count.textContent = String(item.data.length);
                module.nodes.filter_count.textContent = "0";
            }
        },
        // populate data from update requests
        receive: function dashboard_table_receive(socket_data:socket_data):void {
            const service:string = socket_data.service,
                map:store_string = {
                    "services_ports_application": "ports-application",
                    "services_os_devs": "devices",
                    "services_os_proc": "processes",
                    "services_os_serv": "services-os",
                    "services_os_user": "users",
                    "services_os_stcp": "sockets-os-tcp",
                    "services_os_sudp": "sockets-os-udp"
                },
                table:type_dashboard_tables = map[service] as type_dashboard_tables,
                module:module_list = dashboard.sections[table];
            if (service === "services_socket_application") {
                const sockets:services_socket_application = socket_data.data as services_socket_application,
                    section_update = function dashboard_table_receive_sectionUpdate(type:"tcp"|"udp"):void {
                        const name:type_dashboard_tables = `sockets-application-${type}`,
                            section:module_list = dashboard.sections[name];
                        if (section !== undefined) {
                            dashboard.tables.populate(section, {
                                data: sockets[type],
                                time: sockets.time
                            });
                            section.nodes.update_duration.textContent = dashboard.utility.performance_get(name);
                            dashboard.global.payload.sockets = sockets;
                        }
                    };
                section_update("tcp");
                section_update("udp");
            } else if (module !== undefined) {
                if (module.dataName === "ports-application") {
                    dashboard.global.payload["ports-application"] = socket_data.data as services_ports_application;
                } else if (module.dataName === "sockets-application-tcp") {
                    dashboard.global.payload.sockets.tcp = (socket_data.data as services_socket_application).tcp;
                } else if (module.dataName === "sockets-application-udp") {
                    dashboard.global.payload.sockets.udp = (socket_data.data as services_socket_application).udp;
                } else {
                    dashboard.global.payload.os[module.dataName as "devs"] = socket_data.data as services_os_devs;
                }
                dashboard.tables.populate(module, socket_data.data as type_list_services);
                dashboard.tables.sort(null, module.nodes.list.parentNode, Number(module.nodes.list.parentNode.dataset["column"]));
                module.nodes.update_duration.textContent = dashboard.utility.performance_get(table);
            }
        },
        // sort data from html tables
        sort: function dashboard_tables_sort(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {
            const target:HTMLElement = (event === null)
                    ? null
                    : event.target,
                tableElement:HTMLElement = (event === null)
                    ? table
                    : target.getAncestor("table", "tag"),
                tbody:HTMLElement = tableElement.getElementsByTagName("tbody")[0],
                tr_list:HTMLCollectionOf<HTMLElement> = tbody.getElementsByTagName("tr"),
                records:HTMLElement[] = [],
                file_test:boolean = (tbody === dashboard.sections["file-system"].nodes.tbody && tr_list[0] !== undefined && tr_list[1] !== undefined && tr_list[0].getElementsByTagName("button")[0].lastChild.textContent === " .." && tr_list[1].getElementsByTagName("button")[0].lastChild.textContent === " ."),
                tr_length:number = tr_list.length;
            if (tr_length > 0) {
                const th:HTMLElement = (event === null)
                        ? table.getElementsByTagName("th")[heading_index]
                        : target.parentNode,
                    tr_head:HTMLElement = th.parentNode,
                    ths:HTMLCollectionOf<HTMLElement> = tr_head.getElementsByTagName("th"),
                    cells_length:number = ths.length,
                    button:HTMLElement = (event === null)
                        ? th.getElementsByTagName("button")[0]
                        : target,
                    direction:-1|1 = (event === null)
                        ? Number(button.dataset.dir) as -1
                        : Number(button.dataset.dir) * -1 as -1,
                    id:string = tableElement.getAncestor("tab", "class").getAttribute("id");
                let index_th:number = (event === null)
                        ? heading_index
                        : cells_length,
                    index_tr:number = (file_test === true)
                        ? 2
                        : 0;
                if (event !== null) {
                    const tables:HTMLCollectionOf<HTMLElement> = document.getElementById(id).getElementsByTagName("table");
                    let tables_index:number = tables.length;
                    // apply change of direction
                    button.setAttribute("data-dir", String(direction));

                    // find which column to sort by
                    do {
                        index_th = index_th - 1;
                        if (ths[index_th] === th) {
                            break;
                        }
                    } while (index_th > 0);
                    tableElement.setAttribute("data-column", String(index_th));

                    // save state
                    if (dashboard.global.state.tables === undefined || dashboard.global.state.tables === null) {
                        dashboard.global.state.tables = {};
                    }
                    do {
                        tables_index = tables_index - 1;
                    } while (tables_index > 0 && tables[tables_index] !== tableElement);
                    dashboard.global.state.tables[`${id}-${tables_index}`] = {
                        col: index_th,
                        dir: direction
                    };
                    dashboard.utility.setState();
                }
                if (dashboard.sections["file-system"] !== undefined && dashboard.sections["file-system"].nodes.tbody === tbody) {
                    dashboard.sections["file-system"].sort = true;
                }
                do {
                    records.push(tr_list[index_tr]);
                    index_tr = index_tr + 1;
                } while (index_tr < tr_length);

                records.sort(function dashboard_tables_sort_records(a:HTMLElement, b:HTMLElement):-1|0|1 {
                    const td_a:HTMLElement = a.getElementsByTagName("td")[index_th],
                        td_b:HTMLElement = b.getElementsByTagName("td")[index_th],
                        text_a:string = (td_a.dataset.raw === undefined)
                            ? td_a.textContent
                            : td_a.dataset.raw,
                        text_b:string = (td_b.dataset.raw === undefined)
                            ? td_b.textContent
                            : td_b.dataset.raw,
                        numb_a:number = Number(text_a),
                        numb_b:number = Number(text_b);
                    if (isNaN(numb_a) === false && isNaN(numb_b) === false) {
                        if (numb_a < numb_b) {
                            return direction;
                        }
                        if (numb_a > numb_b) {
                            return (direction * -1 as -1);
                        }
                        return 0;
                    }
                    if (text_a < text_b) {
                        return direction;
                    }
                    if (text_a > text_b) {
                        return (direction * -1 as -1);
                    }
                    return 0;
                });
                if (file_test === true) {
                    records.splice(0, 0, tr_list[0], tr_list[1]);
                }
                tbody.textContent = "";
                index_tr = 0;
                do {
                    records[index_tr].setAttribute("class", (index_tr % 2 === 0) ? "even" : "odd");
                    tbody.appendChild(records[index_tr]);
                    index_tr = index_tr + 1;
                } while (index_tr < tr_length);
            }
        },
        // request updated table data
        update: function dashboard_tables_update(event:MouseEvent):void {
            const target:type_dashboard_tables = event.target.dataset.list as type_dashboard_tables,
                map_section:store_string = {
                    "devs": "devices",
                    "ports-application": "ports-application",
                    "proc": "processes",
                    "serv": "services-os",
                    "sockets-application-tcp": "sockets-application-tcp",
                    "sockets-application-udp": "sockets-application-udp",
                    "stcp": "sockets-os-tcp",
                    "sudp": "sockets-os-udp",
                    "user": "users"
                },
                map_service:store_string = {
                    "devs": "services_os_devs",
                    "ports-application": "services_ports_application",
                    "proc": "services_os_proc",
                    "serv": "services_os_serv",
                    "sockets-application-tcp": "services_socket_application",
                    "sockets-application-udp": "services_socket_application",
                    "stcp": "services_os_stcp",
                    "sudp": "services_os_sudp",
                    "user": "services_os_user"
                },
                section:type_dashboard_sections = map_section[target] as type_dashboard_sections,
                service:type_dashboard_table_services = map_service[target] as "services_os_devs";
            dashboard.utility.performance_set(section);
            dashboard.message.send({data: null, service: service});
        }
    };
    dashboard.tables = tables;
};

export default ui_tables;