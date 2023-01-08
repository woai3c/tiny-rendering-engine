export interface Rule {
    selectors: Selector[]
    declarations: Declaration[]
}

export interface Selector {
    tagName: string
    id: string
    class: string[]
}

export interface Declaration {
    name: string
    value: string | number
}