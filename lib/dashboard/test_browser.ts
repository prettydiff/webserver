
import dashboard from "./dashboard.ts";

const test_browser = function testBrowser(socketData:socket_data):void {
    const remote:module_remote = {

        /* Executes the delay test unit if a given test has a delay property */
        delay: function testBrowser_delay(config:test_browserItem):void {
            let a:number = 0;
            const delay:number = 0,
                maxTries:number = 0,
                delayFunction = function testBrowser_delay_timeout():void {
                    const testResult:test_assert = remote.evaluate(config.delay);
                    if (testResult.pass === true) {
                        if (config.unit === null || config.unit.length < 1) {
                            remote.sendTest([testResult], remote.index);
                        } else {
                            remote.report(config.delay, config.unit, remote.index);
                        }
                        return;
                    }
                    a = a + 1;
                    if (maxTries < 1 || a === maxTries) {
                        const element:HTMLElement = remote.node(config.delay.node, config.delay.target[0]),
                            assessment:test_assert = remote.evaluate(config.delay);
                        if (element !== undefined && element !== null && element.nodeType === 1) {
                            element.highlight();
                        }
                        assessment.assessment = ` delay timeout,${assessment.assessment}`;
                        remote.sendTest([assessment], remote.index);
                        return;
                    }
                    setTimeout(testBrowser_delay_timeout, delay);
                };
            if (config.delay === undefined || config.delay === null) {
                remote.report(config.delay, config.unit, remote.index);
            } else if (delay < 1 || maxTries < 1) {
                delayFunction();
            } else {
                setTimeout(delayFunction, delay);
            }
        },

        /* Indicates a well formed test that is logically invalid against the DOM */
        domFailure: false,

        /* Report javascript errors as test failures */
        // eslint-disable-next-line
        error: function testBrowser_error(message:string, source:string, line:number, col:number, error:Error):void {
            remote.sendTest([{
                assessment: message,
                location: "",
                pass: false,
                store: false,
                value: JSON.stringify({
                    file: source,
                    column: col,
                    line: line,
                    message: message,
                    stack: (error === null)
                        ? null
                        : error.stack
                })
            }], remote.index);
        },

        /* Determine whether a given test item is pass or fail */
        evaluate: function testBrowser_evaluate(unit:test_assertion_dom):test_assert {
            const rawValue:[HTMLElement, test_primitive] = remote.getProperty(unit),
                value_actual:HTMLElement|test_primitive = (unit.type === "element")
                    ? rawValue[0]
                    : rawValue[1],
                value_test:test_primitive = (unit.value === remote.magicString)
                    ? remote.store as test_primitive
                    : unit.value as test_primitive,
                qualifier:test_qualifier = unit.qualifier,
                test_nullable:boolean = (unit.nullable === true),
                highlight = function testBrowser_evaluate_highlight():void {
                    if (unit !== remote.test_item.test.delay && rawValue[0] !== null && rawValue[0] !== undefined && rawValue[0].nodeType === 1) {
                        rawValue[0].highlight();
                    }
                },
                s_actual:string = String(value_actual),
                nullable:boolean = (test_nullable === true && value_actual === null);
            if (unit.store === true) {
                remote.store = value_actual;
            }
            if (qualifier === "begins") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        if (Array.isArray(value_test) === true) {
                            const str_actual:string = String(value_actual);
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (str_actual.indexOf(String(value_test[index])) === 0) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(String(value_actual).indexOf(String(value_test)) === 0), value_test as string];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` begins with ${typeof value_actual}\n${s_unit}`
                            : ` begins with ${typeof value_actual}\n${value_actual.toString().slice(0, String(value_test).length)}\nnot ${typeof value_test}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "contains") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        const str_actual:string = String(value_actual);
                        if (Array.isArray(value_test) === true) {
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if ((str_actual.includes(String(value_test[index])) === true)) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(str_actual.includes(String(value_test)) === true), value_test as string];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nwhich contains\n${s_unit}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich does not contain ${typeof value_test}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "ends") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        const str_actual:string = String(value_actual),
                            str_value:string = String(value_test);
                        if (Array.isArray(value_test) === true) {
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (str_actual.lastIndexOf(String(value_test[index])) === str_actual.length - String(value_test[index]).length) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(str_actual.indexOf(str_value) === str_actual.length - str_value.length), str_value];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nwhich ends with\n${test[1]}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich does not end with ${typeof value_test}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "greater") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        if (Array.isArray(value_test) === true) {
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) > BigInt(value_test[index])) || Number(value_actual) > Number(value_test[index])) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) > BigInt(value_test)) || Number(value_actual) > Number(value_test)), value_test as string];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nwhich is greater than\n${s_unit}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich is not greater than ${typeof value_test}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "is") {
                const value:test_primitive = (Array.isArray(value_test) === true)
                        ? (value_test as test_primitive[]).includes(value_actual as test_primitive)
                            ? value_test[value_test.indexOf(value_actual as test_primitive)]
                            : JSON.stringify(value_test)
                        : value_test,
                    test:boolean = (value_actual === value),
                    s_unit:string = String(value);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is exactly ${typeof value_actual}\n${s_actual}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich is not ${typeof value_test}\n${(value === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "lesser") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        if (Array.isArray(value_test) === true) {
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) < BigInt(value_test[index])) || Number(value_actual) < Number(value_test[index])) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(((typeof value_actual === "bigint" || (typeof value_actual === "string" && (/^\d+n$/).test(String(value_actual)) === true)) && BigInt(value_actual as string) < BigInt(value_test)) || Number(value_actual) < Number(value_test)), value_test as string];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nwhich is lesser than ${typeof test[1]}\n${s_unit}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich is not lesser than ${typeof test[1]}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "not") {
                const value:test_primitive = (Array.isArray(value_test) === true)
                        ? (value_test as test_primitive[]).includes(value_actual as test_primitive)
                            ? value_test[value_test.indexOf(value_actual as test_primitive)]
                            : JSON.stringify(value_test)
                        : value_test,
                    test:boolean = (value_actual !== value),
                    s_unit:string = String(value);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nnot ${typeof value_test}\n${(value === null) ? JSON.stringify(value_test) : s_unit}`
                            : ` is exactly ${typeof value_actual}\n${s_actual}`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "not contains") {
                const test:[boolean, string] = (function testBrowser_evaluate_begins():[boolean, string] {
                        const str_actual:string = String(value_actual);
                        if (Array.isArray(value_test) === true) {
                            let index:number = value_test.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if ((str_actual.includes(String(value_test[index])) === false)) {
                                        return [true, value_test[index]];
                                    }
                                } while (index > 0);
                            }
                            return [false, null];
                        }
                        return [(str_actual.includes(String(value_test)) === false), value_test as string];
                    }()),
                    s_unit:string = String(test[1]);
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : (test[0] === true)
                            ? ` is ${typeof value_actual}\n${s_actual}\nwhich does not contain ${typeof test[1]}\n${(test[1] === null) ? JSON.stringify(value_test) : s_unit}`
                            : ` is ${typeof value_actual}\n${s_actual}\nwhich contains ${typeof test[1]}\n${s_unit}`,
                    location: unit.node.nodeString,
                    pass: (test[0] === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (qualifier === "numeric") {
                const test:boolean = (typeof value_actual === "number" || typeof value_actual === "bigint" || (typeof value_actual === "string" && (isNaN(Number(value_actual)) === false || (/^\d+n$/).test(value_actual) === true)));
                return {
                    assessment: (nullable === true)
                        ? " is null, which is accepted"
                        : ((value_test === false && test === false) || test === true)
                            ? ` is\n${s_actual}\nwhich is a numeric value`
                            : ` is\n${s_actual}\nwhich is not a numeric value`,
                    location: unit.node.nodeString,
                    pass: (test === true || nullable === true),
                    store: unit.store,
                    value: value_actual as string
                };
            }
            if (unit.type === "element") {
                highlight();
                return {
                    assessment: " value is of type dom element",
                    location: unit.node.nodeString.replace(/\s?highlight/, ""),
                    pass: false,
                    store: false,
                    value: "element"
                };
            }
            highlight();
            return {
                assessment: " value does not match other assertion criteria",
                location: unit.node.nodeString,
                pass: false,
                store: false,
                value: remote.stringify(value_actual as test_primitive)
            };
        },

        /* Process a single event instance */
        event: function testBrowser_event(item:services_test_browser, pageLoad:boolean):void {
            if (item.index > remote.index || remote.index < 0) {
                remote.index = item.index;
                remote.suite_name = item.suite_name;
                const complete = function testBrowser_event_complete():void {
                        remote.delay(item.test);
                    },
                    action = function testBrowser_event_action(index:number):void {
                        let element:HTMLElement,
                            config:test_browserEvent,
                            htmlElement:HTMLInputElement,
                            delay:number;
                        do {
                            config = item.test.interaction[index];
                            if (config.event === "refresh") {
                                item.test.event_index = index + 1;
                                dashboard.global.state.test_automation = item;
                                localStorage.state = JSON.stringify(dashboard.global.state);
                                location.reload();
                                return;
                            }
                            if (config.event === "wait") {
                                delay = (isNaN(Number(config.value)) === true)
                                    ? 0
                                    : Number(config.value);
                                index = index + 1;
                                setTimeout(function testBrowser_event_action_delayNext():void {
                                    if (index < eventLength) {
                                        testBrowser_event_action(index);
                                    } else {
                                        complete();
                                    }
                                }, delay);
                                return;
                            } else if (config.event === "resize" && config.node[0][0] === "window") {
                                if (config.coords === undefined || config.coords === null || config.coords.length !== 2 || isNaN(Number(config.coords[0])) === true || isNaN(Number(config.coords[0])) === true) {
                                    remote.sendTest([{
                                        assessment: " event error on resize",
                                        location: config.node.nodeString,
                                        pass: false,
                                        store: false,
                                        value: null
                                    }], item.index);
                                    remote.test_item = null;
                                    return;
                                }
                                window.resizeTo(Number(config.coords[0]), Number(config.coords[1]));
                            } else {
                                element = remote.node(config.node, null);
                                if (remote.domFailure === true) {
                                    remote.domFailure = false;
                                    return;
                                }
                                if (element === null || element === undefined) {
                                    remote.sendTest([{
                                        assessment: ` node is ${element}`,
                                        location: config.node.nodeString,
                                        pass: false,
                                        store: false,
                                        value: null
                                    }], item.index);
                                    remote.test_item = null;
                                    return;
                                }
                                if (config.event === "move") {
                                    element.style.top = `${config.coords[0]}em`;
                                    element.style.left = `${config.coords[1]}em`;
                                } else if (config.event === "resize") {
                                    element.style.width = `${config.coords[0]}em`;
                                    element.style.height = `${config.coords[1]}em`;
                                } else if (config.event === "setValue") {
                                    htmlElement = element as HTMLInputElement;
                                    if (config.value.indexOf("replace\u0000") === 0) {
                                        const values:[string, string] = ["", ""],
                                            parent:HTMLElement = element.parentNode,
                                            sep:string = (htmlElement.value.charAt(0) === "/")
                                                ? "/"
                                                : "\\";
                                        config.value = config.value.replace("replace\u0000", "");
                                        values[0] = config.value.slice(0, config.value.indexOf("\u0000"));
                                        values[1] = config.value.slice(config.value.indexOf("\u0000") + 1).replace(/(\\|\/)/g, sep);
                                        if (parent.getAttribute("class") === "fileAddress") {
                                            htmlElement.value = htmlElement.value.replace(values[0], values[1]);
                                        } else {
                                            htmlElement.value = config.value;
                                        }
                                    } else {
                                        htmlElement.value = config.value;
                                    }
                                } else {
                                    if (config.event === "keydown" || config.event === "keyup") {
                                        if (config.value === "Alt") {
                                            if (config.event === "keydown") {
                                                remote.keyAlt = true;
                                            } else {
                                                remote.keyAlt = false;
                                            }
                                        } else if (config.value === "Control") {
                                            if (config.event === "keydown") {
                                                remote.keyControl = true;
                                            } else {
                                                remote.keyControl = false;
                                            }
                                        } else if (config.value === "Shift") {
                                            if (config.event === "keydown") {
                                                remote.keyShift = true;
                                            } else {
                                                remote.keyShift = false;
                                            }
                                        } else {
                                            const tabIndex:number = element.tabIndex,
                                                event:KeyboardEvent = new KeyboardEvent(config.event, {
                                                    key: config.value,
                                                    altKey: remote.keyAlt,
                                                    ctrlKey: remote.keyControl,
                                                    shiftKey: remote.keyShift
                                                });
                                            element.tabIndex = 0;
                                            element.dispatchEvent(new Event("focus"));
                                            element.dispatchEvent(event);
                                            element.tabIndex = tabIndex;
                                        }
                                    } else if (config.event === "click" || config.event === "contextmenu" || config.event === "dblclick" || config.event === "mousedown" || config.event === "mouseenter" || config.event === "mouseleave" || config.event === "mousemove" || config.event === "mouseout" || config.event === "mouseover" || config.event === "mouseup" || config.event === "touchend" || config.event === "touchstart") {
                                        const event:MouseEvent = new MouseEvent(config.event, {
                                            altKey: remote.keyAlt,
                                            ctrlKey: remote.keyControl,
                                            shiftKey: remote.keyShift
                                        });
                                        element.dispatchEvent(event);
                                    } else {
                                        const event:Event = new Event(config.event, {bubbles: true, cancelable:true});
                                        element.dispatchEvent(event);
                                    }
                                }
                            }
                            index = index + 1;
                        } while (index < eventLength);
                        complete();
                    },
                    eventLength:number = (item.test.interaction === null)
                        ? 0
                        : item.test.interaction.length;
                remote.test_item = item;
                if (item.test.interaction === null || item.test.interaction.length < 1 || item.test.event_index >= item.test.interaction.length) {
                    complete();
                } else {
                    action((item.test.event_index === null || item.test.event_index === undefined)
                        ? 0
                        : item.test.event_index
                    );
                }
            }
        },

        /* Get the value of the specified property/attribute */
        getProperty: function testBrowser_getProperty(unit:test_assertion_dom):[HTMLElement, test_primitive] {
            let type:boolean = false;
            const element:HTMLElement = (unit.node.length > 0)
                    ? remote.node(unit.node, unit.target[0])
                    : null,
                pLength:number = unit.target.length,
                property = function testBrowser_getProperty_property(origin:HTMLElement|Window):test_primitive {
                    let index_prop:number = 0,
                        prop:number|string = null,
                        method:string = null,
                        format:boolean|object|string = origin;
                    if (unit.type === "attribute") {
                        unit.node.nodeString = `${unit.node.nodeString}.getAttribute("${unit.target[0]}")`;
                        format = element.getAttribute(unit.target[0]);
                    } else if (pLength > 0) {
                        do {
                            prop = unit.target[index_prop];
                            method = (typeof prop === "string" && prop.includes("(") === true && prop.includes(")") === true)
                                ? prop.slice(0, prop.indexOf("("))
                                : "";
                            if (prop === "typeof" && type === false) {
                                unit.node.nodeString = `typeof ${unit.node.nodeString}`;
                                type = true;
                            } else if (prop === "isNaN") {
                                format = isNaN(Number(prop));
                            } else if (prop !== "" && prop !== null && prop !== undefined) {
                                if (typeof prop === "string") {
                                    unit.node.nodeString = `${unit.node.nodeString}["${prop}"]`;
                                } else {
                                    unit.node.nodeString = `${unit.node.nodeString}[${prop}]`;
                                }
                                // @ts-expect-error - dynamically infers a property on a static object
                                if (method !== "" && (format as object)[method] !== undefined) {
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    format = format[method](prop.slice(prop.indexOf("(") + 1, prop.lastIndexOf(")")));
                                } else if (format !== null) {
                                    // @ts-expect-error - dynamically infers a property on a static object
                                    format = (format as string[])[prop as number];
                                }
                            }
                            if (format === null || format === undefined) {
                                break;
                            }
                            index_prop = index_prop + 1;
                        } while (index_prop < pLength);
                    }
                    if (type === true) {
                        return typeof format;
                    }
                    return format as string;
                };
            if (unit.type === "element") {
                return [element, false];
            }
            if (unit.target[0] === "window") {
                return [element, property(window)];
            }
            if (element === null) {
                return [null, null];
            }
            if (element === undefined || pLength < 0) {
                return [undefined, undefined];
            }
            return [element, property(element)];
        },

        /* The index of the current executing test */
        index: -1,

        /* Whether the Alt key is pressed, which can modify many various events */
        keyAlt: false,

        /* Whether the Control key is pressed, which can modify many various events */
        keyControl: false,

        /* Whether the Shift key is pressed, which can modify many various events */
        keyShift: false,

        /* Identifies that test comparison value should come from storage */
        magicString: null,

        /* Gather a DOM node using instructions from a data structure */
        node: function testBrowser_node(dom:test_browserDOM, property:string):HTMLElement {
            let element:Document|HTMLElement = document,
                node:[test_domMethod, string, number],
                a:number = 0,
                fail:string = "";
            const nodeLength:number = dom.length,
                str:string[] = ["document"];
            if (dom === null || dom === undefined) {
                return null;
            }
            do {
                node = dom[a];
                if (node[0] === "getElementById" && a > 0) {
                    fail = "Bad test. Method 'getElementById' must only occur as the first DOM method.";
                }
                if (node[2] === null && (node[0] === "childNodes" || node[0] === "getElementsByAttribute" || node[0] === "getElementsByClassName" || node[0] === "getElementsByName" || node[0] === "getElementsByTagName" || node[0] === "getElementsByText" || node[0] === "getModalsByModalType" || node[0] === "getNodesByType")) {
                    if (property !== "length" && a !== nodeLength - 1) {
                        fail = `Bad test. Property '${node[0]}' requires an index value as the third data point of a DOM item: ["${node[0]}", "${node[1]}", ${node[2]}]`;
                    }
                }
                if (node[0] === "childNodes" && node[2] !== null) {
                    if (fail === "") {
                        element = element.childNodes[node[2]] as HTMLElement;
                    }
                    str.push(".childNodes[");
                    str.push(String(node[2]));
                    str.push("]");
                } else if (node[1] === "" || node[1] === null || node[0] === "activeElement" || node[0] === "documentElement" || node[0] === "firstChild" || node[0] === "lastChild" || node[0] === "nextSibling" || node[0] === "parentNode" || node[0] === "previousSibling") {
                    if (fail === "") {
                        // @ts-expect-error - TypeScript's DOM types do not understand custom extensions to the Document object
                        element = element[node[0]];
                    }
                    str.push(".");
                    str.push(node[0]);
                } else if (node[2] === null || node[0] === "getElementById") {
                    if (fail === "") {
                        // @ts-expect-error - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                        element = element[node[0]](node[1]);
                    }
                    str.push(".");
                    str.push(node[0]);
                    str.push("(\"");
                    str.push(node[1]);
                    str.push("\")");
                } else {
                    // @ts-expect-error - TypeScript cannot implicitly walk the DOM by combining data structures and DOM methods
                    const el:HTMLElement[] = element[node[0]](node[1]),
                        len:number = (el === null || el.length < 1)
                            ? -1
                            : el.length;
                    str.push(".");
                    str.push(node[0]);
                    str.push("(\"");
                    str.push(node[1]);
                    str.push("\")");
                    str.push("[");
                    if (node[2] < 0 && len > 0) {
                        if (fail === "") {
                            element = el[len - 1];
                        }
                        str.push(String(len - 1));
                    } else {
                        if (fail === "") {
                            element = el[node[2]];
                        }
                        str.push(String(node[2]));
                    }
                    str.push("]");
                }
                if (element === null || element === undefined) {
                    dom.nodeString = str.join("");
                    if (element === undefined) {
                        return undefined;
                    }
                    return null;
                }
                a = a + 1;
            } while (a < nodeLength);
            dom.nodeString = str.join("");
            if (fail !== "") {
                remote.sendTest([{
                    assessment: fail,
                    location: dom.nodeString,
                    pass: false,
                    store: false,
                    value: ""
                }], remote.index);
                remote.domFailure = true;
                return null;
            }
            return element as HTMLElement;
        },

        /* Process all cases of a test scenario for a given test item */
        report: function testBrowser_report(delay:test_assertion_dom, test:test_assertion_dom[], index:number):void {
            let a:number = 0;
            const result:test_assert[] = [],
                length:number = test.length;console.log(test);
            if (delay !== undefined && delay !== null) {
                result.push(remote.evaluate(delay));
                if (remote.domFailure === true) {
                    remote.domFailure = false;
                    return;
                }
            }
            if (length > 0) {
                do {
                    if (test[a] !== null) {
                    result.push(remote.evaluate(test[a]));
                        if (remote.domFailure === true) {
                            remote.domFailure = false;
                            return;
                        }
                    }
                    a = a + 1;
                } while (a < length);
                remote.sendTest(result, index);
            }
        },

        /* A single location to package test evaluations into a format for transfer across the network */
        sendTest: function testBrowser_sendTest(payload:test_assert[], index:number):services_test_browser {
            const test:services_test_browser = {
                index: index,
                magicString: null,
                result: payload,
                store: null,
                suite_name: remote.suite_name,
                test: null
            };
            // eslint-disable-next-line
            console.log(`On browser sending index ${index} of suite "${remote.suite_name}"`);
            // dashboard.message.send({data: test, service: "services_test_browser"});
            return test;
        },

        store: null,
        suite_name: null,

        /* Converts a primitive of any type into a string for presentation */
        stringify: function testBrowser_raw(primitive:test_primitive):string {
            return (typeof primitive === "string")
                ? `"${primitive.replace(/"/g, "\\\"")}"`
                : String(primitive);
        },
        test_item: null

    };
    if (location.href.indexOf("?test_browser") > 0) {
        const data:services_test_browser = socketData.data as services_test_browser;
        // eslint-disable-next-line
        console.log(`On browser receive index ${data.index} of suite "${data.suite_name}"`);
        if (dashboard.global.state.test_automation !== null) {
            dashboard.global.state.test_automation = null;
            localStorage.state = JSON.stringify(dashboard.global.state);
        }
        remote.magicString = data.magicString;
        remote.store = data.store;
        remote.suite_name = data.suite_name;
        if (data.index === -10) {
            window.close();
            return;
        }
        if (Array.isArray(data.result) === true && data.result.length > 0) {
            remote.sendTest(data.result, data.index);
            return;
        }
        remote.event(data, false);
    }
};

export default test_browser;