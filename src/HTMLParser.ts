import type { Element } from './dom'
import { text, element } from './dom'

export default class Parser {
    private html = ''
    private index = 0
    private len = 0
    private stack: string[] = []

    parse(html: string) {
        if (typeof html !== 'string') {
            throw Error('parameter 0 must be a string')
        }

        this.html = html.trim()
        this.len = this.html.length
        this.index = 0
        this.stack = []

        const root = element('root')
        while (this.index < this.len) {
            this.removeSpaces()
            if (this.html[this.index].startsWith('<')) {
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
            if (this.html[this.index].startsWith('<')) {
                this.index++
                this.removeSpaces()
                if (this.html[this.index].startsWith('/')) {
                    this.index++
                    const startTag = this.stack[this.stack.length - 1]
                    const endTag = this.parseTag()
                    if (startTag !== endTag) {
                        throw Error(`The end tagName ${endTag} does not match start tagName ${startTag}`)
                    }

                    this.stack.pop()
                    while (this.index < this.len && this.html[this.index] !== '>') {
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
        while (this.index < this.len && this.html[this.index] !== ' ' && this.html[this.index] !== '>') {
            tag += this.html[this.index]
            this.index++
        }

        this.sliceHTML()
        return tag
    }

    private parseText(parent: Element) {
        let str = ''
        while (this.index < this.len && !(this.html[this.index] === '<' && /\w|\//.test(this.html[this.index + 1]))) {
            str += this.html[this.index]
            this.index++
        }

        this.sliceHTML()
        parent.children.push(text(removeExtraSpaces(str)))
    }

    private parseAttrs(ele: Element) {
        while (this.index < this.len && this.html[this.index] !== '>') {
            this.removeSpaces()
            this.parseAttr(ele)
            this.removeSpaces()
        }

        this.index++
    }

    private parseAttr(ele: Element) {
        let attr = ''
        let value = ''
        while (this.index < this.len && this.html[this.index] !== '=' && this.html[this.index] !== '>') {
            attr += this.html[this.index++]
        }

        this.sliceHTML()
        attr = attr.trim()
        if (!attr.trim()) return

        this.index++
        let startSymbol = ''
        if (this.html[this.index] === '\'' || this.html[this.index] === '"') {
            startSymbol = this.html[this.index++]
        }

        while (this.index < this.len && this.html[this.index] !== startSymbol) {
            value += this.html[this.index++]
        }

        this.index++
        ele.attributes[attr] = value.trim()
        this.sliceHTML()
    }

    private removeSpaces() {
        while (this.index < this.len && this.html[this.index] === ' ' && this.html[this.index] === '\n') {
            this.index++
        }

        this.sliceHTML()
    }

    private sliceHTML() {
        this.html = this.html.slice(this.index)
        this.len = this.html.length
        this.index = 0
    }
}

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