
import vars from "../core/vars.ts";

// cspell: disable

const os_demo = function utilities_osDemo(type_os:type_os_services, callback:(output:socket_data) => void):void {
    const now:number = Date.now(),
        devices:services_os_devs = {
            data: [
                {
                    kernel_module: 'ie31200_edac',
                    name: 'Intel Corporation Xeon E3-1200 v6/7th Gen Core Processor Host Bridge/DRAM Registers (rev 05)',
                    type: 'Host bridge'
                },
                {
                    kernel_module: 'pcieport',
                    name: 'Intel Corporation 6th-10th Gen Core Processor PCIe Controller (x16) (rev 05) (prog-if 00 [Normal decode])',
                    type: 'PCI bridge'
                },
                {
                    kernel_module: 'xhci_pci',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family USB 3.0 xHCI Controller (rev 31) (prog-if 30 [XHCI])',
                    type: 'USB controller'
                },
                {
                    kernel_module: 'intel_pch_thermal',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family Thermal Subsystem (rev 31)',
                    type: 'Signal processing controller'
                },
                {
                    kernel_module: 'mei_me',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family MEI Controller #1 (rev 31)',
                    type: 'Communication controller'
                },
                {
                    kernel_module: 'serial',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family KT Redirection (rev 31) (prog-if 02 [16550])',
                    type: 'Serial controller'
                },
                {
                    kernel_module: 'ahci',
                    name: 'Intel Corporation Q170/Q150/B150/H170/H110/Z170/CM236 Chipset SATA Controller [AHCI Mode] (rev 31) (prog-if 01 [AHCI 1.0])',
                    type: 'SATA controller'
                },
                {
                    kernel_module: 'snd_hda_intel',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family HD Audio Controller (rev 31)',
                    type: 'Audio device'
                },
                {
                    kernel_module: 'i2c_i801',
                    name: 'Intel Corporation 100 Series/C230 Series Chipset Family SMBus (rev 31)',
                    type: 'SMBus'
                },
                {
                    kernel_module: 'e1000e',
                    name: 'Intel Corporation Ethernet Connection (2) I219-LM (rev 31)',
                    type: 'Ethernet controller'
                },
                {
                    kernel_module: 'nouveau',
                    name: 'NVIDIA Corporation GP107GL [Quadro P620] (rev a1) (prog-if 00 [VGA controller])',
                    type: 'VGA compatible controller'
                },
                {
                    kernel_module: 'snd_hda_intel',
                    name: 'NVIDIA Corporation GP107GL High Definition Audio Controller (rev a1)',
                    type: 'Audio device'
                }
            ],
            time: now
        },
        disks:services_os_disk = {
            data: [
                {
                    bus: 'sata',
                    guid: 'ba987531-4874-e158-c271-05ef9b4f897c',
                    id: 'ba987531-4874-e158-c271-05ef9b4f897c',
                    name: 'TOSHIBA MG07ACA14TE',
                    partitions: [{"active":true,"bootable":false,"children":[],"diskId":"ba987531-4874-e158-c271-05ef9b4f897c","diskName":"TOSHIBA MG07ACA14TE","file_system":"btrfs","hidden":false,"id":"62690f4a-c23f-409b-88dd-80dbd463d51a","path":"/dev/md0","read_only":false,"size_free":257014775808,"size_free_percent":2,"size_total":14000384376832,"size_used":13740429983744,"size_used_percent":98,"type":"raid1"}],
                    serial: '8070A03YF9HG',
                    size_disk: 14000519643136
                },
                {
                    bus: 'sata',
                    guid: 'ba987531-4874-e158-c271-05ef9b4f897c',
                    id: 'ba987531-4874-e158-c271-05ef9b4f897c',
                    name: 'WDC WUH721414ALE604',
                    partitions: [{"active":true,"bootable":false,"children":[],"diskId":"ba987531-4874-e158-c271-05ef9b4f897c","diskName":"WDC WUH721414ALE604","file_system":"btrfs","hidden":false,"id":"62690f4a-c23f-409b-88dd-80dbd463d51a","path":"/dev/md0","read_only":false,"size_free":257014775808,"size_free_percent":2,"size_total":14000384376832,"size_used":13740429983744,"size_used_percent":98,"type":"raid1"}],
                    serial: '9RJK7VJL',
                    size_disk: 14000519643136
                },
                {
                    bus: 'sata',
                    guid: null,
                    id: null,
                    name: 'SSDSCKKB240G8R',
                    partitions: [
                        {"active":true,"bootable":true,"children":[],"diskId":null,"diskName":"SSDSCKKB240G8R","file_system":"btrfs","hidden":false,"id":"436b18f8-48da-48f9-a376-d11d6f76ef85","path":"/dev/sdc1","read_only":false,"size_free":115147829248,"size_free_percent":48,"size_total":239032336384,"size_used":121601085440,"size_used_percent":51,"type":"Linux"},
                        {"active":false,"bootable":false,"children":[],"diskId":null,"diskName":"SSDSCKKB240G8R","file_system":null,"hidden":false,"id":null,"path":"/dev/sdc2","read_only":false,"size_free":0,"size_free_percent":0,"size_total":0,"size_used":0,"size_used_percent":0,"type":"Extended"},
                        {"active":true,"bootable":false,"children":[],"diskId":null,"diskName":"SSDSCKKB240G8R","file_system":"swap","hidden":true,"id":"f7253ce3-97e9-4e41-a436-d1247ee516fc","path":"/dev/sdc5","read_only":false,"size_free":0,"size_free_percent":0,"size_total":0,"size_used":0,"size_used_percent":0,"type":"Linux swap / Solaris"}
                    ],
                    serial: 'PHYH152102KA240J',
                    size_disk: 240057409536
                },
                {
                    bus: 'sata',
                    guid: null,
                    id: null,
                    name: 'HL-DT-ST DVD+/-RW GU90N',
                    partitions: [],
                    serial: 'M1DK13A2506',
                    size_disk: 1073741312
                }
            ],
            time: now
        },
        interfaces:services_os_intr = {
            data: {
                lo: [
                    {
                        address: '127.0.0.1',
                        netmask: '255.0.0.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '127.0.0.1/8'
                    },
                    {
                        address: '::1',
                        netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: true,
                        cidr: '::1/128',
                        scopeid: 0
                    }
                ],
                enp0s31f6: [
                    {
                        address: '192.168.8.9',
                        netmask: '255.255.255.0',
                        family: 'IPv4',
                        mac: 'dd:ee:ff:22:55:66',
                        internal: false,
                        cidr: '192.168.8.9/24'
                    },
                    {
                        address: '2600:5678:abcd:1234::4',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'dd:ee:ff:22:55:77',
                        internal: false,
                        cidr: '2600:5678:abcd:1234::4/64',
                        scopeid: 0
                    },
                    {
                        address: 'fe80::da9e:f3ff:fe2e:516f',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'dd:ee:ff:22:55:88',
                        internal: false,
                        cidr: 'fe80::da9e:f3ff:fe2e:516f/64',
                        scopeid: 2
                    }
                ],
                tailscale0: [
                    {
                        address: '200.11.22.33',
                        netmask: '255.255.255.255',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '200.11.22.44/32'
                    },
                    {
                        address: 'fd7a:115c:a1e0::6a3b:630e',
                        netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: 'fd7a:115c:a1e0::6a3b:630e/128',
                        scopeid: 0
                    },
                    {
                        address: 'fe80::9918:a032:d894:21e4',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: 'fe80::9918:a032:d894:21e4/64',
                        scopeid: 3
                    }
                ],
                wg0: [
                    {
                        address: '192.168.8.4',
                        netmask: '255.255.255.0',
                        family: 'IPv4',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '192.168.8.11/24'
                    },
                    {
                        address: '2600:5678:abcd:1234::5',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '00:00:00:00:00:00',
                        internal: false,
                        cidr: '2600:5678:abcd:1234::5/64',
                        scopeid: 0
                    }
                ],
                'br-762c62a752f9': [
                    {
                        address: '172.12.6.6',
                        netmask: '255.255.0.0',
                        family: 'IPv4',
                        mac: '33:ee:ff:22:55:11',
                        internal: false,
                        cidr: '172.12.6.7/16'
                    },
                    {
                        address: 'fe80::30ea:e9ff:fe29:9cb1',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '33:ee:ff:22:55:22',
                        internal: false,
                        cidr: 'fe80::30ea:e9ff:fe29:9cb1/64',
                        scopeid: 5
                    }
                ],
                veth37bbb79: [
                    {
                        address: 'fe80::c818:7aff:feae:8aa1',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'cc:ee:ff:22:55:55',
                        internal: false,
                        cidr: 'fe80::c818:7aff:feae:8aa1/64',
                        scopeid: 8
                    }
                ],
                veth0df0d8d: [
                    {
                        address: 'fe80::c4ce:9cff:fea4:f330',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'cc:ee:ff:22:55:34',
                        internal: false,
                        cidr: 'fe80::c4ce:9cff:fea4:f330/64',
                        scopeid: 11
                    }
                ],
                vethc5caa04: [
                    {
                        address: 'fe80::186f:79ff:feb5:e72d',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '11:ee:ff:22:55:66',
                        internal: false,
                        cidr: 'fe80::186f:79ff:feb5:e72d/64',
                        scopeid: 12
                    }
                ],
                veth502d7dd: [
                    {
                        address: 'fe80::88e0:4fff:fe49:b998',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '88:ee:ff:22:55:99',
                        internal: false,
                        cidr: 'fe80::88e0:4fff:fe49:b998/64',
                        scopeid: 13
                    }
                ],
                veth4d46e75: [
                    {
                        address: 'fe80::387d:4dff:fe07:f95f',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '33:ee:ff:22:55:12',
                        internal: false,
                        cidr: 'fe80::387d:4dff:fe07:f95f/64',
                        scopeid: 14
                    }
                ],
                vethb5f1609: [
                    {
                        address: 'fe80::a47c:daff:fe1b:eab',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'aa:ee:ff:22:55:bb',
                        internal: false,
                        cidr: 'fe80::a47c:daff:fe1b:eab/64',
                        scopeid: 15
                    }
                ],
                veth5fd00cb: [
                    {
                        address: 'fe80::481f:b2ff:fec5:435a',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: '44:ee:ff:22:55:55',
                        internal: false,
                        cidr: 'fe80::481f:b2ff:fec5:435a/64',
                        scopeid: 17
                    }
                ],
                veth90901f8: [
                    {
                        address: 'fe80::bc68:73ff:fe02:35c3',
                        netmask: 'ffff:ffff:ffff:ffff::',
                        family: 'IPv6',
                        mac: 'ee:ee:ff:22:55:99',
                        internal: false,
                        cidr: 'fe80::bc68:73ff:fe02:35c3/64',
                        scopeid: 19
                    }
                ]
            },
            time: now
        },
        main:services_os_main = {
            machine: {
                cpu: {
                    arch: 'x64',
                    cores: 8,
                    endianness: 'LE',
                    frequency: 4083,
                    name: 'Intel(R) Xeon(R) CPU E3-1270 v6 @ 3.80GHz'
                },
                memory: { free: 22824980480, total: 33562828800 }
            },
            os: {
                env: {
                LANG: 'en_US.UTF-8',
                LS_COLORS: 'rs=0:di=01;34:ln=01;36:mh=00:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:mi=00:su=37;41:sg=30;43:ca=00:tw=30;42:ow=34;42:st=37;44:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arc=01;31:*.arj=01;31:*.taz=01;31:*.lha=01;31:*.lz4=01;31:*.lzh=01;31:*.lzma=01;31:*.tlz=01;31:*.txz=01;31:*.tzo=01;31:*.t7z=01;31:*.zip=01;31:*.z=01;31:*.dz=01;31:*.gz=01;31:*.lrz=01;31:*.lz=01;31:*.lzo=01;31:*.xz=01;31:*.zst=01;31:*.tzst=01;31:*.bz2=01;31:*.bz=01;31:*.tbz=01;31:*.tbz2=01;31:*.tz=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.war=01;31:*.ear=01;31:*.sar=01;31:*.rar=01;31:*.alz=01;31:*.ace=01;31:*.zoo=01;31:*.cpio=01;31:*.7z=01;31:*.rz=01;31:*.cab=01;31:*.wim=01;31:*.swm=01;31:*.dwm=01;31:*.esd=01;31:*.avif=01;35:*.jpg=01;35:*.jpeg=01;35:*.mjpg=01;35:*.mjpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.svg=01;35:*.svgz=01;35:*.mng=01;35:*.pcx=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.m2v=01;35:*.mkv=01;35:*.webm=01;35:*.webp=01;35:*.ogm=01;35:*.mp4=01;35:*.m4v=01;35:*.mp4v=01;35:*.vob=01;35:*.qt=01;35:*.nuv=01;35:*.wmv=01;35:*.asf=01;35:*.rm=01;35:*.rmvb=01;35:*.flc=01;35:*.avi=01;35:*.fli=01;35:*.flv=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.yuv=01;35:*.cgm=01;35:*.emf=01;35:*.ogv=01;35:*.ogx=01;35:*.aac=00;36:*.au=00;36:*.flac=00;36:*.m4a=00;36:*.mid=00;36:*.midi=00;36:*.mka=00;36:*.mp3=00;36:*.mpc=00;36:*.ogg=00;36:*.ra=00;36:*.wav=00;36:*.oga=00;36:*.opus=00;36:*.spx=00;36:*.xspf=00;36:*~=00;90:*#=00;90:*.bak=00;90:*.old=00;90:*.orig=00;90:*.part=00;90:*.rej=00;90:*.swp=00;90:*.tmp=00;90:*.dpkg-dist=00;90:*.dpkg-old=00;90:*.ucf-dist=00;90:*.ucf-new=00;90:*.ucf-old=00;90:*.rpmnew=00;90:*.rpmorig=00;90:*.rpmsave=00;90:',
                TERM: 'xterm-256color',
                PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
                MAIL: '/var/mail/root',
                LOGNAME: 'root',
                USER: 'root',
                HOME: '/root',
                SHELL: '/bin/bash',
                SUDO_COMMAND: '/home/cheney/.nvm/versions/node/v26.7.0/bin/node /home/cheney/webserver/lib/index.ts',
                SUDO_USER: 'cheney',
                SUDO_UID: '1000',
                SUDO_GID: '1000'
                },
                hostname: 'server',
                name: '#1 SMP PREEMPT_DYNAMIC Debian 6.1.170-3 (2026-05-08)',
                path: [
                '/usr/local/sbin',
                '/usr/local/bin',
                '/usr/sbin',
                '/usr/bin',
                '/sbin',
                '/bin'
                ],
                platform: 'linux',
                release: '6.1.0-47-amd64',
                type: 'Linux',
                uptime: 880634.86
            },
            process: {
                admin: true,
                arch: 'x64',
                argv: [
                '/home/cheney/.nvm/versions/node/v26.7.0/bin/node',
                '/home/cheney/webserver/lib/index.ts'
                ],
                cpuSystem: 0.03088,
                cpuUser: 0.443905,
                cwd: '/home/cheney/webserver',
                memory: { external: 8273615, rss: 129601536, V8: 21221840 },
                pid: 3451951,
                platform: 'linux',
                ppid: 3451950,
                uptime: 0.271590891,
                versions: {
                node: '26.7.0',
                acorn: '8.18.0',
                ada: '4.0.0',
                amaro: '1.1.11',
                ares: '1.34.8',
                brotli: '1.2.0',
                cldr: '48.0',
                icu: '78.3',
                libffi: '3.7.1',
                lief: '0.17.0',
                llhttp: '9.4.3',
                merve: '1.2.2',
                modules: '147',
                napi: '10',
                nbytes: '0.1.4',
                ncrypto: '0.0.1',
                nghttp2: '1.70.0',
                nghttp3: '',
                ngtcp2: '',
                openssl: '3.5.7',
                simdjson: '4.6.6',
                simdutf: '7.7.0',
                sqlite: '3.53.4',
                tz: '2026c',
                undici: '8.9.0',
                unicode: '17.0',
                uv: '1.52.1',
                uvwasi: '0.0.23',
                v8: '14.6.202.34-node.28',
                zlib: '1.3.2.1-motley-42c2f19',
                zstd: '1.5.7'
                }
            },
            time: now,
            user_account: { gid: 1000, homedir: '/root', uid: 1000 }
        },
        processes:services_os_proc = {
            data: [
                {
                    id: 1,
                    memory: 11948032,
                    name: 'systemd',
                    percent: 0,
                    time: 9,
                    user: 'root'
                },
                {
                    id: 2,
                    memory: 0,
                    name: 'kthreadd',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 3,
                    memory: 0,
                    name: 'rcu_gp',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 4,
                    memory: 0,
                    name: 'rcu_par_gp',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 5,
                    memory: 0,
                    name: 'slub_flushwq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 6,
                    memory: 0,
                    name: 'netns',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 8,
                    memory: 0,
                    name: 'kworker/0:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 10,
                    memory: 0,
                    name: 'mm_percpu_wq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 11,
                    memory: 0,
                    name: 'rcu_tasks_kthread',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 12,
                    memory: 0,
                    name: 'rcu_tasks_rude_kthread',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 13,
                    memory: 0,
                    name: 'rcu_tasks_trace_kthread',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 14,
                    memory: 0,
                    name: 'ksoftirqd/0',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 15,
                    memory: 0,
                    name: 'rcu_preempt',
                    percent: 0,
                    time: 141,
                    user: 'root'
                },
                {
                    id: 16,
                    memory: 0,
                    name: 'migration/0',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 18,
                    memory: 0,
                    name: 'cpuhp/0',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 19,
                    memory: 0,
                    name: 'cpuhp/1',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 20,
                    memory: 0,
                    name: 'migration/1',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 21,
                    memory: 0,
                    name: 'ksoftirqd/1',
                    percent: 0,
                    time: 12,
                    user: 'root'
                },
                {
                    id: 24,
                    memory: 0,
                    name: 'cpuhp/2',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 25,
                    memory: 0,
                    name: 'migration/2',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 26,
                    memory: 0,
                    name: 'ksoftirqd/2',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 28,
                    memory: 0,
                    name: 'kworker/2:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 29,
                    memory: 0,
                    name: 'cpuhp/3',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 30,
                    memory: 0,
                    name: 'migration/3',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 31,
                    memory: 0,
                    name: 'ksoftirqd/3',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 33,
                    memory: 0,
                    name: 'kworker/3:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 34,
                    memory: 0,
                    name: 'cpuhp/4',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 35,
                    memory: 0,
                    name: 'migration/4',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 36,
                    memory: 0,
                    name: 'ksoftirqd/4',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 38,
                    memory: 0,
                    name: 'kworker/4:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 39,
                    memory: 0,
                    name: 'cpuhp/5',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 40,
                    memory: 0,
                    name: 'migration/5',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 41,
                    memory: 0,
                    name: 'ksoftirqd/5',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 43,
                    memory: 0,
                    name: 'kworker/5:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 44,
                    memory: 0,
                    name: 'cpuhp/6',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 45,
                    memory: 0,
                    name: 'migration/6',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 46,
                    memory: 0,
                    name: 'ksoftirqd/6',
                    percent: 0,
                    time: 38,
                    user: 'root'
                },
                {
                    id: 48,
                    memory: 0,
                    name: 'kworker/6:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 49,
                    memory: 0,
                    name: 'cpuhp/7',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 50,
                    memory: 0,
                    name: 'migration/7',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 51,
                    memory: 0,
                    name: 'ksoftirqd/7',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                {
                    id: 53,
                    memory: 0,
                    name: 'kworker/7:0H-events_highpri',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 62,
                    memory: 0,
                    name: 'kdevtmpfs',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 63,
                    memory: 0,
                    name: 'inet_frag_wq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 64,
                    memory: 0,
                    name: 'kauditd',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 65,
                    memory: 0,
                    name: 'khungtaskd',
                    percent: 0,
                    time: 1,
                    user: 'root'
                },
                {
                    id: 66,
                    memory: 0,
                    name: 'oom_reaper',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 67,
                    memory: 0,
                    name: 'writeback',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 68,
                    memory: 0,
                    name: 'kcompactd0',
                    percent: 0,
                    time: 140,
                    user: 'root'
                },
                {
                    id: 69,
                    memory: 0,
                    name: 'ksmd',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 70,
                    memory: 0,
                    name: 'khugepaged',
                    percent: 0,
                    time: 20,
                    user: 'root'
                },
                {
                    id: 71,
                    memory: 0,
                    name: 'kintegrityd',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 72,
                    memory: 0,
                    name: 'kblockd',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 73,
                    memory: 0,
                    name: 'blkcg_punt_bio',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 74,
                    memory: 0,
                    name: 'tpm_dev_wq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 75,
                    memory: 0,
                    name: 'edac-poller',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 76,
                    memory: 0,
                    name: 'devfreq_wq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 78,
                    memory: 0,
                    name: 'kworker/0:1H-kblockd',
                    percent: 0,
                    time: 2,
                    user: 'root'
                },
                {
                    id: 79,
                    memory: 0,
                    name: 'kswapd0',
                    percent: 0,
                    time: 54,
                    user: 'root'
                },
                {
                    id: 87,
                    memory: 0,
                    name: 'kthrotld',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 89,
                    memory: 0,
                    name: 'irq/121-aerdrv',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 90,
                    memory: 0,
                    name: 'acpi_thermal_pm',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 91,
                    memory: 0,
                    name: 'hwrng',
                    percent: 0,
                    time: 11,
                    user: 'root'
                },
                { id: 94, memory: 0, name: 'mld', percent: 0, time: 0, user: 'root' },
                {
                    id: 95,
                    memory: 0,
                    name: 'ipv6_addrconf',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 100,
                    memory: 0,
                    name: 'kstrp',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 105,
                    memory: 0,
                    name: 'zswap-shrink',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 106,
                    memory: 0,
                    name: 'kworker/u17:0-btrfs-worker-high',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 153,
                    memory: 0,
                    name: 'kworker/2:1H-kblockd',
                    percent: 0,
                    time: 3,
                    user: 'root'
                },
                {
                    id: 164,
                    memory: 0,
                    name: 'kworker/5:1H-kblockd',
                    percent: 0,
                    time: 2,
                    user: 'root'
                },
                {
                    id: 165,
                    memory: 0,
                    name: 'kworker/3:1H-kblockd',
                    percent: 0,
                    time: 3,
                    user: 'root'
                },
                {
                    id: 166,
                    memory: 0,
                    name: 'kworker/7:1H-kblockd',
                    percent: 0,
                    time: 1,
                    user: 'root'
                },
                {
                    id: 167,
                    memory: 0,
                    name: 'kworker/4:1H-kblockd',
                    percent: 0,
                    time: 4,
                    user: 'root'
                },
                {
                    id: 168,
                    memory: 0,
                    name: 'kworker/6:1H-kblockd',
                    percent: 0,
                    time: 2,
                    user: 'root'
                },
                {
                    id: 174,
                    memory: 0,
                    name: 'kworker/1:1H-kblockd',
                    percent: 0,
                    time: 8,
                    user: 'root'
                },
                {
                    id: 198,
                    memory: 0,
                    name: 'ata_sff',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 199,
                    memory: 0,
                    name: 'scsi_eh_0',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 200,
                    memory: 0,
                    name: 'scsi_tmf_0',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 201,
                    memory: 0,
                    name: 'scsi_eh_1',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 202,
                    memory: 0,
                    name: 'scsi_tmf_1',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 203,
                    memory: 0,
                    name: 'scsi_eh_2',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 204,
                    memory: 0,
                    name: 'scsi_tmf_2',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 205,
                    memory: 0,
                    name: 'scsi_eh_3',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 206,
                    memory: 0,
                    name: 'scsi_tmf_3',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 207,
                    memory: 0,
                    name: 'scsi_eh_4',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 208,
                    memory: 0,
                    name: 'scsi_tmf_4',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 210,
                    memory: 0,
                    name: 'nvkm-disp',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 211,
                    memory: 0,
                    name: 'card0-crtc0',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 212,
                    memory: 0,
                    name: 'card0-crtc1',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 213,
                    memory: 0,
                    name: 'card0-crtc2',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 214,
                    memory: 0,
                    name: 'card0-crtc3',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                { id: 227, memory: 0, name: 'md', percent: 0, time: 0, user: 'root' },
                {
                    id: 229,
                    memory: 0,
                    name: 'md0_raid1',
                    percent: 0,
                    time: 1,
                    user: 'root'
                },
                {
                    id: 247,
                    memory: 0,
                    name: 'raid5wq',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 293,
                    memory: 0,
                    name: 'btrfs-worker',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 294,
                    memory: 0,
                    name: 'btrfs-worker-hi',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 295,
                    memory: 0,
                    name: 'btrfs-delalloc',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 296,
                    memory: 0,
                    name: 'btrfs-flush_del',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 297,
                    memory: 0,
                    name: 'btrfs-cache',
                    percent: 0,
                    time: 0,
                    user: 'root'
                },
                {
                    id: 298,
                    memory: 0,
                    name: 'btrfs-fixup',
                    percent: 0,
                    time: 0,
                    user: 'root'
                }
            ],
            time: now
        },
        services:services_os_serv = {
            data: [
                {
                    description: 'Accounts Service',
                    name: 'accounts-daemon.service',
                    status: 'active'
                },
                {
                    description: 'Save/Restore Sound Card State',
                    name: 'alsa-restore.service',
                    status: 'active'
                },
                {
                    description: 'Manage Sound Card State (restore and store)',
                    name: 'alsa-state.service',
                    status: 'inactive'
                },
                {
                    description: 'Run anacron jobs',
                    name: 'anacron.service',
                    status: 'inactive'
                },
                {
                    description: 'Load AppArmor profiles',
                    name: 'apparmor.service',
                    status: 'active'
                },
                {
                    description: 'Daily apt upgrade and clean activities',
                    name: 'apt-daily-upgrade.service',
                    status: 'inactive'
                },
                {
                    description: 'Daily apt download activities',
                    name: 'apt-daily.service',
                    status: 'inactive'
                },
                {
                    description: 'auditd.service',
                    name: 'auditd.service',
                    status: 'inactive'
                },
                {
                    description: 'auto-cpufreq.service',
                    name: 'auto-cpufreq.service',
                    status: 'inactive'
                },
                {
                    description: 'Avahi mDNS/DNS-SD Stack',
                    name: 'avahi-daemon.service',
                    status: 'active'
                },
                {
                    description: 'Bluetooth management mechanism',
                    name: 'blueman-mechanism.service',
                    status: 'inactive'
                },
                {
                    description: 'clamav-daemon.service',
                    name: 'clamav-daemon.service',
                    status: 'inactive'
                },
                {
                    description: 'Manage, Install and Generate Color Profiles',
                    name: 'colord.service',
                    status: 'active'
                },
                {
                    description: 'connman.service',
                    name: 'connman.service',
                    status: 'inactive'
                },
                {
                    description: 'console-screen.service',
                    name: 'console-screen.service',
                    status: 'inactive'
                },
                {
                    description: 'Set console font and keymap',
                    name: 'console-setup.service',
                    status: 'active'
                },
                {
                    description: 'containerd container runtime',
                    name: 'containerd.service',
                    status: 'active'
                },
                {
                    description: 'Regular background program processing daemon',
                    name: 'cron.service',
                    status: 'active'
                },
                {
                    description: 'Make remote CUPS printers available locally',
                    name: 'cups-browsed.service',
                    status: 'active'
                },
                {
                    description: 'CUPS Scheduler',
                    name: 'cups.service',
                    status: 'active'
                },
                {
                    description: 'D-Bus System Message Bus',
                    name: 'dbus.service',
                    status: 'active'
                },
                {
                    description: 'Docker Application Container Engine',
                    name: 'docker.service',
                    status: 'active'
                },
                {
                    description: 'Daily dpkg database backup service',
                    name: 'dpkg-db-backup.service',
                    status: 'inactive'
                },
                {
                    description: 'Online ext4 Metadata Check for All Filesystems',
                    name: 'e2scrub_all.service',
                    status: 'inactive'
                },
                {
                    description: 'Remove Stale Online ext4 Metadata Check Snapshots',
                    name: 'e2scrub_reap.service',
                    status: 'inactive'
                },
                {
                    description: 'Emergency Shell',
                    name: 'emergency.service',
                    status: 'inactive'
                },
                {
                    description: 'exim4-base housekeeping',
                    name: 'exim4-base.service',
                    status: 'inactive'
                },
                {
                    description: 'LSB: exim Mail Transport Agent',
                    name: 'exim4.service',
                    status: 'failed'
                },
                {
                    description: 'firewalld.service',
                    name: 'firewalld.service',
                    status: 'inactive'
                },
                {
                    description: 'Discard unused blocks on filesystems from /etc/fstab',
                    name: 'fstrim.service',
                    status: 'inactive'
                },
                {
                    description: 'Refresh fwupd metadata and update motd',
                    name: 'fwupd-refresh.service',
                    status: 'inactive'
                },
                {
                    description: 'Firmware update daemon',
                    name: 'fwupd.service',
                    status: 'active'
                },
                {
                    description: 'getty on tty2-tty6 if dbus and logind are not available',
                    name: 'getty-static.service',
                    status: 'inactive'
                },
                {
                    description: 'Getty on tty1',
                    name: 'getty@tty1.service',
                    status: 'active'
                },
                {
                    description: 'greylist.service',
                    name: 'greylist.service',
                    status: 'inactive'
                },
                {
                    description: 'Helper to synchronize boot up for ifupdown',
                    name: 'ifupdown-pre.service',
                    status: 'active'
                },
                {
                    description: 'Cleaning Up and Shutting Down Daemons',
                    name: 'initrd-cleanup.service',
                    status: 'inactive'
                },
                {
                    description: 'Mountpoints Configured in the Real Root',
                    name: 'initrd-parse-etc.service',
                    status: 'inactive'
                },
                {
                    description: 'Switch Root',
                    name: 'initrd-switch-root.service',
                    status: 'inactive'
                },
                {
                    description: 'Cleanup udev Database',
                    name: 'initrd-udevadm-cleanup-db.service',
                    status: 'inactive'
                },
                {
                    description: 'kbd.service',
                    name: 'kbd.service',
                    status: 'inactive'
                },
                {
                    description: 'Set the console keyboard layout',
                    name: 'keyboard-setup.service',
                    status: 'active'
                },
                {
                    description: 'Create List of Static Device Nodes',
                    name: 'kmod-static-nodes.service',
                    status: 'active'
                },
                {
                    description: 'Light Display Manager',
                    name: 'lightdm.service',
                    status: 'active'
                },
                {
                    description: 'Initialize hardware monitoring sensors',
                    name: 'lm-sensors.service',
                    status: 'active'
                },
                {
                    description: 'Rotate log files',
                    name: 'logrotate.service',
                    status: 'inactive'
                },
                {
                    description: 'LSB: BSD lpr/lpd line printer spooling system',
                    name: 'lpd.service',
                    status: 'active'
                },
                {
                    description: 'Daily man-db regeneration',
                    name: 'man-db.service',
                    status: 'inactive'
                },
                {
                    description: 'Prepare mdadm shutdown initramfs',
                    name: 'mdadm-shutdown.service',
                    status: 'inactive'
                },
                {
                    description: 'MD array monitor',
                    name: 'mdmonitor.service',
                    status: 'active'
                },
                {
                    description: 'Modem Manager',
                    name: 'ModemManager.service',
                    status: 'active'
                },
                {
                    description: 'Load Kernel Module configfs',
                    name: 'modprobe@configfs.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Module dm_mod',
                    name: 'modprobe@dm_mod.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Module drm',
                    name: 'modprobe@drm.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Module efi_pstore',
                    name: 'modprobe@efi_pstore.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Module fuse',
                    name: 'modprobe@fuse.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Module loop',
                    name: 'modprobe@loop.service',
                    status: 'inactive'
                },
                {
                    description: 'mysql.service',
                    name: 'mysql.service',
                    status: 'inactive'
                },
                {
                    description: 'Raise network interfaces',
                    name: 'networking.service',
                    status: 'active'
                },
                {
                    description: 'Network Manager Wait Online',
                    name: 'NetworkManager-wait-online.service',
                    status: 'active'
                },
                {
                    description: 'Network Manager',
                    name: 'NetworkManager.service',
                    status: 'active'
                },
                {
                    description: 'Samba NMB Daemon',
                    name: 'nmbd.service',
                    status: 'active'
                },
                {
                    description: 'nslcd.service',
                    name: 'nslcd.service',
                    status: 'inactive'
                },
                {
                    description: 'Hold until boot process finishes up',
                    name: 'plymouth-quit-wait.service',
                    status: 'active'
                },
                {
                    description: 'Terminate Plymouth Boot Screen',
                    name: 'plymouth-quit.service',
                    status: 'inactive'
                },
                {
                    description: 'Tell Plymouth To Write Out Runtime Data',
                    name: 'plymouth-read-write.service',
                    status: 'active'
                },
                {
                    description: 'Show Plymouth Boot Screen',
                    name: 'plymouth-start.service',
                    status: 'active'
                },
                {
                    description: 'Plymouth switch root service',
                    name: 'plymouth-switch-root.service',
                    status: 'inactive'
                },
                {
                    description: 'Authorization Manager',
                    name: 'polkit.service',
                    status: 'active'
                },
                {
                    description: 'postgresql.service',
                    name: 'postgresql.service',
                    status: 'inactive'
                },
                {
                    description: 'Power Profiles daemon',
                    name: 'power-profiles-daemon.service',
                    status: 'active'
                },
                {
                    description: '/etc/rc.local Compatibility',
                    name: 'rc-local.service',
                    status: 'inactive'
                },
                {
                    description: 'Rescue Shell',
                    name: 'rescue.service',
                    status: 'inactive'
                },
                {
                    description: 'RealtimeKit Scheduling Policy Service',
                    name: 'rtkit-daemon.service',
                    status: 'active'
                },
                {
                    description: 'Samba AD Daemon',
                    name: 'samba-ad-dc.service',
                    status: 'inactive'
                },
                {
                    description: 'Samba SMB Daemon',
                    name: 'smbd.service',
                    status: 'active'
                },
                {
                    description: 'spamassassin.service',
                    name: 'spamassassin.service',
                    status: 'inactive'
                },
                {
                    description: 'OpenBSD Secure Shell server',
                    name: 'ssh.service',
                    status: 'active'
                },
                {
                    description: 'syslog.service',
                    name: 'syslog.service',
                    status: 'inactive'
                },
                {
                    description: 'system76-power.service',
                    name: 'system76-power.service',
                    status: 'inactive'
                },
                {
                    description: 'Dispatch Password Requests to Console',
                    name: 'systemd-ask-password-console.service',
                    status: 'inactive'
                },
                {
                    description: 'Forward Password Requests to Plymouth',
                    name: 'systemd-ask-password-plymouth.service',
                    status: 'inactive'
                },
                {
                    description: 'Forward Password Requests to Wall',
                    name: 'systemd-ask-password-wall.service',
                    status: 'inactive'
                },
                {
                    description: 'Set Up Additional Binary Formats',
                    name: 'systemd-binfmt.service',
                    status: 'active'
                },
                {
                    description: 'First Boot Wizard',
                    name: 'systemd-firstboot.service',
                    status: 'inactive'
                },
                {
                    description: 'File System Check on Root Device',
                    name: 'systemd-fsck-root.service',
                    status: 'inactive'
                },
                {
                    description: 'File System Check Daemon to report status',
                    name: 'systemd-fsckd.service',
                    status: 'inactive'
                },
                {
                    description: 'Hostname Service',
                    name: 'systemd-hostnamed.service',
                    status: 'failed'
                },
                {
                    description: 'systemd-hwdb-update.service',
                    name: 'systemd-hwdb-update.service',
                    status: 'inactive'
                },
                {
                    description: 'initctl Compatibility Daemon',
                    name: 'systemd-initctl.service',
                    status: 'inactive'
                },
                {
                    description: 'Flush Journal to Persistent Storage',
                    name: 'systemd-journal-flush.service',
                    status: 'active'
                },
                {
                    description: 'Journal Service',
                    name: 'systemd-journald.service',
                    status: 'active'
                },
                {
                    description: 'User Login Management',
                    name: 'systemd-logind.service',
                    status: 'active'
                },
                {
                    description: 'Commit a transient machine-id on disk',
                    name: 'systemd-machine-id-commit.service',
                    status: 'inactive'
                },
                {
                    description: 'Load Kernel Modules',
                    name: 'systemd-modules-load.service',
                    status: 'active'
                },
                {
                    description: 'Network Configuration',
                    name: 'systemd-networkd.service',
                    status: 'inactive'
                },
                {
                    description: 'systemd-oomd.service',
                    name: 'systemd-oomd.service',
                    status: 'inactive'
                },
                {
                    description: 'TPM2 PCR Barrier (initrd)',
                    name: 'systemd-pcrphase-initrd.service',
                    status: 'inactive'
                },
                {
                    description: 'TPM2 PCR Barrier (Initialization)',
                    name: 'systemd-pcrphase-sysinit.service',
                    status: 'inactive'
                },
                {
                    description: 'TPM2 PCR Barrier (User)',
                    name: 'systemd-pcrphase.service',
                    status: 'inactive'
                }
            ],
            time: now
        },
        tcp:services_os_sock = {
            data: [
                {
                    'local-address': '100.65.99.14',
                    'local-port': 443,
                    process: 802,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 445,
                    process: 5416,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 139,
                    process: 5416,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 22,
                    process: 1124,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 53,
                    process: 3819,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 631,
                    process: 2755600,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '100.65.99.14',
                    'local-port': 43910,
                    process: 802,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3010,
                    process: 3748797,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3011,
                    process: 3529,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3009,
                    process: 3884,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3012,
                    process: 3939,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3013,
                    process: 3966,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3002,
                    process: 7566,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3003,
                    process: 7588,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3006,
                    process: 3794,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '192.168.1.3',
                    'local-port': 445,
                    process: 5431,
                    'remote-address': '192.168.1.64',
                    'remote-port': 48670
                },
                {
                    'local-address': '192.168.1.3',
                    'local-port': 22,
                    process: 3442656,
                    'remote-address': '192.168.1.64',
                    'remote-port': 28149
                },
                {
                    'local-address': '192.168.1.3',
                    'local-port': 60562,
                    process: 7798,
                    'remote-address': '34.107.243.93',
                    'remote-port': 443
                },
                {
                    'local-address': '::',
                    'local-port': 445,
                    process: 5416,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 139,
                    process: 5416,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 22,
                    process: 1124,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 53,
                    process: 3828,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 631,
                    process: 2755600,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3010,
                    process: 3748804,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3011,
                    process: 3536,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3009,
                    process: 3892,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3012,
                    process: 3946,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3013,
                    process: 3973,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3002,
                    process: 7574,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3003,
                    process: 7595,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '::',
                    'local-port': 3006,
                    process: 3801,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': 'fd7a:115c:a1e0::6a3b:630e',
                    'local-port': 50688,
                    process: 802,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': 'fd7a:115c:a1e0::6a3b:630e',
                    'local-port': 443,
                    process: 802,
                    'remote-address': '::',
                    'remote-port': 0
                },
                {
                    'local-address': '2600:1700:70e1:14b0::4',
                    'local-port': 59748,
                    process: 802,
                    'remote-address': '2606:b740:1:20::103',
                    'remote-port': 443
                },
                {
                    'local-address': '2600:1700:70e1:14b0::4',
                    'local-port': 50690,
                    process: 802,
                    'remote-address': '2606:b740:49::105',
                    'remote-port': 80
                },
                {
                    'local-address': '2600:1700:70e1:14b0::4',
                    'local-port': 36920,
                    process: 802,
                    'remote-address': '2607:f740:100::359',
                    'remote-port': 443
                }
            ],
            time: now
        },
        udp:services_os_sock = {
            data: [
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49270,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.17.255.255',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.17.0.1',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.255.255',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.19.255.255',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.19.0.1',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '192.168.1.255',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '192.168.1.3',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 137,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.17.255.255',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.17.0.1',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.255.255',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.19.255.255',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.19.0.1',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '192.168.1.255',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '192.168.1.3',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 138,
                    process: 5414,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49343,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49425,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33054,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33059,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49461,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49565,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33212,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49600,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33244,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 33333,
                    process: 0,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49798,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 49988,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50016,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33692,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50213,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33858,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 33871,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50282,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50343,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34008,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34085,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50474,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34112,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50548,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34189,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50612,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50642,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50663,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50671,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50700,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34330,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34387,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 50773,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34430,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34433,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34602,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34634,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34686,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34781,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 51208,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 34829,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 51546,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 51555,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 35316,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 51708,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 35398,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 51911,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52097,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 35713,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52128,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52135,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3004,
                    process: 7544,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 3005,
                    process: 7523,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 35914,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52316,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52458,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52503,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52527,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 36180,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 36267,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52678,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52722,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 36420,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 52852,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 53047,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 36708,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 53321,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 53342,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 37028,
                    process: 707,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37344,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37372,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37442,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 53887,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37605,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 53993,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37680,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37734,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 37760,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 54303,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                },
                {
                    'local-address': '0.0.0.0',
                    'local-port': 5353,
                    process: 707,
                    'remote-address': '0.0.0.0',
                    'remote-port': 0
                },
                {
                    'local-address': '172.18.0.1',
                    'local-port': 38192,
                    process: 3863,
                    'remote-address': '172.18.0.7',
                    'remote-port': 53
                }
            ],
            time: now
        },
        user:services_os_user = {
            data: [
                { lastLogin: 0, name: 'root', proc: 265, type: 'user', uid: 0 },
                { lastLogin: 0, name: 'daemon', proc: 0, type: 'system', uid: 1 },
                { lastLogin: 0, name: 'bin', proc: 0, type: 'system', uid: 2 },
                { lastLogin: 0, name: 'sys', proc: 0, type: 'system', uid: 3 },
                { lastLogin: 0, name: 'sync', proc: 0, type: 'system', uid: 4 },
                { lastLogin: 0, name: 'games', proc: 0, type: 'system', uid: 5 },
                { lastLogin: 0, name: 'man', proc: 0, type: 'system', uid: 6 },
                { lastLogin: 0, name: 'lp', proc: 0, type: 'system', uid: 7 },
                { lastLogin: 0, name: 'mail', proc: 0, type: 'system', uid: 8 },
                { lastLogin: 0, name: 'news', proc: 0, type: 'system', uid: 9 },
                { lastLogin: 0, name: 'uucp', proc: 0, type: 'system', uid: 10 },
                { lastLogin: 0, name: 'proxy', proc: 0, type: 'system', uid: 13 },
                { lastLogin: 0, name: 'www-data', proc: 14, type: 'system', uid: 33 },
                { lastLogin: 0, name: 'backup', proc: 0, type: 'system', uid: 34 },
                { lastLogin: 0, name: 'list', proc: 0, type: 'system', uid: 38 },
                { lastLogin: 0, name: 'irc', proc: 0, type: 'system', uid: 39 },
                { lastLogin: 0, name: '_apt', proc: 0, type: 'system', uid: 42 },
                { lastLogin: 0, name: 'tss', proc: 0, type: 'system', uid: 100 },
                {
                    lastLogin: 0,
                    name: 'messagebus',
                    proc: 1,
                    type: 'system',
                    uid: 101
                },
                { lastLogin: 0, name: 'usbmux', proc: 0, type: 'system', uid: 102 },
                { lastLogin: 0, name: 'sshd', proc: 0, type: 'system', uid: 103 },
                { lastLogin: 0, name: 'dnsmasq', proc: 0, type: 'system', uid: 104 },
                { lastLogin: 0, name: 'avahi', proc: 2, type: 'system', uid: 105 },
                {
                    lastLogin: 0,
                    name: 'speech-dispatcher',
                    proc: 0,
                    type: 'system',
                    uid: 106
                },
                {
                    lastLogin: 0,
                    name: 'fwupd-refresh',
                    proc: 0,
                    type: 'system',
                    uid: 107
                },
                { lastLogin: 0, name: 'pulse', proc: 0, type: 'system', uid: 108 },
                { lastLogin: 0, name: 'saned', proc: 0, type: 'system', uid: 109 },
                { lastLogin: 0, name: 'lightdm', proc: 0, type: 'system', uid: 110 },
                { lastLogin: 0, name: 'rtkit', proc: 1, type: 'system', uid: 111 },
                { lastLogin: 0, name: 'colord', proc: 1, type: 'system', uid: 112 },
                {
                    lastLogin: 0,
                    name: 'Debian-exim',
                    proc: 0,
                    type: 'system',
                    uid: 113
                },
                { lastLogin: 0, name: 'polkitd', proc: 1, type: 'system', uid: 996 },
                {
                    lastLogin: 0,
                    name: 'systemd-timesync',
                    proc: 0,
                    type: 'system',
                    uid: 997
                },
                {
                    lastLogin: 0,
                    name: 'systemd-network',
                    proc: 0,
                    type: 'system',
                    uid: 998
                },
                {
                    lastLogin: 1788288556000,
                    name: 'cheney',
                    proc: 99,
                    type: 'user',
                    uid: 1000
                },
                { lastLogin: 0, name: 'nobody', proc: 0, type: 'system', uid: 65534 }
            ],
            time: now
        };
    if (type_os === "all") {
        const all:services_os_all = {
            devs: devices,
            disk: disks,
            intr: interfaces,
            main: main,
            proc: processes,
            serv: services,
            stcp: tcp,
            sudp: udp,
            time: now,
            user: user
        };
        vars.os.devs = all.devs;
        vars.os.disk = all.disk;
        vars.os.intr = all.intr;
        vars.os.proc = all.proc;
        vars.os.serv = all.serv;
        vars.os.stcp = all.stcp;
        vars.os.sudp = all.sudp;
        vars.os.user = all.user;
        callback({
            data: all,
            service: "services_os_all"
        });
    } else if (type_os === "main") {
        const output:services_os_main = main;
        callback({
            data: output,
            service: "services_os_main"
        });
    } else if (type_os === "devs") {
        vars.os.devs = devices;
        callback({
            data: devices,
            service: "services_os_devs"
        });
    } else if (type_os === "disk") {
        vars.os.disk = disks;
        callback({
            data: disks,
            service: "services_os_disk"
        });
    } else if (type_os === "intr") {
        vars.os.intr = interfaces;
        callback({
            data: interfaces,
            service: "services_os_intr"
        });
    } else if (type_os === "proc") {
        vars.os.proc = processes;
        callback({
            data: processes,
            service: "services_os_proc"
        });
    } else if (type_os === "serv") {
        vars.os.serv = services;
        callback({
            data: services,
            service: "services_os_serv"
        });
    } else if (type_os === "stcp") {
        vars.os.stcp = tcp;
        callback({
            data: tcp,
            service: "services_os_stcp"
        });
    } else if (type_os === "sudp") {
        vars.os.sudp = udp;
        callback({
            data: udp,
            service: "services_os_sudp"
        });
    } else if (type_os === "user") {
        if (process.platform === "win32") {
            vars.os.proc = processes;
        }
        vars.os.user = user;
        callback({
            data: user,
            service: "services_os_user"
        });
    }
};

export default os_demo;