import vars from "../core/vars.ts";

const test_listLocalBrowserSocketsApplicationTCP = function test_listLocalBrowserSocketsApplicationTCP():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "sockets-application-tcp", null],
                    ["getElementsByTagName", "h2", 0]
                ],
                qualifier: "greater",
                target: ["offsetTop"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementsByTagName", "nav", 0],
                        ["getElementsByTagName", "div", 1],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to sockets",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "sockets-application-tcp", null],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", null]
                ],
                qualifier: "greater",
                store: true,
                target: ["length"],
                type: "property",
                value: 1
            },
            interaction: [],
            name: "Check if application socket table is populated",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent", "length"],
                    type: "property",
                    value: 128
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "dashboard"
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: ["browserSocket-", "dashboard-term"]
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["dashboard", "dashboard-terminal"]
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "server"
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 6]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "false"
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 7]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["127.0.0.1", "::1"] as test_primitive[]
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 8]
                    ],
                    qualifier: "numeric",
                    target: ["textContent"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 9]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ["127.0.0.1", "::1"]
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "services_terminal_"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "Enter"
                },
                {
                    event: "wait",
                    node: [],
                    value: "50"
                }
            ],
            name: "Filter application sockets",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "em", 1]
                    ],
                    qualifier: "lesser",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "sockets-application-tcp", null],
                    ["getElementsByClassName", "table-stats", 0],
                    ["getElementsByTagName", "em", 2]
                ],
                qualifier: "not",
                store: true,
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "sockets-application-tcp", null],
                        ["getElementsByClassName", "update-button", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Update os sockets",
            type: "dom",
            unit: null
        }
    ];
    list.name = "Local browser tests - sockets-application-tcp";
    return list;
};

export default test_listLocalBrowserSocketsApplicationTCP;