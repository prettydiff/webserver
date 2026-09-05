

import dashboard from "../dashboard.ts";
// cspell: words bootable

const ui_disks = function ui_disks():void {
    const disks:section_disks = {
        events: {
            update: function dashboard_sections_disks_update():void {
                dashboard.utility.performance_set("disks");
                dashboard.message.send({data: null, service: "services_os_disk"});
            }
        },
        init: function dashboard_sections_disks_init():void {
            dashboard.sections["disks"].nodes.update_button.onclick = dashboard.sections["disks"].events.update;
            dashboard.sections["disks"].receive({
                data: dashboard.global.payload.os.disk,
                service: "services_os_disk"
            });
            dashboard.sections["disks"].nodes.update_button.setAttribute("data-list", "disk");
        },
        nodes: {
            count: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("em")[0],
            list: document.getElementById("disks").getElementsByClassName("item-list")[0] as HTMLElement,
            update_button: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("button")[0],
            update_duration: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[1],
            update_text: document.getElementById("disks").getElementsByClassName("table-stats")[0].getElementsByTagName("time")[0]
        },
        receive: function dashboard_sections_disks_receive(socket_data:socket_data):void {
            const item:services_os_disk = socket_data.data as services_os_disk,
                output_new:HTMLElement = dashboard.sections["disks"].nodes.list,
                len:number = item.data.length,
                data_item = function dashboard_sections_disks_receive_dataItem(ul:HTMLElement, disk:os_disk_partition[]|string, key:"active"|"bootable"|"bus"|"file_system"|"guid"|"hidden"|"id"|"name"|"partitions"|"path"|"read_only"|"serial"|"size_disk"|"size_free"|"size_total"|"size_used"|"type"):void {
                    const li:HTMLElement = document.createElement("li"),
                        len:number = (key === "partitions")
                            ? item.data[index].partitions.length
                            : 0,
                        strong:HTMLElement = (key === "partitions" && len > 0)
                            ? document.createElement("h4")
                            : document.createElement("strong"),
                        span:HTMLElement = document.createElement("span"),
                        children = function dashboard_sections_disks_receive_dataItem_children(list_data:os_disk_partition[], list_len:number, parent:HTMLElement):void {
                            let index_child:number = 0,
                                warn_test:boolean = null,
                                len_child:number = 0,
                                list:HTMLElement = null;
                            do {
                                list = document.createElement("ul");
                                warn_test = (list_data[index_child].size_free_percent < 16 && list_data[index_child].file_system !== null && list_data[index_child].size_total > 0);
                                if (warn_test === true) {
                                    const warn:HTMLElement = document.createElement("strong"),
                                        p:HTMLElement = document.createElement("p"),
                                        percent:HTMLElement = document.createElement("strong");
                                    warn.textContent = "Warning!";
                                    p.appendChild(warn);
                                    percent.textContent = `${list_data[index_child].size_free_percent}%`;
                                    p.appendText(` Disk partition ${String(list_data[index_child].id)} only has `);
                                    p.appendChild(percent);
                                    p.appendText(" capacity free.");
                                    parent.appendChild(p);
                                    list.setAttribute("class", "os-interface fail-list");
                                } else {
                                    list.setAttribute("class", "os-interface");
                                }
                                data_item(list, String(list_data[index_child].active), "active");
                                data_item(list, String(list_data[index_child].bootable), "bootable");
                                data_item(list, String(list_data[index_child].file_system), "file_system");
                                data_item(list, String(list_data[index_child].hidden), "hidden");
                                data_item(list, String(list_data[index_child].id), "id");
                                data_item(list, String(list_data[index_child].path), "path");
                                data_item(list, String(list_data[index_child].read_only), "read_only");
                                if (list_data[index_child].size_total === 0) {
                                    data_item(list, "0 bytes (0B)", "size_free");
                                } else if (warn_test === false) {
                                    data_item(list, `${list_data[index_child].size_free.bytesLong()}, ${list_data[index_child].size_free_percent}%`, "size_free");
                                } else {
                                    const sfLi:HTMLElement = document.createElement("li"),
                                        sfBad:HTMLElement = document.createElement("strong"),
                                        sfStrong:HTMLElement = document.createElement("strong");
                                    sfBad.setAttribute("class", "fail");
                                    sfBad.textContent = `${list_data[index_child].size_free_percent}%`;
                                    sfStrong.textContent = "Size Free";
                                    sfLi.appendChild(sfStrong);
                                    sfLi.appendText(`${list_data[index_child].size_free.bytesLong()}, `);
                                    sfLi.appendChild(sfBad);
                                    list.appendChild(sfLi);
                                }
                                if (list_data[index_child].size_total === 0) {
                                    data_item(list, `${list_data[index_child].size_used.bytesLong()}`, "size_used");
                                } else {
                                    data_item(list, `${list_data[index_child].size_used.bytesLong()}, ${list_data[index_child].size_used_percent}%`, "size_used");
                                }
                                if (list_data[index_child].size_total === 0) {
                                    data_item(list, "0 bytes (0B)", "size_total");
                                } else {
                                    data_item(list, `${list_data[index_child].size_total.bytesLong()}, 100%`, "size_total");
                                }
                                data_item(list, list_data[index_child].type, "type");
                                len_child = list_data[index_child].children.length;
                                if (len_child > 0) {
                                    const li:HTMLElement = document.createElement("li");
                                    dashboard_sections_disks_receive_dataItem_children(list_data[index_child].children, len_child, li);
                                    list.appendChild(li);
                                }
                                parent.appendChild(list);
                                index_child = index_child + 1;
                            } while (index_child < list_len);
                        };
                    strong.textContent = key.capitalize().replace(/_\w/, function dashboard_sections_disks_receive_dataItem_cap(input:string):string {
                        return ` ${input.replace("_", "").capitalize()}`;
                    });
                    li.appendChild(strong);
                    if (key === "partitions" && len > 0) {
                        span.textContent = String(len);
                        li.appendChild(span);
                        children(item.data[index].partitions, len, li);
                    } else {
                        if (key === "partitions") {
                            span.textContent = "none";
                        } else {
                            span.textContent = disk as string;
                        }
                        li.appendChild(span);
                    }
                    ul.appendChild(li);
                };
            let div:HTMLElement = null,
                ul:HTMLElement = null,
                h3:HTMLElement = null,
                index:number = 0;
            output_new.textContent = "";
            if (len > 0) {
                do {
                    div = document.createElement("div");
                    ul = document.createElement("ul");
                    h3 = document.createElement("h3");
                    h3.textContent = item.data[index].name;
                    div.appendChild(h3);
                    data_item(ul, String(item.data[index].bus), "bus");
                    data_item(ul, String(item.data[index].guid), "guid");
                    data_item(ul, String(item.data[index].name), "name");
                    data_item(ul, String(item.data[index].serial), "serial");
                    data_item(ul, item.data[index].size_disk.bytesLong(), "size_disk");
                    data_item(ul, item.data[index].partitions, "partitions");
                    div.appendChild(ul);
                    div.setAttribute("class", "section");
                    output_new.appendChild(div);
                    index = index + 1;
                } while (index < len);
            }
            dashboard.sections["disks"].nodes.count.textContent = String(len);
            dashboard.sections["disks"].nodes.update_text.textContent = item.time.dateTime(true, dashboard.global.payload.timeZone_offset);
            dashboard.sections["disks"].nodes.update_duration.textContent = dashboard.utility.performance_get("disks");
        },
        time: 0,
        tools: null
    };
    dashboard.sections["disks"] = disks;
};

export default ui_disks;