
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
        time: () => string;
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
        activePorts: (name_server:string) => HTMLElement;
        cancelVariables: (event:MouseEvent) => void;
        container: (config:services_docker_compose) => void;
        create: (event:MouseEvent) => void;
        destroyContainer: (config:services_docker_compose) => void;
        editVariables: () => void;
        getTitle: (textArea:HTMLTextAreaElement) => string;
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

    interface module_dns {
        init: () => void;
        nodes: {
            input: HTMLInputElement;
            output: HTMLTextAreaElement;
            resolve: HTMLButtonElement;
            types: HTMLInputElement;
        };
        resolve: (event:MouseEvent) => void;
        response: (result:services_dns_output) => void;
    }

    interface module_fileSystem {
        init: () => void;
        nodes: {
            content: HTMLElement;
            failures: HTMLElement;
            input: HTMLInputElement;
            output: HTMLElement;
            search: HTMLInputElement;
            summary: HTMLElement;
        };
        receive: (fs:services_fileSystem) => void;
        send: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_hash {
        init: () => void;
        nodes: {};
        request: (event:MouseEvent) => void;
        response: (hash:services_hash) => void;
    }

    interface module_http {
        init: () => void;
        nodes: {
            encryption: HTMLInputElement;
            http_request: HTMLElement;
            request: HTMLTextAreaElement;
            responseBody: HTMLTextAreaElement;
            responseHeaders: HTMLTextAreaElement;
            responseURI: HTMLTextAreaElement;
        };
        request: (event:MouseEvent) => void;
        response: (data:services_http_test) => void;
    }

    interface module_message {
        receiver: (event:websocket_event) => void;
        send: (data:type_socket_data, service:type_service) => void;
    }

    interface module_port {
        external: (input:external_ports) => void;
        html: (table:HTMLElement, list:type_external_port[]) => void;
        init: (port_list:external_ports) => void;
        internal: () => void;
        nodes: {
            external: HTMLElement;
            internal: HTMLElement;
        };
    }

    interface module_os {
        init: () => void;
        interfaces: (data:NodeJS.Dict<node_os_NetworkInterfaceInfo[]>) => void;
        service: (data:services_os) => void;
    }

    interface module_server {
        activePorts: (name_server:string) => HTMLElement;
        create: (event:MouseEvent) => void;
        list: () => void;
        message: (event:MouseEvent) => void;
        nodes: {
            list: HTMLElement;
            server_new: HTMLButtonElement;
        };
        socket_add: (config:services_socket) => void;
        validate: (event:FocusEvent|KeyboardEvent) => void;
    }

    interface module_serviceItems {
        cancel: (event:MouseEvent) => void;
        color: (name_server:string, type:type_dashboard_list) => type_activation_status;
        details: (event:MouseEvent) => void;
        edit: (event:MouseEvent) => void;
        title: (name_server:string, type:type_dashboard_list) => HTMLElement;
    }

    interface module_terminal {
        events: {
            data: (event:websocket_event) => void;
            firstData: (event:websocket_event) => void;
            input: (input:terminal_input) => void;
            selection: () => void;
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