
import { Terminal } from "@xterm/xterm";

declare global {
    interface Document {
        activeElement: HTMLElement;
        getElementsByAttribute: (name:string, value:string) => HTMLElement[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => HTMLElement[];
        getNodesByType: (typeValue:number | string) => Node[];
        highlight: (element:HTMLElement) => void;
        removeHighlight: (element:HTMLElement) => void;
    }

    /**
     * Extends the DOM's Element interface to include custom methods.
     */
    interface Element {
        addClass: (className:string) => void;
        appendText: (text:string, empty?:boolean) => void;
        getAncestor: (identifier:string, selector:type_selector) => HTMLElement;
        getElementsByAttribute: (name:string, value:string) => HTMLElement[];
        getElementsByText: (textValue:string, caseSensitive?:boolean) => HTMLElement[];
        getNodesByType: (typeValue:number | string) => Node[];
        highlight: () => void;
        lowName: () => string;
        parentNode: HTMLElement;
        removeClass: (className:string) => void;
        removeHighlight: () => void;
    }

    interface String {
        capitalize: () => string;
    }

    interface FocusEvent {
        target: HTMLElement;
    }
    interface KeyboardEvent {
        target: HTMLElement;
    }
    interface MouseEvent {
        target: HTMLElement;
    }
    interface TouchEvent {
        target: HTMLElement;
    }

    // interface module_docker {}

    interface module_message {
        ports_active: (name_server:string) => HTMLElement;
        receiver: (event:websocket_event) => void;
        server_color: (name_server:string) => type_activation_status;
        socket_add: (config:socket_summary) => void;
        socket_destroy: (hash:string) => void;
    }

    interface module_port {
        external: (input:type_external_port[]) => void;
        internal: () => void;
        refresh: () => void;
    }

    interface module_server {
        cancel: (event:MouseEvent) => void;
        create: (event:MouseEvent) => void;
        definitions: (event:MouseEvent) => void;
        details: (event:MouseEvent) => void;
        edit: (event:MouseEvent) => void;
        list: () => void;
        message: (event:MouseEvent) => void;
        title: (name_server:string) => HTMLElement;
        validate: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_terminal {
        call: () => void;
        info: {
            cols: number;
            entries: string[];
            lenVert: number;
            posVert: number;
        };
        events: {
            data: (event:websocket_event) => void;
            input: (event:KeyboardEvent) => void;
        },
        item: Terminal;
        nodes: {
            input: HTMLTextAreaElement;
            output: HTMLElement;
        };
        socket: WebSocket;
        write: (input:string) => void;
    }

    interface socket_object {
        invoke: () => void;
        queue: (message:string) => void;
        queueStore: string[];
        socket: WebSocket;
    }

    interface terminal_input {
        domEvent:KeyboardEvent;
        key:string;
    }

    interface terminal_selection {
        end: {
            x: number;
            y: number;
        }
        start: {
            x: number;
            y: number;
        }
    }
}