

const test_listLocalBrowserServicesApp = function test_listLocalBrowserServicesApp():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "services-app", null],
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
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to services-app",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "services-app", null],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "services_compose"
                },
                {
                    node: [
                        ["getElementById", "services-app", null],
                        ["getElementsByTagName", "h3", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "services_compose_container"
                },
                {
                    node: [
                        ["getElementById", "services-app", null],
                        ["getElementsByTagName", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Type Dependencies"
                },
                {
                    node: [
                        ["getElementById", "services-app", null],
                        ["getElementsByTagName", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "References"
                }
            ]
        }
    ];
    list.name = "Local browser tests - services_app";
    return list;
};

export default test_listLocalBrowserServicesApp;