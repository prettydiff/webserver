
import core from "../browser/core.ts";
import execute from "../dashboard/execute.ts";
import file from "./file.ts";
import global from "../dashboard/global.ts";
import message from "../dashboard/message.ts";
import shared_services from "../dashboard/shared_services.ts";
import tables from "../dashboard/tables.ts";
import test_browser from "../dashboard/test_browser.ts";
import universal from "../core/universal.ts";
import utility from "../dashboard/utility.ts";

import ui_application_logs from "../dashboard/sections/application_logs.ts";
import ui_compose_containers from "../dashboard/sections/compose_containers.ts";
import ui_devices from "../dashboard/sections/devices.ts";
import ui_disks from "../dashboard/sections/disks.ts";
import ui_dns_query from "../dashboard/sections/dns_query.ts";
import ui_file_system from "../dashboard/sections/file_system.ts";
import ui_hash from "../dashboard/sections/hash.ts";
import ui_interfaces from "../dashboard/sections/interfaces.ts";
import ui_message_inspection from "../dashboard/sections/message_inspection.ts";
import ui_notes from "../dashboard/sections/notes.ts";
import ui_os_machine from "../dashboard/sections/os_machine.ts";
import ui_ports_application from "../dashboard/sections/ports_application.ts";
import ui_processes from "../dashboard/sections/processes.ts";
import ui_servers_web from "../dashboard/sections/servers_web.ts";
import ui_services_app from "../dashboard/sections/services_app.ts";
import ui_services_os from "../dashboard/sections/services_os.ts";
import ui_sockets_application_tcp from "../dashboard/sections/sockets_application_tcp.ts";
import ui_sockets_application_udp from "../dashboard/sections/sockets_application_udp.ts";
import ui_sockets_os_tcp from "../dashboard/sections/sockets_os_tcp.ts";
import ui_sockets_os_udp from "../dashboard/sections/sockets_os_udp.ts";
import ui_statistics_resources from "../dashboard/sections/statistics_resources.ts";
import ui_terminal from "../dashboard/sections/terminal.ts";
import ui_test_http from "../dashboard/sections/test_http.ts";
import ui_test_performance from "../dashboard/sections/test_performance.ts";
import ui_test_websocket from "../dashboard/sections/test_websocket.ts";
import ui_udp_socket from "../dashboard/sections/udp_socket.ts";
import ui_users from "../dashboard/sections/users.ts";

import vars from "../core/vars.ts";

