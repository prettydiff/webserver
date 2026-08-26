

const test_listLocalBrowserWebSocket = function test_listLocalBrowserWebSocket():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "test-websocket", null],
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
                        ["getElementsByTagName", "div", 5],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to websocket test",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "websocket-status", null],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Offline"
                },
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                },
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 2],
                        ["getElementsByClassName", "frame_validate", 0],
                        ["getElementsByTagName", "em", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: Frame fin flag is set to false."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "websocket-status", null],
                    ["getElementsByTagName", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Online (Encrypted)"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Open encrypted websocket",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "Connected in "
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "test-websocket", null],
                    ["getElementsByClassName", "http_response", 1],
                    ["getElementsByTagName", "textarea", 3]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: `Response message.

test secure socket`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `{
    "extended": 0,
    "fin": true,
    "len": 0,
    "mask": false,
    "maskKey": "",
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "startByte": 0,
}`
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "test secure socket"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "button", 0]
                    ]
                },
                {
                    event: "wait",
                    node: [],
                    value: "10"
                }
            ],
            name: "Send encrypted message",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: `{
    "extended": 37,
    "fin": true,
    "len": 37,
    "mask": false,
    "maskKey": null,
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "size_buffer": 39,
    "size_fragment": 39,
    "startByte": 2
}`
                },
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 2],
                        ["getElementsByClassName", "frame_validate", 0]
                    ],
                    qualifier: "is",
                    target: ["style", "display"],
                    type: "property",
                    value: "none"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "websocket-status", null],
                    ["getElementsByTagName", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Offline"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Close encrypted websocket",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "websocket-status", null],
                    ["getElementsByTagName", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Online (Insecure)"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Open insecure websocket",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 3]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "test-websocket", null],
                    ["getElementsByClassName", "http_response", 1],
                    ["getElementsByTagName", "textarea", 3]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: `Response message.

test insecure socket`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "test insecure socket"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Send encrypted message",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "http_response", 1],
                        ["getElementsByTagName", "textarea", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: `{
    "extended": 39,
    "fin": true,
    "len": 39,
    "mask": false,
    "maskKey": null,
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "size_buffer": 41,
    "size_fragment": 41,
    "startByte": 2
}`
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "websocket-status", null],
                    ["getElementsByTagName", "strong", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "Offline"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Close insecure websocket",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-websocket", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "Disconnected."
                }
            ]
        }
    ];
    list.name = "Local browser tests - web socket";
    return list;
};

export default test_listLocalBrowserWebSocket;