
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

    interface Number {
        dateTime: (date:boolean) => string;
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

    interface module_compose {
        cancelCreate: (event:MouseEvent) => void;
        cancelVariables: (event:MouseEvent) => void;
        create: (event:MouseEvent) => void;
        editVariables: () => void;
        init: () => void;
        list: (type:"containers"|"variables") => void;
        message: (event:MouseEvent) => void;
        nodes: {
            containers_list: HTMLElement;
            containers_new: HTMLButtonElement;
            variables_list: HTMLElement;
            variables_new: HTMLButtonElement;
        };
        validateContainer: (event:FocusEvent|KeyboardEvent) => void;
        validateVariables: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_message {
        receiver: (event:websocket_event) => void;
        send: (action:type_dashboard_action, config:configuration_server|services_compose_container|store_string, service:type_service) => void;
    }

    interface module_port {
        active: (name_server:string) => HTMLElement;
        external: (input:external_ports) => void;
        internal: () => void;
        nodes: {
            port_refresh: HTMLElement;
        };
        refresh: () => void;
    }

    interface module_server {
        cancel: (event:MouseEvent) => void;
        color: (name_server:string) => type_activation_status;
        create: (event:MouseEvent) => void;
        definitions: (event:MouseEvent) => void;
        details: (event:MouseEvent) => void;
        edit: (event:MouseEvent) => void;
        list: () => void;
        message: (event:MouseEvent) => void;
        nodes: {
            server_definitions: HTMLElement;
            server_new: HTMLElement;
        };
        socket_add: (config:socket_summary) => void;
        title: (name_server:string) => HTMLElement;
        validate: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_terminal {
        events: {
            data: (event:websocket_event) => void;
            firstData: (event:websocket_event) => void;
            input: (input:terminal_input) => void;
        };
        id: string;
        info: terminal_identifiers;
        init: () => void;
        item: Terminal;
        nodes: {
            output: HTMLElement;
        };
        socket: WebSocket;
    }

    interface socket_object {
        invoke: () => void;
        queue: (message:string) => void;
        queueStore: string[];
        socket: WebSocket;
    }

    interface terminal_identifiers {
        pid: number;
        port_browser: number;
        port_terminal: number;
        server_name: string;
    }

    interface terminal_input {
        domEvent:KeyboardEvent;
        key:string;
    }
}