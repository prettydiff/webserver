

import Chart from "chart.js/auto";
import dashboard from "../dashboard.ts";

const ui_statistics_resources = function ui_statistics_resources():void {
    const statistics_resources:section_statistics_resources = {
        events: {
            change_display: function dashboard_sections_statisticsResources_changeDisplay():void {
                dashboard.sections["statistics-resources"].graphs = {};
                dashboard.sections["statistics-resources"].nodes.graphs.textContent = "";
                dashboard.sections["statistics-resources"].nodes.graphs.setAttribute("data-type", dashboard.sections["statistics-resources"].nodes.graph_display.value);
                dashboard.sections["statistics-resources"].events.change_type();
                dashboard.utility.setState();
            },
            change_type: function dashboard_sections_statisticsResources_changeType():void {
                const keys:string[] = Object.keys(dashboard.sections["statistics-resources"].graphs);
                let index:number = keys.length,
                    keys_graphs:type_graph_keys[],
                    index_graphs:number = 0,
                    graph:Chart = null;
                if (index > 0) {
                    do {
                        index = index - 1;
                        keys_graphs = Object.keys(dashboard.sections["statistics-resources"].graphs[keys[index]]) as type_graph_keys[];
                        index_graphs = keys_graphs.length;
                        if (index_graphs > 0) {
                            do {
                                index_graphs = index_graphs - 1;
                                graph = dashboard.sections["statistics-resources"].graphs[keys[index]][keys_graphs[index_graphs]];
                                if (graph !== null) {
                                    if (graph.canvas !== null && graph.canvas.parentNode !== null) {
                                        graph.canvas.parentNode.parentNode.removeChild(graph.canvas.parentNode);
                                    }
                                    graph.destroy();
                                }
                            } while (index_graphs > 0);
                        }
                    } while (index > 0);
                }
                if (dashboard.sections["statistics-resources"].nodes.graph_display.value === "individual") {
                    dashboard.sections["statistics-resources"].tools.graph_individual(true);
                } else if (dashboard.sections["statistics-resources"].nodes.graph_display.value === "composite") {
                    dashboard.sections["statistics-resources"].tools.graph_composite(true);
                }
                dashboard.utility.setState();
            },
            definitions: function dashboard_sections_statisticsResources_definitions(event:FocusEvent|KeyboardEvent):void {
                const key:KeyboardEvent = event as KeyboardEvent,
                    frequency:number = Number(dashboard.sections["statistics-resources"].nodes.frequency.value),
                    records:number = Number(dashboard.sections["statistics-resources"].nodes.records.value);
                if (key.type === "keyup" && key.key !== "Enter") {
                    return;
                }
                if (isNaN(frequency) === true || isNaN(records) === true) {
                    return;
                }
                dashboard.message.send({
                    data: {
                        frequency: (frequency * 1000),
                        records: records
                    },
                    service: "services_statistics_change"
                });
                dashboard.utility.setState();
            },
        },
        graph_config: {
            colors: [
                "rgba(204,170,51,1)",
                "rgba(153,102,0,1)",
                "rgba(221,102,0,1)",
                "rgba(182,32,0,1)",
                "rgba(64,164,21,1)",
                "rgba(153,53,127,1)",
                "rgba(27,82,153,1)",
                "rgba(128,128,128,1)",
                "rgba(192,192,192,1)",
                "rgba(104,170,71,1)",
                "rgba(53,102,70,1)",
                "rgba(221,72,220,1)",
                "rgba(82,32,140,1)",
                "rgba(164,164,221,1)",
                "rgba(53,53,227,1)",
                "rgba(27,182,253,1)",
                "rgba(28,18,198,1)",
                "rgba(92,92,92,1)"
            ],
            labels: {
                cpu: "CPU Usage %, single core",
                disk_in: "Read",
                disk_out: "Written",
                mem: "Memory Usage %",
                net_in: "Received",
                net_out: "Sent",
                threads: "Process Count"
            },
            title: {
                cpu: "CPU %",
                disk: "Storage Device Usage",
                disk_in: "Bytes Read from Storage Devices",
                disk_out: "Bytes Written to Storage Devices",
                mem: "Memory %",
                net: "Network Usage",
                net_in: "Network Bytes Received",
                net_out: "Network Bytes Sent",
                threads: "Total Processes"
            }
        },
        graphs: {},
        init: function dashboard_sections_statisticsResources_init():void {
            dashboard.sections["statistics-resources"].nodes.frequency.onblur = dashboard.sections["statistics-resources"].events.definitions;
            dashboard.sections["statistics-resources"].nodes.frequency.onkeyup = dashboard.sections["statistics-resources"].events.definitions;
            dashboard.sections["statistics-resources"].nodes.frequency.value = (dashboard.global.payload.stats.frequency / 1000).toString();
            dashboard.sections["statistics-resources"].nodes.graph_display.onchange = dashboard.sections["statistics-resources"].events.change_display;
            dashboard.sections["statistics-resources"].nodes.graph_type.onchange = dashboard.sections["statistics-resources"].events.change_type;
            dashboard.sections["statistics-resources"].nodes.graph_display.selectedIndex = (dashboard.global.state.graph_display === null || dashboard.global.state.graph_display === undefined)
                ? 0
                : dashboard.global.state.graph_display;
            dashboard.sections["statistics-resources"].nodes.graph_type.selectedIndex = (dashboard.global.state.graph_type === null || dashboard.global.state.graph_type === undefined)
                ? 0
                : dashboard.global.state.graph_type;
            dashboard.sections["statistics-resources"].nodes.graphs.setAttribute("data-type", dashboard.sections["statistics-resources"].nodes.graph_display.value);
            dashboard.sections["statistics-resources"].nodes.records.onblur = dashboard.sections["statistics-resources"].events.definitions;
            dashboard.sections["statistics-resources"].nodes.records.onkeyup = dashboard.sections["statistics-resources"].events.definitions;
            dashboard.sections["statistics-resources"].nodes.records.value = dashboard.global.payload.stats.records.toString();
            if (dashboard.global.loaded === true || (dashboard.global.loaded === false && dashboard.global.state.nav === "statistics-resources")) {
                if (dashboard.sections["servers-web"] !== undefined) {
                    dashboard.sections["servers-web"].receive({
                        data: dashboard.global.payload.server,
                        service: "services_server_update"
                    });
                }
                Chart.defaults.color = "#ccc";
                dashboard.sections["statistics-resources"].receive({
                    data: dashboard.global.payload.stats,
                    service: "services_statistics_data"
                });
            }
        },
        nodes: {
            duration: document.getElementById("statistics-resources").getElementsByClassName("section")[0].getElementsByTagName("em")[1],
            frequency: document.getElementById("statistics-resources").getElementsByClassName("form")[0].getElementsByTagName("input")[0],
            graph_display: document.getElementById("statistics-resources").getElementsByClassName("form")[0].getElementsByTagName("select")[1],
            graph_type: document.getElementById("statistics-resources").getElementsByClassName("form")[0].getElementsByTagName("select")[0],
            graphs: document.getElementById("statistics-resources").getElementsByClassName("graphs")[0] as HTMLElement,
            records: document.getElementById("statistics-resources").getElementsByClassName("form")[0].getElementsByTagName("input")[1],
            update: document.getElementById("statistics-resources").getElementsByClassName("section")[0].getElementsByTagName("em")[0]
        },
        receive: function dashboard_sections_statisticsResources_receive(data:socket_data):void {
            const stats:services_statistics_data = data.data as services_statistics_data;
            dashboard.global.payload.stats = stats;
            if (document.activeElement !== dashboard.sections["statistics-resources"].nodes.frequency) {
                dashboard.sections["statistics-resources"].nodes.frequency.value = (stats.frequency / 1000).toString();
            }
            if (document.activeElement !== dashboard.sections["statistics-resources"].nodes.records) {
                dashboard.sections["statistics-resources"].nodes.records.value = stats.records.toString();
            }
            dashboard.sections["statistics-resources"].nodes.update.textContent = stats.now.dateTime(true, dashboard.global.payload.timeZone_offset);
            dashboard.sections["statistics-resources"].nodes.duration.textContent = (stats.duration / 1e9).time_elapsed();
            if (dashboard.sections["statistics-resources"].nodes.graph_display.value === "individual") {
                dashboard.sections["statistics-resources"].tools.graph_individual(false);
            } else if (dashboard.sections["statistics-resources"].nodes.graph_display.value === "composite") {
                dashboard.sections["statistics-resources"].tools.graph_composite(false);
            }
        },
        tools: {
            graph_composite: function dashboard_sections_statisticsResources_graphComposite(force_new:boolean|string):void {
                const keys:string[] = Object.keys(dashboard.global.payload.stats.containers),
                    len:number = keys.length,
                    keys_data:type_graph_keys[] = ["cpu", "mem", "net_in", "net_out", "threads", "disk_in", "disk_out"],
                    keys_len:number = keys_data.length,
                    graph_type:"bar"|"line" = dashboard.sections["statistics-resources"].nodes.graph_type.value as "bar"|"line",
                    dataset = function dashboard_sections_statisticsResources_graphComposite_dataset(type:type_graph_keys):type_graph_datasets {
                        const output:graph_dataset[] = [];
                        let index_key:number = 0;
                        if (len > 0) {
                            const len_color:number = dashboard.sections["statistics-resources"].graph_config.colors.length;
                            index_key = 0;
                            do {
                                if (dashboard.global.payload.stats.containers[keys[index_key]] !== undefined && dashboard.global.payload.stats.containers[keys[index_key]] !== null && (keys[index_key] === "application" || dashboard.global.payload.compose.containers[keys[index_key]] !== undefined)) {
                                    output.push({
                                        backgroundColor: dashboard.sections["statistics-resources"].graph_config.colors[index_key].replace(",1)", ",0.1)"),
                                        borderColor: dashboard.sections["statistics-resources"].graph_config.colors[index_key],
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        data: dashboard.global.payload.stats.containers[keys[index_key]][type].data,
                                        fill: true,
                                        label: (keys[index_key] === "application")
                                            ? "Aphorio"
                                            : (dashboard.global.payload.compose.containers[keys[index_key]] === null || dashboard.global.payload.compose.containers[keys[index_key]] === undefined)
                                                ? keys[index_key]
                                                : dashboard.global.payload.compose.containers[keys[index_key]].name,
                                        pointHoverRadius: 0,
                                        pointRadius: 0,
                                        showLine: true,
                                        tension: 0
                                    });
                                }
                                index_key = index_key + 1;
                            } while (index_key < len && index_key < len_color);
                        }
                        return [output, dashboard.global.payload.stats.containers.application[type].labels];
                    },
                    update = function dashboard_sections_statisticsResources_graphComposite_update(type:type_graph_keys, section:HTMLElement):void {
                        const dataList:type_graph_datasets = dataset(type),
                            graph_item:HTMLCanvasElement = (section === null)
                                ? null
                                : document.createElement("canvas"),
                            graph:Chart = (section === null)
                                ? dashboard.sections["statistics-resources"].graphs.composite[type]
                                : new Chart(graph_item, {
                                    data: {
                                        datasets: dataList[0],
                                        labels: dataList[1]
                                    },
                                    options: {
                                        animation: false,
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        scales: {
                                            x: {
                                                ticks: {
                                                    display: false
                                                }
                                            }
                                        }
                                    },
                                    type: graph_type
                                });
                        if (section === null) {
                            graph.data.datasets = dataList[0];
                            graph.data.labels = dataList[1];
                            graph.update();
                        } else {
                            const div:HTMLElement = document.createElement("div");
                            graph_item.setAttribute("class", "graph");
                            dashboard.sections["statistics-resources"].graphs.composite[type] = graph;
                            div.appendChild(graph_item);
                            section.appendChild(div);
                        }
                    },
                    create = function dashboard_sections_statisticsResources_graphComposite_create(type:type_graph_keys):void {
                        let new_item:boolean = false;
                        const section_div:HTMLElement = (function dashboard_statisticsResources_graphComposite_create_div():HTMLElement {
                                const sections:HTMLCollectionOf<HTMLElement> = dashboard.sections["statistics-resources"].nodes.graphs.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>;
                                let index_sections:number = sections.length;
                                if (index_sections > 0) {
                                    do {
                                        index_sections = index_sections - 1;
                                        if (sections[index_sections].dataset.id === type) {
                                            sections[index_sections].textContent = "";
                                            return sections[index_sections];
                                        }
                                    } while (index_sections > 0);
                                }
                                new_item = true;
                                return document.createElement("div");
                            }()),
                            h4:HTMLElement = document.createElement("h4");

                        section_div.setAttribute("class", "section");
                        section_div.setAttribute("data-id", type);
                        h4.textContent = dashboard.sections["statistics-resources"].graph_config.title[type];
                        section_div.appendChild(h4);
                        update(type, section_div);
                        if (new_item === true) {
                            dashboard.sections["statistics-resources"].nodes.graphs.appendChild(section_div);
                        }
                    };
                let index:number = 0;
                if (dashboard.sections["statistics-resources"].graphs.composite === undefined || dashboard.sections["statistics-resources"].graphs.composite === null) {
                    dashboard.sections["statistics-resources"].graphs.composite = {
                        cpu: null,
                        disk_in: null,
                        disk_out: null,
                        mem: null,
                        net_in: null,
                        net_out: null,
                        threads: null
                    };
                }
                do {
                    if (force_new === true || dashboard.sections["statistics-resources"].graphs.composite[keys_data[index]] === null) {
                        create(keys_data[index]);
                    } else {
                        update(keys_data[index], null);
                    }
                    index = index + 1;
                } while (index < keys_len);
            },
            graph_individual: function dashboard_sections_statisticsResources_graphIndividual(force_new:boolean|string):void {
                const id_list:string[] = Object.keys(dashboard.global.payload.stats.containers),
                    id_len:number = id_list.length,
                    graph_type:"bar"|"line" = dashboard.sections["statistics-resources"].nodes.graph_type.value as "bar"|"line",
                    destroy = function dashboard_sections_statisticsResources_graphIndividual_destroy(id:string):void {
                        if (dashboard.sections["statistics-resources"].graphs[id] !== null && dashboard.sections["statistics-resources"].graphs[id] !== undefined) {
                            const each = function dashboard_sections_statisticsResources_graphIndividual_destroy_each(type:type_graph):void {
                                if (dashboard.sections["statistics-resources"].graphs[id][type] !== null && dashboard.sections["statistics-resources"].graphs[id][type] !== undefined) {
                                    dashboard.sections["statistics-resources"].graphs[id][type].destroy();
                                }
                            };
                            each("cpu");
                            each("mem");
                            each("net");
                            each("threads");
                            if (id !== "application") {
                                each("disk");
                            }
                            dashboard.sections["statistics-resources"].graphs[id] = null;
                        }
                    },
                    update = function dashboard_sections_statisticsResources_graphIndividual_update(id:string, section:HTMLElement):void {
                        const modify = function dashboard_sections_statisticsResources_graphIndividual_update_modify(type:type_graph):void {
                            const dataList:type_graph_datasets = (function dashboard_sections_statisticsResources_graphIndividual_update_modify_dataset():type_graph_datasets {
                                    const dataset0:graph_dataset = {
                                            backgroundColor: dashboard.sections["statistics-resources"].graph_config.colors[0].replace(",1)", ",0.1)"),
                                            borderColor: dashboard.sections["statistics-resources"].graph_config.colors[0],
                                            borderRadius: 4,
                                            borderWidth: 2,
                                            data: (type === "cpu" || type === "mem" || type === "threads")
                                                ? dashboard.global.payload.stats.containers[id][type].data
                                                : dashboard.global.payload.stats.containers[id][`${type}_in` as "disk_in"].data,
                                            fill: true,
                                            label: (type === "cpu" || type === "mem" || type === "threads")
                                                ? dashboard.sections["statistics-resources"].graph_config.labels[type]
                                                : dashboard.sections["statistics-resources"].graph_config.labels[`${type}_in` as "disk_in"],
                                            pointHoverRadius: 0,
                                            pointRadius: 0,
                                            showLine: true,
                                            tension: 0
                                        },
                                        dataset1:graph_dataset = (type === "cpu" || type === "mem" || type === "threads")
                                            ? null
                                            : {
                                                backgroundColor: dashboard.sections["statistics-resources"].graph_config.colors[1].replace(",1)", ",0.1)"),
                                                borderColor: dashboard.sections["statistics-resources"].graph_config.colors[1],
                                                borderRadius: 4,
                                                borderWidth: 2,
                                                data: dashboard.global.payload.stats.containers[id][`${type}_out` as "disk_out"].data,
                                                fill: true,
                                                label: dashboard.sections["statistics-resources"].graph_config.labels[`${type}_out` as "disk_out"],
                                                pointHoverRadius: 0,
                                                pointRadius: 0,
                                                showLine: true,
                                                tension: 0
                                            };
                                    if (type === "cpu" || type === "mem" || type === "threads") {
                                        return [[dataset0], dashboard.global.payload.stats.containers[id][type].labels];
                                    }
                                    return [[dataset0, dataset1], dashboard.global.payload.stats.containers[id][`${type}_in` as "disk_in"].labels];
                                }()),
                                graph_item:HTMLCanvasElement = (section === null)
                                    ? null
                                    : document.createElement("canvas"),
                                graph:Chart = (section === null)
                                    ? dashboard.sections["statistics-resources"].graphs[id][type]
                                    : new Chart(graph_item, {
                                        data: {
                                            datasets: dataList[0],
                                            labels: dataList[1]
                                        },
                                        options: {
                                            animation: false,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: `${(id === "application")
                                                        ? "Aphorio"
                                                        : (dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                                                            ? id
                                                            : dashboard.global.payload.compose.containers[id].name
                                                    } - ${dashboard.sections["statistics-resources"].graph_config.title[type]}`
                                                }
                                            },
                                            responsive: true,
                                            scales: {
                                                x: {
                                                    ticks: {
                                                        display: false
                                                    }
                                                }
                                            }
                                        },
                                        type: graph_type
                                    });
                            if (section === null) {
                                graph.data.datasets = dataList[0];
                                graph.data.labels = dataList[1];
                                graph.update();
                            } else {
                                const div:HTMLElement = document.createElement("div");
                                graph_item.setAttribute("class", "graph");
                                dashboard.sections["statistics-resources"].graphs[id][type] = graph;
                                div.appendChild(graph_item);
                                section.appendChild(div);
                            }
                        };
                        modify("cpu");
                        modify("mem");
                        modify("net");
                        modify("threads");
                        if (id !== "application") {
                            modify("disk");
                        }
                    },
                    create = function dashboard_sections_statisticsResources_graphIndividual_create(id:string):void {
                        let new_item:boolean = false;
                        const section_div:HTMLElement = (function dashboard_sections_statisticsResources_graphIndividual_create_sectionDiv():HTMLElement {
                                const sections:HTMLCollectionOf<HTMLElement> = dashboard.sections["statistics-resources"].nodes.graphs.getElementsByClassName("section") as HTMLCollectionOf<HTMLElement>;
                                let index_sections:number = sections.length;
                                if (index_sections > 0) {
                                    do {
                                        index_sections = index_sections - 1;
                                        if (sections[index_sections].dataset.id === id) {
                                            sections[index_sections].textContent = "";
                                            return sections[index_sections];
                                        }
                                    } while (index_sections > 0);
                                }
                                new_item = true;
                                return document.createElement("div");
                            }()),
                            h4:HTMLElement = document.createElement("h4"),
                            clear:HTMLElement = document.createElement("span"),
                            name_literal:string = (id === "application")
                                ? "Aphorio"
                                : (dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                                    ? id
                                    : dashboard.global.payload.compose.containers[id].name,
                            name:string = (id === "application")
                                ? `Application - ${name_literal}`
                                : `Container - ${name_literal}`;
                        dashboard.sections["statistics-resources"].graphs[id] = {
                            cpu: null,
                            disk: null,
                            mem: null,
                            net: null,
                            threads: null
                        };
                        h4.textContent = name;
                        section_div.appendChild(h4);
                        update(id, section_div);
                        clear.setAttribute("class", "clear");
                        section_div.setAttribute("class", "section");
                        section_div.appendChild(clear);
                        section_div.setAttribute("data-id", id);
                        if (new_item === true) {
                            const sections:NodeListOf<ChildNode> = dashboard.sections["statistics-resources"].nodes.graphs.childNodes,
                                len:number = sections.length;
                            let index:number = 0,
                                section:HTMLElement = null;
                            if (len > 0) {
                                do {
                                    section = sections[index] as HTMLElement;
                                    if (section.getAttribute("class") === "section empty") {
                                        dashboard.sections["statistics-resources"].nodes.graphs.insertBefore(section_div, section);
                                        return;
                                    }
                                    index = index + 1;
                                } while (index < len);
                            }
                            dashboard.sections["statistics-resources"].nodes.graphs.appendChild(section_div);
                        }
                    },
                    empty = function dashboard_sections_statisticsResources_graphIndividual_empty(id:string):void {
                        const h4:HTMLElement = document.createElement("h4"),
                            p:HTMLElement = document.createElement("p"),
                            div:HTMLElement = document.createElement("div"),
                            sections:NodeListOf<ChildNode> = dashboard.sections["statistics-resources"].nodes.graphs.childNodes;
                        let index:number = sections.length,
                            section:HTMLElement = null;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                section = sections[index] as HTMLElement;
                                // remove a populated section that is no longer producing data
                                if (section.dataset.id === id) {
                                    return;
                                }
                            } while (index > 0);
                        }
                        div.setAttribute("class", "section empty");
                        div.setAttribute("data-id", id);
                        h4.textContent = (id === "application")
                            ? "Aphorio Application"
                            : `Container - ${(dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                                ? id
                                : dashboard.global.payload.compose.containers[id].name}`;
                        p.textContent = `Container ${(dashboard.global.payload.compose.containers[id] === null || dashboard.global.payload.compose.containers[id] === undefined)
                            ? id
                            : dashboard.global.payload.compose.containers[id].name} is not running.`;
                        div.appendChild(h4);
                        div.appendChild(p);
                        dashboard.sections["statistics-resources"].nodes.graphs.appendChild(div);
                        destroy(id);
                    },
                    remove = function dashboard_sections_statisticsResources_graphIndividual_remove():void {
                        const sections:NodeListOf<ChildNode> = dashboard.sections["statistics-resources"].nodes.graphs.childNodes;
                        let index:number = sections.length,
                            section:HTMLElement = null;
                        // see if the section is already present and needs to be removed
                        if (index > 0) {
                            do {
                                index = index - 1;
                                section = sections[index] as HTMLElement;
                                // remove a populated section that is no longer producing data
                                if (id_list.includes(section.dataset.id) === false) {
                                    section.parentNode.removeChild(section);
                                }
                            } while (index > 0);
                        }
                    };
                let index:number = 0;
                if (id_len > 0) {
                    do {
                        if (dashboard.global.payload.stats.containers[id_list[index]] === null) {
                            empty(id_list[index]);
                        } else if (force_new === true || dashboard.sections["statistics-resources"].graphs[id_list[index]] === undefined || dashboard.sections["statistics-resources"].graphs[id_list[index]] === null) {
                            create(id_list[index]);
                        } else {
                            update(id_list[index], null);
                        }
                        index = index + 1;
                    } while (index < id_len);
                    remove();
                }
            }
        }
    };
    dashboard.sections["statistics-resources"] = statistics_resources;
};

export default ui_statistics_resources;