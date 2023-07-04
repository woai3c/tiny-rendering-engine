import type { StyleNode } from '../style'
import { Display, getDisplayValue } from '../style'
import Dimensions from './Dimensions'
import LayoutBox from './LayoutBox'

export { Dimensions }

export function getLayoutTree(styleNode: StyleNode, parentBlock: Dimensions) {
    parentBlock.content.height = 0
    const root = buildLayoutTree(styleNode)
    root.layout(parentBlock)
    return root
}

function buildLayoutTree(styleNode: StyleNode) {
    if (getDisplayValue(styleNode) === Display.None) {
        throw new Error('Root node has display: none.')
    }

    const layoutBox = new LayoutBox(styleNode)

    let anonymousBlock: LayoutBox | undefined
    for (const child of styleNode.children) {
        const childDisplay = getDisplayValue(child)
        if (childDisplay === Display.None) continue

        if (childDisplay === Display.Block) {
            anonymousBlock = undefined
            layoutBox.children.push(buildLayoutTree(child))
        } else {
            if (!anonymousBlock) {
                anonymousBlock = new LayoutBox()
                layoutBox.children.push(anonymousBlock)
            }

            anonymousBlock.children.push(buildLayoutTree(child))
        }
    }

    return layoutBox
}
