
interface test_assert {
    assessment: string;
    location: string;
    pass: boolean;
    store: boolean;
    value: test_primitive;
}

interface test_assertion_command {
    format?: "csv" | "json" | "lines" | "string";
    nullable?: boolean;
    properties?: (number|string)[];
    qualifier: test_qualifier;
    store?: boolean;
    type: "stderr" | "stdout";
    value: test_primitive;
}

interface test_assertion_dom {
    node: test_browserDOM;
    nullable?: boolean;
    qualifier: test_qualifier;
    store?: boolean;
    target: string[];
    type: "attribute" | "element" | "property";
    value: test_primitive | test_primitive[];
}

interface test_browserDOM extends Array<type_browserDOM> {
    nodeString?: string;
}

interface test_browserEvent {
    coords?: [number, number];
    event: test_eventName;
    node: test_browserDOM;
    value?: string;
}

interface test_browserItem {
    delay?: test_assertion_dom;
    event_index?: number;
    interaction: test_browserEvent[];
    name: string;
    unit: test_assertion_dom[];
}

interface test_command_format {
    csv: () => string[][];
    json: () => object;
    lines: () => string[];
    string: () => string;
}

interface test_config_summary {
    final: boolean;
    list_assertions: number;
    list_fail_assertions: number;
    list_fail_tests: number;
    list_tests: number;
    name: string;
    time_list_end: bigint;
    time_list_start: bigint;
    time_total_end: bigint;
    time_total_start: bigint;
    total_assertions: number;
    total_fail_assertions: number;
    total_fail_tests: number;
    total_lists: number;
    total_tests: number;
}

interface test_counts {
    assertions: number;
    assertions_fail: number;
    tests_attempted: number;
    tests_failed: number;
    tests_skipped: number;
    tests_total: number;
    time_end: bigint;
    time_start: bigint;
}

interface test_event {
    coords?: [number, number];
    event: test_eventName;
    node: test_browserDOM;
    value?: string;
}

interface test_item_dom {
    delay?: test_assertion_dom;
    interaction: test_event[];
    name: string;
    type: "dom";
    unit: test_assertion_dom[];
}

interface test_list extends Array<test_item_dom> {
    name?: string;
}

interface test_runner {
    assert: {
        [key:string]: (value:string, unit:test_assertion_command|test_assertion_dom, location:string) => test_assert;
    };
    count: number;
    execution: {
        dom: () => void;
    };
    list: (list:test_list, callback:(name:string) => void) => void;
    logger: (assertions:test_assert[]) => void;
    logs: string[];
    receive: (socket_data:socket_data) => void;
    socket: websocket_client;
    tools: {
        browser_open: () => void;
        callback: (name:string) => void;
        get_value: (value_actual:test_primitive, value_test:test_primitive|test_primitive[]) => test_primitive;
        next: () => void;
        time: () => string;
    };
}

// type test_type = "command" | "dom" | "file" | "http" | "websocket"