const assembler = function utilities_assembler(process_path:string, callback:() => void):void {
    const unwrap = function utilities_assembler_unwrap(fun:() => void):string {
            let str:string = fun.toString().replace(/\n {4}/g, "\n");
            str = str.slice(str.indexOf("{") + 1);
            str = str.slice(str.indexOf("=") + 1);
            str = str.slice(0, str.lastIndexOf("}"));
            // the (\["\w+(-\w+)*"\]) is the more literal code from the author, what Node.js expresses
            // the (\.\w+(-\w+)*) is dot notation, which is what Bun expresses as output
            str = str.replace(/;\s*dashboard\.\w+\s*((\["\w+(-\w+)*"\])|(\.\w+(-\w+)*))?\s*=\s*\w+\s*;\s*$/, "");
            return `${str}`;
        },
        // building out the dashboard browser object
        object = function utilities_assembler_object(store:store_function, features:boolean, first:string):string[] {
            const keys:string[] = Object.keys(store),
                output:string[] = [first],
                len:number = keys.length - 1;
            let index:number = 0;
            do {
                if (features === false || (features === true && vars.environment.features[keys[index] as type_dashboard_features] === true)) {
                    output.push(`"${keys[index]}": ${unwrap(store[keys[index]])},`);
                }
                index = index + 1;
            } while (index < len);
            output.push(`"${keys[index]}": ${unwrap(store[keys[index]])}`);
            return output;
        },
        complete = function utilities_startApplication_taskHTML_complete(key:string):void {
            flags[key] = true;
            if (flags.chart === true && flags.css === true && flags.xterm_css === true && flags.xterm_js === true) {
                const xterm:string = xterm_js.replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, ""),
                    chart:string = chart_js.replace(/\/\/# sourceMappingURL=chart\.umd.min\.js\.map\s*$/, ""),
                    testBrowser:string = (vars.test.testing === true)
                        ? test_browser
                            .toString()
                            .replace(/delay\s*=\s*0/, `delay=${vars.options["delay-time"]}`)
                            .replace(/maxTries\s*=\s*0/, `maxTries=${vars.options["delay-intervals"]}`)
                            .replace(/\/\/ dashboard\.message\.send\(\{data:\s*test,\s*service:\s*"services_test_browser"\}\);\s+return test;/, "dashboard.message.send({data: test, service: \"services_test_browser\"});return test;")
                        : null;
                let total_script:string = null,
                    script:string = dashboard.join("\n")
                        .replace("path: \"\",", `path: "${vars.path.project.replace(/\\/g, "\\\\")
                        .replace(/"/g, "\\\"")}",`)
                        .replace(/\(\s*\)/, "(core)");
                if (vars.test.testing === true) {
                    script = script.replace("\"services_test_browser\": null,", `"services_test_browser": ${testBrowser},`);
                }
                total_script = `${chart + xterm}const universal={bytes:${universal.bytes.toString()},bytes_big:${universal.bytes_big.toString()},capitalize:${universal.capitalize.toString()},commas:${universal.commas.toString()},dateTime:${universal.dateTime.toString()},time_elapsed:${universal.time_elapsed.toString()}};(${script}(${core.toString()}));`;
                vars.environment.dashboard_page = vars.environment.dashboard_page
                    .replace(/Server Management Dashboard/g, `${vars.environment.name.capitalize()} Dashboard `)
                    .replace("replace_javascript", total_script)
                    .replace("<style type=\"text/css\"></style>", `<style type="text/css">${vars.environment.css_complete + xterm_css}</style>`);
                callback();
            }
        },
        flags:store_flag = {
            chart: false,
            css: false,
            xterm_css: false,
            xterm_js: false
        },
        dashboard_map:store_function = {
            execute: execute,
            global: global,
            message: message,
            shared_services: shared_services,
            tables: tables,
            utility: utility
        },
        section_map:store_function = {
            "application-logs": ui_application_logs,
            "compose-containers": ui_compose_containers,
            "devices": ui_devices,
            "disks": ui_disks,
            "dns-query": ui_dns_query,
            "file-system": ui_file_system,
            "hash": ui_hash,
            "interfaces": ui_interfaces,
            "message-inspection": ui_message_inspection,
            "notes": ui_notes,
            "os-machine": ui_os_machine,
            "ports-application": ui_ports_application,
            "processes": ui_processes,
            "servers-web": ui_servers_web,
            "services-app": ui_services_app,
            "services-os": ui_services_os,
            "sockets-application-tcp": ui_sockets_application_tcp,
            "sockets-application-udp": ui_sockets_application_udp,
            "sockets-os-tcp": ui_sockets_os_tcp,
            "sockets-os-udp": ui_sockets_os_udp,
            "statistics-resources": ui_statistics_resources,
            "terminal": ui_terminal,
            "test-http": ui_test_http,
            "test-performance": ui_test_performance,
            "test-websocket": ui_test_websocket,
            "udp=socket": ui_udp_socket,
            "users": ui_users
        },
        section_str:string[] = object(section_map, true, "{"),
        dashboard:string[] = object(dashboard_map, false, "function ui() {const dashboard={");
    let chart_js:string = null,
        xterm_js:string = null,
        xterm_css:string = null;
    section_str.push("}");
    dashboard.push(`,sections: ${section_str.join("\n")}`);
    dashboard.push("};dashboard.execute();}");

    // read xterm.css and xterm.js
    if (vars.environment.features["terminal"] === true || vars.environment.features["compose-containers"] === true) {
        file.read({
            callback: function utilities_startApplication_taskHTML_readXtermCSS(file:Buffer):void {
                xterm_css = file.toString();
                complete("xterm_css");
            },
            location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}css${vars.path.sep}xterm.css`,
            no_file: null,
            section: "startup"
        });
        file.read({
            callback: function utilities_startApplication_taskHTML_readXtermJS(file:Buffer):void {
                xterm_js = file.toString();
                complete("xterm_js");
            },
            location: `${process_path}node_modules${vars.path.sep}@xterm${vars.path.sep}xterm${vars.path.sep}lib${vars.path.sep}xterm.js`,
            no_file: null,
            section: "startup"
        });
    } else {
        flags.xterm_css = true;
        flags.xterm_js = true;
        xterm_js = "";
        xterm_css = "";
    }

    // read chart.js
    if (vars.environment.features["statistics-resources"] === true) {
        file.read({
            callback: function utilities_startApplication_taskHTML_readChart(file:Buffer):void {
                chart_js = file.toString();
                complete("chart");
            },
            location: `${process_path}node_modules${vars.path.sep}chart.js${vars.path.sep}dist${vars.path.sep}chart.umd.min.js`,
            no_file: null,
            section: "startup"
        });
    } else {
        flags.chart = true;
        chart_js = "";
    }

    // read styles.css
    file.read({
        callback: function utilities_startApplication_taskCSS_readCSS(fileContents:Buffer):void {
            const css:string = fileContents.toString();
            vars.environment.css_complete = css.slice(css.indexOf(":root"));
            vars.environment.css_basic = vars.environment.css_complete.slice(0, css.indexOf("/* end basic html */"));
            complete("css");
        },
        location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}styles.css`,
        no_file: null,
        section: "startup"
    });
};

export default assembler;