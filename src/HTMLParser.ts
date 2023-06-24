import Parser from './Parser'

export enum NodeType {
    Element = 1,
    Text = 3,
}

export interface Element {
    tagName: string
    attributes: Record<string, string>
    children: Node[]
    nodeType: NodeType.Element
}

interface Text {
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

export default class HTMLParser extends Parser {
    private stack: string[] = []

    parse(rawText: string) {
        if (typeof rawText !== 'string') {
            throw Error('parameter 0 must be a string')
        }

        this.rawText = rawText.trim()
        this.len = this.rawText.length
        this.index = 0
        this.stack = []

        const root = element('root')
        while (this.index < this.len) {
            this.removeSpaces()
            if (this.rawText[this.index].startsWith('<')) {
                this.index++
                this.parseElement(root)
            } else {
                this.parseText(root)
            }
        }

        if (root.children.length === 1) return root.children[0]
        return root.children
    }

    private parseElement(parent: Element) {
        const tag = this.parseTag()
        const ele = element(tag)

        this.stack.push(tag)

        parent.children.push(ele)
        this.parseAttrs(ele)

        while (this.index < this.len) {
            this.removeSpaces()
            if (this.rawText[this.index].startsWith('<')) {
                this.index++
                this.removeSpaces()
                if (this.rawText[this.index].startsWith('/')) {
                    this.index++
                    const startTag = this.stack[this.stack.length - 1]
                    const endTag = this.parseTag()
                    if (startTag !== endTag) {
                        throw Error(`The end tagName ${endTag} does not match start tagName ${startTag}`)
                    }

                    this.stack.pop()
                    while (this.index < this.len && this.rawText[this.index] !== '>') {
                        this.index++
                    }

                    break
                } else {
                    this.parseElement(ele)
                }
            } else {
                this.parseText(ele)
            }
        }

        this.index++
    }

    private parseTag() {
        let tag = ''

        this.removeSpaces()

        // get tag name
        while (this.index < this.len && this.rawText[this.index] !== ' ' && this.rawText[this.index] !== '>') {
            tag += this.rawText[this.index]
            this.index++
        }

        this.sliceText()
        return tag
    }

    private parseText(parent: Element) {
        let str = ''
        while (
            this.index < this.len
            && !(this.rawText[this.index] === '<' && /\w|\//.test(this.rawText[this.index + 1]))
        ) {
            str += this.rawText[this.index]
            this.index++
        }

        this.sliceText()
        parent.children.push(text(removeExtraSpaces(str)))
    }

    private parseAttrs(ele: Element) {
        while (this.index < this.len && this.rawText[this.index] !== '>') {
            this.removeSpaces()
            this.parseAttr(ele)
            this.removeSpaces()
        }

        this.index++
    }

    private parseAttr(ele: Element) {
        let attr = ''
        let value = ''
        while (this.index < this.len && this.rawText[this.index] !== '=' && this.rawText[this.index] !== '>') {
            attr += this.rawText[this.index++]
        }

        this.sliceText()
        attr = attr.trim()
        if (!attr.trim()) return

        this.index++
        let startSymbol = ''
        if (this.rawText[this.index] === "'" || this.rawText[this.index] === '"') {
            startSymbol = this.rawText[this.index++]
        }

        while (this.index < this.len && this.rawText[this.index] !== startSymbol) {
            value += this.rawText[this.index++]
        }

        this.index++
        ele.attributes[attr] = value.trim()
        this.sliceText()
    }
}

// a  b  c => a b c 删除字符之间多余的空格，只保留一个
function removeExtraSpaces(str: string) {
    let index = 0
    let len = str.length
    let hasSpace = false
    let result = ''
    while (index < len) {
        if (str[index] === ' ' || str[index] === '\n') {
            if (!hasSpace) {
                hasSpace = true
                result += ' '
            }
        } else {
            result += str[index]
            hasSpace = false
        }

        index++
    }

    return result
}
