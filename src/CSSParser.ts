import type { Declaration, Rule, Selector } from './css'
import Parser from './Parser'

// TODO: 待完成
export default class CSSParser extends Parser {
    private identifierRE = /\w|-|_/

    parse(rawText: string) {
        if (typeof rawText !== 'string') {
            throw Error('parameter 0 must be a string')
        }

        this.rawText = rawText.trim()
        this.len = this.rawText.length
        this.index = 0
        console.log(12)
        return this.parseRules()
    }

    private parseRules() {
        const rules: Rule[] = []
        while (this.index < this.len) {
            this.removeSpaces()
            rules.push(this.parseRule())
            this.index++
        }

        return rules
    }

    private parseRule() {
        const rule: Rule = {
            selectors: [],
            declarations: [],
        }

        rule.selectors = this.parseSelectors()
        rule.declarations = this.parseDeclarations()

        return rule
    }

    private parseSelectors() {
        const selectors: Selector[] = []
        while (this.index < this.len) {
            this.removeSpaces()
            const char = this.rawText[this.index]
            if (this.identifierRE.test(char) || char === '*') {
                selectors.push(this.parseSelector())
            } else if (char === ',') {
                this.removeSpaces()
                selectors.push(this.parseSelector())
            } else if (char === '{') {
                break
            }

            this.index++
        }

        return selectors
    }

    private parseSelector() {
        const selector: Selector = {
            id: '',
            class: [],
            tagName: '',
        }

        while (this.index < this.len) {
            this.removeSpaces()
            switch (this.rawText[this.index]) {
                case '.':
                    selector.class.push(this.parseIdentifier()) 
                    break
                case '#':
                    selector.id = this.parseIdentifier()
                    break
                case '*':
                    break
                default:
                    selector.tagName = this.parseIdentifier()
            }

            this.index++
        }

        return selector
    }

    private parseDeclarations() {
        const declarations: Declaration[] = []
        while (this.index < this.len && this.rawText[this.index] !== '}') {
            this.removeSpaces()
            declarations.push(this.parseDeclaration())
            this.index++
        }

        return declarations
    }

    private parseDeclaration() {
        const declaration: Declaration = { name: '', value: '' }
        while (this.index < this.len && this.rawText[this.index] !== '}') {
            this.removeSpaces()
            declaration.name = this.parseIdentifier()
            this.removeSpaces()

            while (this.index < this.len && this.rawText[this.index] !== ':') {
                this.index++
            }

            this.removeSpaces()
            declaration.value = this.parseValue()
            this.index++
        }

        return declaration
    }

    private parseIdentifier() {
        let result = ''
        while (this.index < this.len && this.identifierRE.test(this.rawText[this.index])) {
            result += this.rawText[this.index++]
        }

        this.sliceText()
        return result
    }

    private parseValue() {
        let result = ''
        while (this.index < this.len && this.rawText[this.index] !== ';') {
            result += this.rawText[this.index++]
        }

        return result.trim()
    }
}