
const test_listLocalBrowserApplicationLogs = function test_listLocalBrowserApplicationLogs():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "application-logs", null],
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
                        ["getElementsByTagName", "div", 6],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to application-logs",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "sockets-application-tcp"
                },
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0],
                        ["childNodes", null, 0]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "time"
                },
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0],
                        ["childNodes", null, 1]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "strong"
                },
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0],
                        ["childNodes", null, 2]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "span"
                },
                {
                    node: [
                        ["getElementById", "application-logs", null],
                        ["getElementsByTagName", "li", 0],
                        ["childNodes", null, 3]
                    ],
                    qualifier: "is",
                    target: ["lowName()"],
                    type: "property",
                    value: "p"
                }
            ]
        }
    ];
    list.name = "Local browser tests - application logs";
    return list;
};

export default test_listLocalBrowserApplicationLogs;