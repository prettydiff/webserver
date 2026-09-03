

/* cspell: words atupn, cputime, lslogins, pcpu, procs, pwsh, serv, stcp, sudp, volu */

const vars:core_vars = {
        // critical shell commands by operating system
        commands: (function utilities_vars_commands():core_vars_commands {
            const os_vars:os_var_list = {
                "linux": {
                    // check if application is started administratively, true if it returns "0"
                    admin_check: "id -u",
                    // docker compose command
                    compose: "docker compose",
                    // executes the projects's empty.yml fake compose file
                    compose_empty: "",
                    // gets devices plugged into local computer
                    devs: "lspci -v -k",
                    // recursive size of directories
                    directory_size: "du --bytes --summarize",
                    // file system physical disk data
                    disk: "lsblk -Ob --json",
                    // get list of network data from docker container
                    docker_net: "docker exec id cat /proc/net/dev",
                    // get list of active docker containers
                    docker_procs: "docker ps --no-trunc --format json",
                    // read a docker file from Windows Subsystem for Linux, unused in linux as linux does not need a linux subsystem
                    docker_read: "",
                    // get statistical data about active docker containers
                    docker_stats: "docker stats --no-stream --no-trunc --format json",
                    // file interpreter dependency
                    file: "",
                    // open an application
                    open: "xdg-open",
                    // gets disk partition data, unused in linux as the disk command is enough
                    part: "",
                    // gets process list on local OS
                    proc: "ps -eo pid,cputime,pcpu,rss,user,comm= | tail -n +2 | tr -s \" \" \",\"",
                    // get services list on local OS
                    serv: "systemctl list-units --type=service --all --output json",
                    // get list of TCP sockets on local OS
                    stcp: "ss -atupn | tail -n +2 | tr -s \" \" \",\"",
                    // get list of UDP sockets on local OS, unused in linux as the stcp command is enough
                    sudp: "",
                    // get list of local user accounts on local OS
                    user: "lslogins -o user,uid,proc,last-login --time-format iso | tail -n +2 | tr -s \" \" \",\"",
                    // get disk volume data
                    volu: ""

                },
                "win32": {
                    // check if application is started administratively, return a string "true" or "false" value
                    admin_check: "([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)",
                    // docker compose command
                    compose: "docker-compose",
                    // executes the projects's empty.yml fake compose file
                    compose_empty: "",
                    // gets devices plugged into local computer
                    devs: "Get-PNPDevice | ConvertTo-json",
                    // recursive size of directories
                    directory_size: "Get-ChildItem -recurse | measure-object -property length -sum | select-object -ExpandProperty sum",
                    // file system physical disk data
                    disk: "Get-Disk | ConvertTo-JSON -compress -depth 2",
                    // get list of network data from docker container
                    docker_net: "docker exec id cat /proc/net/dev",
                    // get list of active docker containers
                    docker_procs: "docker ps --no-trunc --format json",
                    // read a docker file from Windows Subsystem for Linux
                    docker_read: "wsl -e sh -c \"cat address\"",
                    // get statistical data about active docker containers
                    docker_stats: "docker stats --no-stream --no-trunc --format json",
                    // file interpreter dependency
                    file: "",
                    // open an application
                    open: "start",
                    // gets disk partition data
                    part: "Get-Partition | ConvertTo-JSON -compress -depth 2",
                    // gets process list on local OS
                    proc: "Get-Process -IncludeUserName | Select-Object id, cpu, pm, name, username | ConvertTo-JSON -compress -depth 1",
                    // get services list on local OS
                    serv: "Get-Service | ConvertTo-JSON -compress -depth 2",
                    // get list of TCP sockets on local OS
                    stcp: "Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    // get list of UDP sockets on local OS
                    sudp: "Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess | ConvertTo-JSON -compress -depth 2",
                    // get list of local user accounts on local OS
                    user: "Get-LocalUser | ConvertTo-JSON -compress -depth 1",
                    // get disk volume data
                    volu: "Get-Volume | ConvertTo-JSON -compress -depth 2"
                }
            };
            return os_vars[process.platform];
        }()),
        // primary data store, data for services, in-memory database
        data: {
            // docker compose environmental variables
            compose_variables: {},
            // docker image details and compose files
            containers: {},
            // log entries
            logs: [],
            // list of dashboard UI sockets inspecting web server traffic or docker logs
            message_inspection: [],
            // notes from UI notes section
            notes: "",
            // stores the port information for containers and services managed by this application
            ports_application: [],
            // objects describing web servers and contains objects describing their sockets
            server: {},
            // the list of tcp socket data, services_socket_application_tcp[]
            sockets_tcp: [],
            // the list of udp socket data, services_udp_socket[]
            sockets_udp: []
        },
        // describes data, not an in-memory database
        data_meta: {
            // time of last update
            compose_time: 0,
            // time of last port update
            ports_application: 0,
            // time of last sockets update
            sockets: 0
        },
        // storage of service objects that are not associated with dashboard service messaging
        data_store: {
            // the actual web server objects and their actual socket objects
            server: {},
            // list of application created UDP sockets
            sockets_udp: []
        },
        // general storage area for static assets used by the application
        environment: {
            // whether the application believes docker and docker compose are executing as an OS service
            compose_status: null,
            // less css for system generated web pages on web servers
            css_basic: "",
            // more complete css for the dashboard
            css_complete: "",
            // the fully assembled dashboard HTML after dynamic changes during build time with css and JavaScript included
            dashboard_page: "",
            // last git commit date/time
            date_commit: 0,
            // The future time when to kill this process if in demo mode
            demo_kill: 0,
            // supported features of this running instance
            features: {
                "application-logs": true,
                "compose-containers": true,
                "devices": true,
                "disks": true,
                "dns-query": true,
                "file-system": true,
                "hash": true,
                "interfaces": true,
                "message-inspection": true,
                "notes": true,
                "os-machine": true,
                "ports-application": true,
                "processes": true,
                "servers-web": true,
                "services-app": true,
                "services-os": true,
                "sockets-application-tcp": true,
                "sockets-application-udp": true,
                "sockets-os-tcp": true,
                "sockets-os-udp": true,
                "statistics-resources": true,
                "terminal": true,
                "test-http": true,
                "test-performance": true,
                "test-websocket": true,
                "udp-socket": true,
                "users": true
            },
            // whether linux "file" command is available in the OS system path
            file: false,
            // last git commit hash
            git_hash: "",
            // list of supported hash algorithm names
            hashes: [],
            // the HTTP request header of the dashboard page request, used as a default value for the dashboard's http test tool
            http_request: "",
            // a list of local network addresses as determined from active network interfaces on the OS
            interfaces: [
                "localhost",
                "127.0.0.1",
                "::1",
                "[::1]"
            ],
            // license name
            license: "AGPLv3",
            // whether the application has completed its startup tasks
            loading: true,
            // a store of objects representing a log entry
            logs: {
                max: 5000,
                total: 0
            },
            // this application's name
            name: "aphorio",
            // where the source code lives
            repository: "https://github.com/prettydiff/aphorio",
            // a list of data service definitions used by this application
            services_app: [],
            // a start date time value for use in the browser
            start_date: Date.now(),
            // the earliest recorded time this application starts
            start_time: process.hrtime.bigint(),
            // the file system paths of locally available command shells
            terminal: (process.platform === "win32")
                ? [
                    "C:\\Program Files\\PowerShell\\7\\pwsh.exe",
                    "C:\\Program Files\\PowerShell\\7-preview\\pwsh.exe",
                    "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
                    "C:\\Windows\\System32\\cmd.exe",
                    "C:\\Program Files\\Git\\bin\\bash.exe",
                    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
                    "C:\\cygwin64\\bin\\bash.exe",
                    "C:\\msys64\\usr\\bin\\bash.exe"
                ]
                : [],
            // the amount of time required to covert local time to UTC time
            timeZone_offset: 0,
            version: "0.0.0"
        },
        // a list of unique identifiers that are intended to be saved as state data
        id: {
            // the web server id that is the dashboard's web server
            dashboard_server: "",
            // a unique identifier to describe the machine running this application instance
            machine: ""
        },
        // command line options for running this application
        options: {
            "browser": null,
            "delay-intervals": 250,
            "delay-time": 50,
            "demo": false,
            "list": null,
            "no-color": false,
            "no-exit": false,
            "port-open": 0,
            "port-secure": 0,
            "stop-on-fail": false,
            "test": false,
            "test-verbose": false
        },
        // raw OS data
        os: {
            devs: {
                data: [],
                time: 0
            },
            disk: {
                data: [],
                time: 0
            },
            intr: {
                data: null,
                time: 0
            },
            main: {
                machine: {
                    cpu: {
                        arch: "",
                        cores: 0,
                        endianness: "",
                        frequency: 0,
                        name: ""
                    },
                    memory: {
                        free: 0,
                        total: 0
                    }
                },
                os: {
                    env: {},
                    hostname: "",
                    name: "",
                    path: [],
                    platform: "",
                    release: "",
                    type: "",
                    uptime: 0
                },
                process: {
                    admin: false,
                    arch: "",
                    argv: [],
                    cpuSystem: 0,
                    cpuUser: 0,
                    cwd: "",
                    memory: {
                        external: 0,
                        rss: 0,
                        V8: 0
                    },
                    pid: 0,
                    platform: "",
                    ppid: 0,
                    uptime: 0,
                    versions: {}
                },
                time: 0,
                user_account: {
                    gid: 0,
                    homedir: "",
                    uid: 0
                }
            },
            proc: {
                data: [],
                time: 0
            },
            serv: {
                data: [],
                time: 0
            },
            stcp: {
                data: [],
                time: 0
            },
            sudp: {
                data: [],
                time: 0
            },
            time: 0,
            user: {
                data: [],
                time: 0
            }
        },
        // commonly used file system path addresses that are validated at start up
        path: {
            cgroup: "",
            compose: "",
            compose_empty: "",
            node: "",
            process: "",
            project: "",
            sep: "/",
            servers: ""
        },
        // an information store necessary for calculating this application's portion of the OS performance statistics
        stats: {
            children: 1,
            containers: {},
            duration: 0,
            frequency: 20000,
            net_in: 0,
            net_out: 0,
            now: 0,
            records: 10
        },
        // data properties necessary for executing test automation
        test: {
            browser_args: [],
            browser_child: null,
            browser_start: false,
            counts: {},
            index: 0,
            list: null,
            magicString: "AW#E$RF1SA9DFY^HDfg4hw5se45tDA234",
            store: null,
            test_browser: null,
            testing: false,
            total_assertions: 0,
            total_assertions_fail: 0,
            total_lists: 0,
            total_tests: 0,
            total_tests_fail: 0,
            total_tests_skipped: 0,
            total_time_end: 0n,
            total_time_start: 0n
        },
        // ASCII text decoration for terminal emulators
        text: {
            angry    : "\u001b[1m\u001b[31m",
            blue     : "\u001b[34m",
            bold     : "\u001b[1m",
            boldLine : "\u001b[1m\u001b[4m",
            clear    : "\u001b[24m\u001b[22m",
            cyan     : "\u001b[36m",
            green    : "\u001b[32m",
            noColor  : "\u001b[39m",
            none     : "\u001b[0m",
            purple   : "\u001b[35m",
            red      : "\u001b[31m",
            underline: "\u001b[4m",
            yellow   : "\u001b[33m"
        }
    };

export default vars;