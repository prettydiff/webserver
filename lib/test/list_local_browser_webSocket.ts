

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
            unit: []
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
            name: "Open websocket",
            type: "dom",
            unit: []
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
            name: "Open websocket",
            type: "dom",
            unit: []
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
            name: "Open websocket",
            type: "dom",
            unit: []
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
            name: "Open websocket",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - web socket";
    return list;
};

export default test_listLocalBrowserWebSocket;