
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
            invoke: socketCall,
            queueStore: [],
            queue: function core_queue(message_item:string):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
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
            const addClass = function core_dom_addClass(className:string):void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const element:HTMLElement = this,
                        classy:string = element.getAttribute("class"),
                        classes:string[] = (classy === null)
                            ? []
                            : classy.split(" ");
                    if (classes.indexOf(className) > -1) {
                        return;
                    }
                    if (classes.length < 1) {
                        element.setAttribute("class", className);
                    } else {
                        element.setAttribute("class", `${classy} ${className}`);
                    }
                },
                // add text to an DOM element
                // * text: string - The text string to append.
                // * empty: boolean (optional) - if true all child nodes will be removed before appending the text string.
                appendText = function core_dom_appendText(text:string, empty?:boolean):void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const element:HTMLElement = this;
                    if (empty === true) {
                        // eslint-disable-next-line no-restricted-syntax
                        element.innerHTML = "";
                    }
                    if (text !== "") {
                        element.appendChild(document.createTextNode(text));
                    }
                },
                // capitalize a string
                capitalize = function core_capitalize():string {
                    // eslint-disable-next-line no-restricted-syntax
                    return this.charAt(0).toUpperCase() + this.slice(1);
                },
                // return a formatted date and time string from a number
                // * date: the date portion is optional
                dateTime = function core_dateTime(date:boolean):string {
                    // eslint-disable-next-line no-restricted-syntax
                    const dateItem:Date = new Date(this),
                        month:number = dateItem.getMonth(),
                        output:string[] = [],
                        pad = function core_dateTime_pad(input:number, milliseconds:boolean):string {
                            const str:string = String(input);
                            if (milliseconds === true) {
                                if (str.length === 1) {
                                    return `${str}00`;
                                }
                                if (str.length === 2) {
                                    return `${str}0`;
                                }
                            } else if (str.length === 1) {
                                return `0${str}`;
                            }
                            return str;
                        },
                        hours:string = pad(dateItem.getHours(), false),
                        minutes:string = pad(dateItem.getMinutes(), false),
                        seconds:string = pad(dateItem.getSeconds(), false),
                        milliseconds:string = pad(dateItem.getMilliseconds(), true);
                    output.push(pad(dateItem.getDate(), false));
                    if (month === 0) {
                        output.push("JAN");
                    } else if (month === 1) {
                        output.push("FEB");
                    } else if (month === 2) {
                        output.push("MAR");
                    } else if (month === 3) {
                        output.push("APR");
                    } else if (month === 4) {
                        output.push("MAY");
                    } else if (month === 5) {
                        output.push("JUN");
                    } else if (month === 6) {
                        output.push("JUL");
                    } else if (month === 7) {
                        output.push("AUG");
                    } else if (month === 8) {
                        output.push("SEP");
                    } else if (month === 9) {
                        output.push("OCT");
                    } else if (month === 10) {
                        output.push("NOV");
                    } else if (month === 11) {
                        output.push("DEC");
                    }
                    if (date === false) {
                        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
                    }
                    output.push(`${dateItem.getUTCFullYear()},`);
                    output.push(`${hours}:${minutes}:${seconds}.${milliseconds}`);
                    return output.join(" ");
                
                },
                // getAncestor - A method to walk up the DOM towards the documentElement.
                // * identifier: string - The string value to search for.
                // * selector: "class", "id", "name" - The part of the element to compare the identifier against.
                getAncestor = function core_dom_getAncestor(identifier:string, selector:type_selector):HTMLElement {
                    // eslint-disable-next-line no-restricted-syntax
                    let start:HTMLElement = (this === document) ? document.documentElement : this;
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
                getElementsByAttribute = function core_dom_getElementsByAttribute(name:string, value:string):HTMLElement[] {
                    // eslint-disable-next-line no-restricted-syntax
                    const start:HTMLElement = (this === document) ? document.documentElement : this,
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
                getElementsByText = function core_dom_getElementsByText(textValue:string, caseSensitive?:boolean):HTMLElement[] {
                    // eslint-disable-next-line no-restricted-syntax
                    const start:HTMLElement = (this === document) ? document.documentElement : this,
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
                getNodesByType = function core_dom_getNodesByType(typeValue:number|string):Node[] {
                    const valueString:string = (typeof typeValue === "string") ? `${typeValue.toLowerCase().replace("_node", "")}_node` : "",
                        numb:number = (isNaN(Number(typeValue)) === false)
                            ? Math.round(Number(typeValue))
                            : null,
                        output:Node[] = [],
                        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                        start:Document|HTMLElement = this,
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
        
                    child((start === document) ? document.documentElement : start as HTMLElement);
                    return output;
                },
                // highlight - Adds a class name to an element where that class name results in a CSS animated outline and focuses the element
                // * element: HTMLElement (optional) - A specified element to modify, default is the "this" value executed on an element.
                highlight = function core_dom_highlight(element?:HTMLElement):void {
                    // eslint-disable-next-line no-restricted-syntax
                    const item:HTMLElement = (this === document)
                            ? element
                            // eslint-disable-next-line no-restricted-syntax
                            : this,
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
                lowName = function core_dom_lowName():string {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const el:HTMLElement = this;
                    return el.tagName.toLowerCase();
                },
                // removes a single class name from an element's class attribute value
                // * className: string - The name of the class to remove.
                removeClass = function core_dom_removeClass(className:string):void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const element:HTMLElement = this,
                        classy:string = element.getAttribute("class"),
                        classes:string[] = (classy === null)
                            ? []
                            : classy.split(" "),
                        index:number = classes.indexOf(className);
                    if (index < 0) {
                        return;
                    }
                    classes.splice(index, 1);
                    if (classes.length < 1) {
                        element.removeAttribute("class");
                    } else {
                        element.setAttribute("class", classes.join(" "));
                    }
                },
                // removes the "highlight" class name from a given element
                // * element: HTMLElement (optional) - A specified element to modify, default is the "this" value executed on an element.
                removeHighlight = function core_dom_removeHighlight(element?:HTMLElement):void {
                    // eslint-disable-next-line no-restricted-syntax
                    const item:HTMLElement = (this === document)
                            ? element
                            // eslint-disable-next-line no-restricted-syntax
                            : this,
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
                },
                // converts a number into clock time format
                time = function core_time():string {
                    const numberString = function utilities_humanTime_numberString(numb:bigint):string {
                            const str:string = numb.toString();
                            return (str.length < 2)
                                ? `0${str}`
                                : str;
                        },
                        // eslint-disable-next-line no-restricted-syntax
                        elapsed:bigint     = BigInt(this * 1e9),
                        factorSec:bigint   = BigInt(1e9),
                        factorMin:bigint   = (60n * factorSec),
                        factorHour:bigint  = (3600n * factorSec),
                        factorDay:bigint   = (86400n * factorSec),
                        days:bigint        = (elapsed / factorDay),
                        elapsedDay:bigint  = (days * factorDay),
                        hours:bigint       = ((elapsed - elapsedDay) / factorHour),
                        elapsedHour:bigint = (hours * factorHour),
                        minutes:bigint     = ((elapsed - (elapsedDay + elapsedHour)) / factorMin),
                        elapsedMin:bigint  = (minutes * factorMin),
                        seconds:bigint     = ((elapsed - (elapsedDay + elapsedHour + elapsedMin)) / factorSec),
                        nanosecond:bigint  = (elapsed - (elapsedDay + elapsedHour + elapsedMin + (seconds * factorSec))),
                        nanoString:string  = (function utilities_humanTime_nanoString():string {
                            let nano:string = nanosecond.toString(),
                                a:number = nano.length;
                            if (a < 9) {
                                do {
                                    nano = `0${nano}`;
                                    a = a + 1;
                                } while (a < 9);
                            }
                            return nano;
                        }()),
                        secondString:string = `${numberString(seconds)}.${nanoString}`,
                        minuteString:string = numberString(minutes),
                        hourString:string = numberString(hours),
                        dayString:string = (days === 1n)
                            ? `1 day `
                            : `${days.toString()} days `;
                    return `${dayString}${hourString}:${minuteString}:${secondString}`;
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

            String.prototype.capitalize              = capitalize;
            Number.prototype.dateTime                = dateTime;
            Number.prototype.time                    = time;
        };
    dom();
    return socket;
};

export default core;