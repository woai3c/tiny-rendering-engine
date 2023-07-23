import type { StyleNode } from '../style'
import { getDisplayValue, Display } from '../style'
import Dimensions from './Dimensions'
import { BoxType } from './type'

export default class LayoutBox {
    dimensions: Dimensions
    boxType: BoxType
    children: LayoutBox[]
    styleNode: StyleNode | undefined

    constructor(styleNode?: StyleNode) {
        this.boxType = getBoxType(styleNode)
        this.dimensions = new Dimensions()
        this.children = []
        this.styleNode = styleNode
    }

    layout(parentBlock: Dimensions) {
        if (this.boxType !== BoxType.InlineNode) {
            this.calculateBlockWidth(parentBlock)
            this.calculateBlockPosition(parentBlock)
            this.layoutBlockChildren()
            this.calculateBlockHeight()
        }
    }

    calculateBlockWidth(parentBlock: Dimensions) {
        // 初始值
        const styleValues = this.styleNode?.values || {}
        const parentWidth = parentBlock.content.width

        // 初始值为 auto
        let width = styleValues.width ?? 'auto'
        let marginLeft = styleValues['margin-left'] || styleValues.margin || 0
        let marginRight = styleValues['margin-right'] || styleValues.margin || 0

        let borderLeft = styleValues['border-left'] || styleValues.border || 0
        let borderRight = styleValues['border-right'] || styleValues.border || 0

        let paddingLeft = styleValues['padding-left'] || styleValues.padding || 0
        let paddingRight = styleValues['padding-right'] || styleValues.padding || 0

        let totalWidth = sum(width, marginLeft, marginRight, borderLeft, borderRight, paddingLeft, paddingRight)

        const isWidthAuto = width === 'auto'
        const isMarginLeftAuto = marginLeft === 'auto'
        const isMarginRightAuto = marginRight === 'auto'

        // 当前块的宽度如果超过了父元素宽度
        if (!isWidthAuto && totalWidth > parentWidth) {
            if (isMarginLeftAuto) {
                marginLeft = 0
            }

            if (isMarginRightAuto) {
                marginRight = 0
            }
        }

        // 根据父子元素宽度的差值，去调整当前元素的宽度
        const underflow = parentWidth - totalWidth

        // 如果三者都有值，则将差值填充到 marginRight
        if (!isWidthAuto && !isMarginLeftAuto && !isMarginRightAuto) {
            marginRight += underflow
        } else if (!isWidthAuto && !isMarginLeftAuto && isMarginRightAuto) {
            marginRight = underflow
        } else if (!isWidthAuto && isMarginLeftAuto && !isMarginRightAuto) {
            marginLeft = underflow
        } else if (isWidthAuto) {
            // 如果只有 width 是 auto，则将另外两个值设为 0
            if (isMarginLeftAuto) {
                marginLeft = 0
            }

            if (isMarginRightAuto) {
                marginRight = 0
            }

            if (underflow >= 0) {
                // 展开宽度，填充剩余空间，原来的宽度是 auto，作为 0 来计算的
                width = underflow
            } else {
                // 宽度不能为负数，所以需要调整 marginRight 来代替
                width = 0
                marginRight += underflow
            }
        } else if (!isWidthAuto && isMarginLeftAuto && isMarginRightAuto) {
            // 如果只有 marginLeft 和 marginRight 是 auto，则将两者设为 underflow 的一半
            marginLeft = underflow / 2
            marginRight = underflow / 2
        }

        const dimensions = this.dimensions
        dimensions.content.width = parseInt(width)

        dimensions.margin.left = parseInt(marginLeft)
        dimensions.margin.right = parseInt(marginRight)

        dimensions.border.left = parseInt(borderLeft)
        dimensions.border.right = parseInt(borderRight)

        dimensions.padding.left = parseInt(paddingLeft)
        dimensions.padding.right = parseInt(paddingRight)
    }

    calculateBlockPosition(parentBlock: Dimensions) {
        const styleValues = this.styleNode?.values || {}
        const { x, y, height } = parentBlock.content
        const dimensions = this.dimensions

        dimensions.margin.top = transformValueSafe(styleValues['margin-top'] || styleValues.margin || 0)
        dimensions.margin.bottom = transformValueSafe(styleValues['margin-bottom'] || styleValues.margin || 0)

        dimensions.border.top = transformValueSafe(styleValues['border-top'] || styleValues.border || 0)
        dimensions.border.bottom = transformValueSafe(styleValues['border-bottom'] || styleValues.border || 0)

        dimensions.padding.top = transformValueSafe(styleValues['padding-top'] || styleValues.padding || 0)
        dimensions.padding.bottom = transformValueSafe(styleValues['padding-bottom'] || styleValues.padding || 0)

        dimensions.content.x = x + dimensions.margin.left + dimensions.border.left + dimensions.padding.left
        dimensions.content.y = y + height + dimensions.margin.top + dimensions.border.top + dimensions.padding.top
    }

    layoutBlockChildren() {
        const { dimensions } = this
        for (const child of this.children) {
            child.layout(dimensions)
            dimensions.content.height += child.dimensions.marginBox().height
        }
    }

    calculateBlockHeight() {
        // 如果元素设置了 height，则使用 height，否则使用 layoutBlockChildren() 计算出来的高度
        const height = this.styleNode?.values.height
        if (height) {
            this.dimensions.content.height = parseInt(height)
        }
    }
}

function sum(...args: (string | number)[]) {
    return args.reduce((prev: number, cur: string | number) => {
        if (cur === 'auto') {
            return prev
        }

        return prev + parseInt(String(cur))
    }, 0) as number
}

function transformValueSafe(val: number | string) {
    if (val === 'auto') return 0
    return parseInt(String(val))
}

function getBoxType(styleNode?: StyleNode) {
    if (!styleNode) return BoxType.AnonymousBlock

    const display = getDisplayValue(styleNode)

    if (display === Display.Block) return BoxType.BlockNode
    return BoxType.InlineNode
}
