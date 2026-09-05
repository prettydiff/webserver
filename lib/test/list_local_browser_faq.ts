

const test_listLocalBrowserFAQ = function test_listLocalBrowserFAQ():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "faq", null],
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
                        ["getElementsByTagName", "button", 2]
                    ]
                }
            ],
            name: "Navigate to faq",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - faq";
    return list;
};
export default test_listLocalBrowserFAQ;