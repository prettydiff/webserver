
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
    getAncestor: (identifier:string, selector:selector_type) => HTMLElement;
    getElementsByAttribute: (name:string, value:string) => HTMLElement[];
    getElementsByText: (textValue:string, caseSensitive?:boolean) => HTMLElement[];
    getNodesByType: (typeValue:number | string) => Node[];
    highlight: () => void;
    lowName: () => string;
    parentNode: HTMLElement;
    removeClass: (className:string) => void;
    removeHighlight: () => void;
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