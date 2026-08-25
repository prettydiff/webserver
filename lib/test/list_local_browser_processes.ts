
import vars from "../core/vars.ts";

const test_listLocalBrowserProcesses = function test_listLocalBrowserProcesses():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "processes", null],
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
                        ["getElementsByTagName", "div", 3],
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to processes",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "processes", null],
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
                        ["getElementById", "processes", null],
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
                        ["getElementById", "processes", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "greater",
                    target: ["data-raw"],
                    type: "attribute",
                    value: 100
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
                    ["getElementById", "processes", null],
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
            name: "Check if processes table is populated",
            type: "dom",
            unit: []
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "processes", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "processes", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "running"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "processes", null],
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
            name: "Filter processes",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "processes", null],
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
    list.name = "Local browser tests - processes";
    return list;
};

export default test_listLocalBrowserProcesses;