

const test_listLocalBrowserHTTP = function test_listLocalBrowserHTTP():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "test-http", null],
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
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to http test",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "test-http", 0],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "begins",
                target: ["value"],
                type: "property",
                value: `{
    "absolute": "http`
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-http", 0],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "test-http", 0],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Send HTTP request",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "test-http", 0],
                        ["getElementsByClassName", "form", 1],
                        ["getElementsByTagName", "textarea", 1]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "HTTP/1.1 200\ncontent-type: text/html\ncontent-length: "
                },
                {
                    node: [
                        ["getElementById", "test-http", 0],
                        ["getElementsByClassName", "form", 1],
                        ["getElementsByTagName", "textarea", 2]
                    ],
                    qualifier: "begins",
                    target: ["value"],
                    type: "property",
                    value: "\n<!doctype html>\n<html lang=\"en\">"
                }
            ]
        }
    ];
    list.name = "Local browser tests - http";
    return list;
};

export default test_listLocalBrowserHTTP;