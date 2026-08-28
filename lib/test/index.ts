
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import test_listLocalBrowserApplicationLogs from "./list_local_browser_application-logs.ts";
import test_listLocalBrowserComposeContainers from "./list_local_browser_compose-containers.ts";
import test_listLocalBrowserDevices from "./list_local_browser_devices.ts";
import test_listLocalBrowserDisks from "./list_local_browser_disks.ts";
import test_listLocalBrowserDNSQuery from "./list_local_browser_dns-query.ts";
import test_listLocalBrowserFAQ from "./list_local_browser_faq.ts";
import test_listLocalBrowserFileSystem from "./list_local_browser_file-system.ts";
import test_listLocalBrowserHash from "./list_local_browser_hash.ts";
import test_listLocalBrowserHelp from "./list_local_browser_help.ts";
import test_listLocalBrowserHTTP from "./list_local_browser_http.ts";
import test_listLocalBrowserInterfaces from "./list_local_browser_interfaces.ts";
import test_listLocalBrowserNotes from "./list_local_browser_notes.ts";
import test_listLocalBrowserOSMachine from "./list_local_browser_os-machine.ts";
import test_listLocalBrowserPortsApplication from "./list_local_browser_ports-application.ts";
import test_listLocalBrowserProcesses from "./list_local_browser_processes.ts";
import test_listLocalBrowserServersWeb from "./list_local_browser_servers-web.ts";
import test_listLocalBrowserServicesOS from "./list_local_browser_services-os.ts";
import test_listLocalBrowserServicesApp from "./list_local_browser_services-app.ts";
import test_listLocalBrowserSocketsApplicationTCP from "./list_local_browser_sockets-application-tcp.ts";
import test_listLocalBrowserSocketsOS_TCP from "./list_local_browser_sockets-os-tcp.ts";
import test_listLocalBrowserSocketsOS_UDP from "./list_local_browser_sockets-os-udp.ts";
import test_listLocalBrowserStart from "./list_local_browser_start.ts";
import test_listLocalBrowserTerminal from "./list_local_browser_terminal.ts";
import test_listLocalBrowserUsers from "./list_local_browser_users.ts";
import test_listLocalBrowserTestWebSocket from "./list_local_browser_test-webSocket.ts";
import test_runner from "./runner.ts";
import test_summary from "./summary.ts";
import vars from "../core/vars.ts";

const test_index = function test_index():void {
    let total_lists:number = 0;
    const list:test_list[] = (vars.test.list === null)
            ? [
                test_listLocalBrowserStart(),
                test_listLocalBrowserApplicationLogs(),
                test_listLocalBrowserComposeContainers(),
                test_listLocalBrowserDevices(),
                test_listLocalBrowserDisks(),
                test_listLocalBrowserDNSQuery(),
                test_listLocalBrowserFAQ(),
                test_listLocalBrowserFileSystem(),
                test_listLocalBrowserHash(),
                test_listLocalBrowserHelp(),
                test_listLocalBrowserHTTP(),
                test_listLocalBrowserInterfaces(),
                test_listLocalBrowserNotes(),
                test_listLocalBrowserOSMachine(),
                test_listLocalBrowserPortsApplication(),
                test_listLocalBrowserProcesses(),
                test_listLocalBrowserServersWeb(),
                test_listLocalBrowserServicesOS(),
                test_listLocalBrowserServicesApp(),
                test_listLocalBrowserSocketsApplicationTCP(),
                test_listLocalBrowserSocketsOS_TCP(),
                test_listLocalBrowserSocketsOS_UDP(),
                test_listLocalBrowserTerminal(),
                test_listLocalBrowserTestWebSocket(),
                test_listLocalBrowserUsers(),
            ]
            : [
                // @ts-expect-error - a dynamically imported list could be a function that returns the list
                vars.test.list()
            ],
        len_list:number = list.length,
        callback = function test_index_callback(name:string):void {
            total_lists = total_lists + 1;
            if (total_lists === len_list || (vars.options["stop-on-fail"] === true && vars.test.counts[name].assertions_fail > 0)) {
                let count:number = 0;
                const removed = function test_index_callback_removed():void {
                    count = count + 1;
                    if (count > 2) {
                        vars.test.total_time_end = process.hrtime.bigint();
                        test_summary(name, true);
                    }
                };
                // in the context of testing vars.path.project is actually ${vars.path.project}test so removing files does not harm the project runtime
                file.remove({
                    callback: removed,
                    exclusions: [],
                    location: `${vars.path.project}compose`,
                    section: "startup"
                });
                file.remove({
                    callback: removed,
                    exclusions: [],
                    location: `${vars.path.project}servers`,
                    section: "startup"
                });
                file.remove({
                    callback: removed,
                    exclusions: [],
                    location: `${vars.path.project}servers.json`,
                    section: "startup"
                });
            } else {
                test_summary(name, false);
                test_runner.list(list[total_lists], test_index_callback);
            }
        };
    log.shell(["", `Starting test automation for ${len_list} lists.`, ""]);
    vars.test.total_time_start = process.hrtime.bigint();
    test_runner.list(list[total_lists], callback);
};

// missing these tests
//
// UDP Socket
// statistics_resources
// App UDP Sockets
// WebSocket Test - Incomplete

export default test_index;