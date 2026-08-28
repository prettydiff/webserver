
import vars from "../core/vars.ts";

const test_listLocalBrowserPortsApplication = function test_listLocalBrowserPortsApplication():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "ports-application", null],
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
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to ports-application",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "ports-application", null],
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
            name: "Check if ports-application table is populated",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "ports-application", null],
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
                        ["getElementById", "ports-application", null],
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
                        ["getElementById", "ports-application", null],
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
                        ["getElementById", "ports-application", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "USB"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "ports-application", null],
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
            name: "Filter ports-application",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "em", 1]
                    ],
                    qualifier: "lesser",
                    target: ["textContent"],
                    type: "property",
                    value: vars.test.magicString
                },
                {
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "none"
                }
            ]
        },
        {
            delay: null,
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: ""
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "ports-application", null],
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
            name: "Remove filter ports-application",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "ports-application", null],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "table-row"
                }
            ]
        }
    ];
    list.name = "Local browser tests - ports-application";
    return list;
};

export default test_listLocalBrowserPortsApplication;