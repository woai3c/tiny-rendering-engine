export enum NodeType {
    Element = 1,
    Text = 3
}

export interface Element {
    tagName: string
    attributes: Record<string, string>
    children: Node[]
    nodeType: NodeType.Element
}

export interface Text {
    nodeValue: string
    nodeType: NodeType.Text
}

export type Node = Element | Text

export function element(tagName: string) {
    return {
        tagName,
        attributes: {},
        children: [],
        nodeType: NodeType.Element,
    } as Element
}

export function text(data: string) {
    return {
        nodeValue: data,
        nodeType: NodeType.Text,
    } as Text
}