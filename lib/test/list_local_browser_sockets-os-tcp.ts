
import vars from "../core/vars.ts";

const test_listLocalSocketsOS_TCP = function test_listLocalSocketsOS_TCP():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "sockets-os-tcp", null],
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
                        ["getElementsByTagName", "div", 2],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to OS TCP Sockets",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent", "typeof"],
                    type: "property",
                    value: "string"
                },
                {
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 1]
                    ],
                    qualifier: "greater",
                    target: ["textContent"],
                    type: "property",
                    value: "100"
                },
                {
                    node: [
                        ["getElementById", "sockets", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 3]
                    ],
                    qualifier: "greater",
                    target: ["data-raw"],
                    type: "attribute",
                    value: -1
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "sockets-os-tcp", null],
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
            name: "Check if sockets-os-tcp table is populated",
            type: "dom",
            unit: []
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "running"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
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
            name: "Filter sockets-os-tcp",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "sockets-os-tcp", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "em", 1]
                    ],
                    qualifier: "lesser",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                }
            ]
        }
    ];
    list.name = "Local browser tests - sockets-os-tcp";
    return list;
};

export default test_listLocalSocketsOS_TCP;