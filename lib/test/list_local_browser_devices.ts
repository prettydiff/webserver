
import vars from "../core/vars.ts";

const test_listLocalBrowserDevices = function test_listLocalBrowserDevices():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "devices", null],
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
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to devices",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "devices", null],
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
            name: "Check if devices table is populated",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "devices", null],
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
                        ["getElementById", "devices", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent", "typeof"],
                    type: "property",
                    value: "string"
                },
                {
                    node: [
                        ["getElementById", "devices", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent", "typeof"],
                    type: "property",
                    value: "string"
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "devices", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "devices", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "USB"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "devices", null],
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
            name: "Filter devices",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "devices", null],
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
    list.name = "Local browser tests - devices";
    return list;
};

export default test_listLocalBrowserDevices;