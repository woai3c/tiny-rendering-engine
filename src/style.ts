import type { Declaration, Rule, Selector } from './CSSParser'
import type { Node, Element } from './HTMLParser'
import { NodeType } from './HTMLParser'

interface StyleNode {
    node: Node // DOM 节点
    values: AnyObject // style 属性值
    children: StyleNode[]
}

// 子元素可继承的属性，这里只写了两个，实际上还有很多
const inheritableAttrs = ['color', 'font-size']
export function getStyleTree(eles: Node | Node[], cssRules: Rule[], parent?: StyleNode) {
    if (Array.isArray(eles)) {
        return eles.map(ele => getStyleNode(ele, cssRules, parent))
    }

    return getStyleNode(eles, cssRules, parent)
}

function getStyleNode(ele: Node, cssRules: Rule[], parent?: StyleNode) {
    const styleNode: StyleNode = {
        node: ele,
        values: getStyleValues(ele, cssRules, parent),
        children: [],
    }

    if (ele.nodeType === NodeType.Element) {
        styleNode.children = ele.children.map(e => getStyleNode(e, cssRules, styleNode)) as unknown as StyleNode[]
        // 合并内联样式
        if (ele.attributes.style) {
            styleNode.values = { ...styleNode.values, ...getInlineStyle(ele.attributes.style) }
        }
    }
    
    return styleNode
}

function getStyleValues(ele: Node, cssRules: Rule[], parent?: StyleNode) {
    const inheritableAttrValue = getInheritableAttrValues(parent)

    // 文本节点继承父元素的可继承属性
    if (ele.nodeType === NodeType.Text) return inheritableAttrValue
    
    return cssRules.reduce((result: AnyObject, rule) => {
        if (isMatch(ele as Element, rule.selectors)) {
            result = { ...result, ...cssValueArrToObject(rule.declarations) }
        }

        return result
    }, inheritableAttrValue)
}

/**
 * 获取父元素可继承的属性值
 */
function getInheritableAttrValues(parent?: StyleNode) {
    if (!parent) return {}
    const keys = Object.keys(parent.values)
    return keys.reduce((result: AnyObject, key) => {
        if (inheritableAttrs.includes(key)) {
            result[key] = parent.values[key]
        }

        return result
    }, {})
}

/**
 * css 选择器是否匹配元素
 */
function isMatch(ele: Element, selectors: Selector[]) {
    return selectors.some(selector => {
        if (selector.tagName === ele.tagName) return true
        if (ele.attributes.id === selector.id) return true

        if (ele.attributes.class) {
            const classes = ele.attributes.class.split(' ').filter(Boolean)
            const classes2 = selector.class.split(' ').filter(Boolean)
            for (const name of classes) {
                if (classes2.includes(name)) return true
            }
        }

        return false
    })
}

function cssValueArrToObject(declarations: Declaration[]) {
    return declarations.reduce((result: AnyObject, declaration: Declaration) => {
        result[declaration.name] = declaration.value
        return result
    }, {})
}

function getInlineStyle(str: string) {
    str = str.trim()
    if (!str) return {}
    const arr = str.split(';')
    if (!arr.length) return {}

    return arr.reduce((result: AnyObject, item: string) => {
        const data = item.split(':')
        if (data.length === 2) {
            result[data[0].trim()] = data[1].trim()
        }

        return result
    }, {})
}