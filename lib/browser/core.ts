
import universal from "../core/universal.ts";

const core = function core(config:config_core):socket_object {
    const socketCall = function core_socketCall():WebSocket {
            const scheme:string = (location.protocol === "http:")
                    ? "ws"
                    : "wss",
                socketItem:WebSocket = new WebSocket(`${scheme}://${location.host}`, [config.type]),
                open = function core_socketCall_open(event:Event):void {
                    const target:WebSocket = event.target as WebSocket;
                    socket.socket = target;
                    if (socket.queueStore.length > 0) {
                        do {
                            socket.socket.send(socket.queueStore[0]);
                            socket.queueStore.splice(0, 1);
                        } while (socket.queueStore.length > 0);
                    }
                };
            socketItem.onmessage = config.message;
            socketItem.onopen = (config.open === null || config.open === undefined)
                ? open
                : config.open;
            if (config.close !== null && config.close !== undefined) {
                socketItem.onclose = config.close;
            }
            return socketItem;
        },
        socket:socket_object = {
            connected: false,
            invoke: socketCall,
            queueStore: [],
            queue: function core_queue(message_item:string):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const instance:socket_object = this;
                if (instance.socket === null || instance.socket.readyState !== 1) {
                    instance.queueStore.push(message_item);
                } else if (instance.queueStore.length > 0) {
                    instance.queueStore.push(message_item);
                    do {
                        instance.socket.send(instance.queueStore.splice(0, 1)[0]);
                    } while (instance.queueStore.length > 0);
                } else {
                    instance.socket.send(message_item);
                }
            },
            socket: null
        },
        dom = function core_dom():void {
            // addClass - adds a new class value to an element's class attribute if not already present
            // * className:string - The name of the class to add.
            const addClass = function core_dom_addClass(this:HTMLElement, className:string):void {
                    const classy:string = this.getAttribute("class"),
                        classes:string[] = (classy === null)
                            ? []
                            : classy.replace(/\s+/g, " ").split(" ");
                    if (classes.includes(className) === true) {
                        return;
                    }
                    if (classes.length < 1) {
                        this.setAttribute("class", className);
                    } else {
                        this.setAttribute("class", `${classy} ${className}`);
                    }
                },
                // add text to an DOM element
                // * text: string - The text string to append.
                // * empty: boolean (optional) - if true all child nodes will be removed before appending the text string.
                appendText = function core_dom_appendText(this:HTMLElement, text:string, empty?:boolean):void {
                    if (empty === true) {
                        // eslint-disable-next-line no-restricted-syntax
                        this.innerHTML = "";
                    }
                    if (text !== "") {
                        this.appendChild(document.createTextNode(text));
                    }
                },
                // bytes - converts a number into something like "501,789,753,344 bytes (467.3GiB), 10%"
                bytes = function core_dom_bytes(this:number, input?:number):string {
                    if (input === undefined) {
                        input = Number(this);
                    }
                    //find the string length of input and divide into triplets
                    let output:string = "",
                        length:number = input.toString().length;

                    const triples:number = (function terminal_common_prettyBytes_triples():number {
                            if (length < 22) {
                                return Math.floor((length - 1) / 3);
                            }
                            //it seems the maximum supported length of integer is 22
                            return 8;
                        }()),
                        //each triplet is worth an exponent of 1024 (2 ^ 10)
                        power:number   = (function terminal_common_prettyBytes_power():number {
                            let a:number = triples - 1,
                                b:number = 1024;
                            if (triples === 0) {
                                return 0;
                            }
                            if (triples === 1) {
                                return 1024;
                            }
                            do {
                                b = b * 1024;
                                a = a - 1;
                            } while (a > 0);
                            return b;
                        }()),
                        //kilobytes, megabytes, and so forth...
                        unit:string[] = [
                            "",
                            "KiB",
                            "MiB",
                            "GiB",
                            "TiB",
                            "PiB",
                            "EiB",
                            "ZiB",
                            "YiB"
                        ];

                    if (typeof input !== "number" || Number.isNaN(input) === true || input < 0 || input % 1 > 0) {
                        //input not a positive integer
                        output = "0B";
                    } else if (triples === 0) {
                        //input less than 1000
                        output = `${input}B`;
                    } else {
                        //for input greater than 999
                        length = Math.floor((input / power) * 100) / 100;
                        output = length.toFixed(1) + unit[triples];
                    }
                    return output;
                },
                // bytes - converts a number into a format like "1,000,000 bytes (0.9MiB)"
                bytesLong = function core_dom_bytesLong(this:number):string {
                    const input:number = Number(this);
                    if (isNaN(input) === true) {
                        return "0 bytes";
                    }
                    // @ts-expect-error Error ('this' context of type 'void' is not assignable to method's 'this' of type 'number') appears incorrect
                    return `${input.commas()} bytes (${bytes(input)})`;
                },
                // getAncestor - A method to walk up the DOM towards the documentElement.
                // * identifier: string - The string value to search for.
                // * selector: "class", "id", "name" - The part of the element to compare the identifier against.
                getAncestor = function core_dom_getAncestor(this:Document|HTMLElement, identifier:string, selector:type_selector):HTMLElement {
                    let start:HTMLElement = (this === document)
                        ? document.documentElement
                        : this as HTMLElement;
                    const test = function core_dom_getAncestor_test():boolean {
                            if (selector === "class") {
                                const classy:string = start.getAttribute("class"),
                                    classes:string[] = (classy === null)
                                        ? []
                                        : classy.split(" ");
                                if (classes.indexOf(identifier) > -1) {
                                    return true;
                                }
                                return false;
                            }
                            if (selector === "id") {
                                if (start.getAttribute("id") === identifier) {
                                    return true;
                                }
                                return false;
                            }
                            if (start.lowName() === identifier) {
                                return true;
                            }
                            return false;
                        };
                    if (start === null || start === undefined) {
                        return null;
                    }
                    if (start === document.documentElement) {
                        return start;
                    }
                    do {
                        start = start.parentNode;
                        if (start === null) {
                            return null;
                        }
                    } while (start !== document.documentElement && test() === false);
                    return start;
                },
                // getElementByAttribute - Search all descendant elements containing a matching attribute with matching value and returns an array of corresponding elements.
                // * name: string - The name of the attribute to search for.  An empty string means accept every attribute name.
                // * value: string - The attribute value to search for.  An empty string means accept any attribute value.
                getElementsByAttribute = function core_dom_getElementsByAttribute(this:Document|HTMLElement, name:string, value:string):HTMLElement[] {
                    const start:HTMLElement = (this === document)
                            ? document.documentElement
                            : this as HTMLElement,
                        attrs:Attr[]    = start.getNodesByType(2) as Attr[],
                        out:HTMLElement[]   = [];
                    if (typeof name !== "string") {
                        name = "";
                    }
                    if (typeof value !== "string") {
                        value = "";
                    }
                    attrs.forEach(function core_dom_getElementsByAttribute_each(item:Attr):void {
                        if (item.name === name || name === "") {
                            if (item.value === value || value === "") {
                                out.push(item.ownerElement as HTMLElement);
                            }
                        }
                    });
                    return out;
                },
                // getElementsByText - Returns an array of descendant elements containing the white space trimmed text.
                // * textValue: string - The text to match.  The value must exactly match the complete text node value after trimming white space.
                // * castSensitive: boolean - Whether case sensitivity should apply.
                getElementsByText = function core_dom_getElementsByText(this:Document|HTMLElement, textValue:string, caseSensitive?:boolean):HTMLElement[] {
                    const start:HTMLElement = (this === document)
                            ? document.documentElement
                            : this as HTMLElement,
                        texts:Text[]    = start.getNodesByType(3) as Text[],
                        out:HTMLElement[]   = [];
                    if (typeof textValue !== "string") {
                        textValue = "";
                    } else {
                        textValue = textValue.replace(/^\s+/, "").replace(/\s+$/, "");
                    }
                    if (typeof caseSensitive !== "boolean") {
                        caseSensitive = false;
                    }
                    texts.forEach(function core_dom_getElementsByText_each(item:Text):void {
                        const text:string = (caseSensitive === true)
                            ? item.textContent.toLowerCase()
                            : item.textContent;
                        if (textValue === "" && text.replace(/\s+/, "") !== "") {
                            out.push(item.parentElement);
                        } else if (textValue !== "" && text.replace(/^\s+/, "").replace(/\s+$/, "") === textValue) {
                            out.push(item.parentElement);
                        }
                    });
                    return out;
                },
                // getNodesByType - Returns an array of DOM nodes matching the provided node type.
                // * typeValue: string|number = The value must be a node type name or a node type number (0-12)
                // - An empty string, "all", or 0 means gather all descendant nodes regardless of type.
                // - For standard values see: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
                getNodesByType = function core_dom_getNodesByType(this:Document|HTMLElement, typeValue:number|string):Node[] {
                    const valueString:string = (typeof typeValue === "string") ? `${typeValue.toLowerCase().replace("_node", "")}_node` : "",
                        numb:number = (isNaN(Number(typeValue)) === false)
                            ? Math.round(Number(typeValue))
                            : null,
                        output:Node[] = [],
                        child = function core_dom_getNodesByType_child(recurse:HTMLElement):void {
                            const children:NodeListOf<ChildNode> = recurse.childNodes,
                                len:number              = children.length,
                                attributes:NamedNodeMap = recurse.attributes,
                                atLen:number            = attributes.length;
                            let a:number                = 0;
                            // Special functionality for attribute types.
                            if (atLen > 0 && (types === 2 || types === 0)) {
                                do {
                                    output.push(attributes[a]);
                                    a = a + 1;
                                } while (a < atLen);
                            }
                            a = 0;
                            if (len > 0) {
                                do {
                                    if (children[a].nodeType === types || types === 0) {
                                        output.push(children[a]);
                                    }
                                    if (children[a].nodeType === 1) {
                                        //recursion magic
                                        core_dom_getNodesByType_child(children[a] as HTMLElement);
                                    }
                                    a = a + 1;
                                } while (a < len);
                            }
                        },
                        types:number = (function core_dom_getNodesByType_types():number {
                            if (valueString === "element_node") {
                                return 1;
                            }
                            if (valueString === "attribute_node") {
                                return 2;
                            }
                            if (valueString === "text_node") {
                                return 3;
                            }
                            if (valueString === "cdata_section_node") {
                                return 4;
                            }
                            if (valueString === "entity_reference_node") {
                                return 5;
                            }
                            if (valueString === "entity_node") {
                                return 6;
                            }
                            if (valueString === "processing_instruction_node") {
                                return 7;
                            }
                            if (valueString === "comment_node") {
                                return 8;
                            }
                            if (valueString === "document_node") {
                                return 9;
                            }
                            if (valueString === "document_type_node") {
                                return 10;
                            }
                            if (valueString === "document_fragment_node") {
                                return 11;
                            }
                            if (valueString === "notation_node") {
                                return 12;
                            }
                            if (numb !== null && numb < 13 && numb > -1) {
                                return numb;
                            }
                            return 0;
                        }());
        
                    child((this === document) ? document.documentElement : this as HTMLElement);
                    return output;
                },
                // highlight - Adds a class name to an element where that class name results in a CSS animated outline and focuses the element
                // * element: HTMLElement (optional) - A specified element to modify, default is the "this" value executed on an element.
                highlight = function core_dom_highlight(this:Document|HTMLElement, element?:HTMLElement):void {
                    const item:HTMLElement = (this === document)
                            ? element
                            : this as HTMLElement,
                        classy:string = (item === element)
                            ? null
                            : item.getAttribute("class"),
                        classes:string[] = (classy === null)
                            ? null
                            : classy.split(" "),
                        el:HTMLElement = (item === undefined)
                            ? null
                            : (item.nodeName.toLowerCase() === "input")
                                ? item.parentNode
                                : (classes !== null && (classes.indexOf("body") > -1 || classes.indexOf("fileList") > -1))
                                    ? item.getAncestor("box", "class")
                                    : item,
                        position:string = (el === null)
                            ? null
                            : getComputedStyle(el).position;
                    if (el === null) {
                        return;
                    }
                    el.addClass("highlight");
                    if (position !== "absolute" && position !== "relative" && position !== "fixed") {
                        el.style.position = "relative";
                    }
                    el.focus();
                },
                // return a tag's lowercase name.  XML is case sensitive, but HTML returns uppercase tag names
                lowName = function core_dom_lowName(this:HTMLElement):string {
                    return this.tagName.toLowerCase();
                },
                // removes a single class name from an element's class attribute value
                // * className: string - The name of the class to remove.
                removeClass = function core_dom_removeClass(this:HTMLElement, className:string):void {
                    const classy:string = this.getAttribute("class"),
                        classes:string[] = (classy === null)
                            ? []
                            : classy.split(" "),
                        index:number = classes.indexOf(className);
                    if (index < 0) {
                        return;
                    }
                    classes.splice(index, 1);
                    if (classes.length < 1) {
                        this.removeAttribute("class");
                    } else {
                        this.setAttribute("class", classes.join(" "));
                    }
                },
                // removes the "highlight" class name from a given element
                // * element: HTMLElement (optional) - A specified element to modify, default is the "this" value executed on an element.
                removeHighlight = function core_dom_removeHighlight(this:Document|HTMLElement, element?:HTMLElement):void {
                    const item:HTMLElement = (this === document)
                            ? element
                            : this as HTMLElement,
                        el:HTMLElement = (item === undefined)
                            ? null
                            : (item.nodeName.toLowerCase() === "input")
                                ? item.parentNode
                                : item,
                        style:string = (el === null)
                            ? null
                            : el.getAttribute("style");
                    if (el === null) {
                        return;
                    }
                    el.removeClass("highlight");
                    if (style !== null && style.indexOf("position") > -1) {
                        el.style.position = "static";
                    }
                };
        
            // Create a document method
            document.getElementsByAttribute          = getElementsByAttribute;
            document.getNodesByType                  = getNodesByType;
            document.getElementsByText               = getElementsByText;
            document.highlight                       = highlight;
            document.removeHighlight                 = removeHighlight;
        
            // Ensure dynamically created elements get these methods too
            Element.prototype.addClass               = addClass;
            Element.prototype.appendText             = appendText;
            Element.prototype.getAncestor            = getAncestor;
            Element.prototype.getElementsByAttribute = getElementsByAttribute;
            Element.prototype.getNodesByType         = getNodesByType;
            Element.prototype.getElementsByText      = getElementsByText;
            Element.prototype.highlight              = highlight;
            Element.prototype.lowName                = lowName;
            Element.prototype.removeClass            = removeClass;
            Element.prototype.removeHighlight        = removeHighlight;

            BigInt.prototype.time_elapsed            = universal.time_elapsed;
            Number.prototype.bytes                   = bytes;
            Number.prototype.bytesLong               = bytesLong;
            Number.prototype.commas                  = universal.commas;
            Number.prototype.dateTime                = universal.dateTime;
            Number.prototype.time_elapsed            = universal.time_elapsed;

            String.prototype.capitalize              = universal.capitalize;
            String.prototype.file_sanitize           = universal.file_sanitize;
        };
    dom();
    return socket;
};

export default core;