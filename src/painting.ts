import type LayoutBox from './layout/LayoutBox'
import { createWriteStream } from 'fs'
import type { Canvas, CanvasRenderingContext2D } from 'canvas'
import { NodeType } from './HTMLParser'

// 用 import 会报错
const { createCanvas } = require('canvas')

export default function painting(layoutBox: LayoutBox, outputPath = '') {
    const { x, y, width, height } = layoutBox.dimensions.content
    const canvas = createCanvas(width, height) as Canvas
    const ctx = canvas.getContext('2d')
    console.log(x, y, width, height)
    // 设置默认背景色
    ctx.fillStyle = '#fff'
    ctx.fillRect(x, y, width, height)

    renderLayoutBox(layoutBox, ctx)
    createPNG(canvas, outputPath)
}

function renderLayoutBox(layoutBox: LayoutBox, ctx: CanvasRenderingContext2D, parent?: LayoutBox) {
    renderBackground(layoutBox, ctx)
    renderBorder(layoutBox, ctx)
    renderText(layoutBox, ctx, parent)
    for (const child of layoutBox.children) {
        renderLayoutBox(child, ctx, layoutBox)
    }
}

function renderBackground(layoutBox: LayoutBox, ctx: CanvasRenderingContext2D) {
    const { width, height, x, y } = layoutBox.dimensions.borderBox()
    ctx.fillStyle = getStyleValue(layoutBox, 'background')
    ctx.fillRect(x, y, width, height)
}

function renderBorder(layoutBox: LayoutBox, ctx: CanvasRenderingContext2D) {
    const { width, height, x, y } = layoutBox.dimensions.borderBox()
    const { left, top, right, bottom } = layoutBox.dimensions.border
    const borderColor = getStyleValue(layoutBox, 'border-color')
    if (!borderColor) return

    ctx.fillStyle = borderColor

    // left
    ctx.fillRect(x, y, left, height)
    // top
    ctx.fillRect(x, y, width, top)
    // right
    ctx.fillRect(x + width - right, y, right, height)
    // bottom
    ctx.fillRect(x, y + height - bottom, width, bottom)
}

function renderText(layoutBox: LayoutBox, ctx: CanvasRenderingContext2D, parent?: LayoutBox) {
    if (layoutBox.styleNode?.node.nodeType === NodeType.Text) {
        // get AnonymousBlock x y
        const { x = 0, y = 0, width } = parent?.dimensions.content || {}
        const styles = layoutBox.styleNode?.values || {}
        const fontSize = styles['font-size'] || '14px'
        const fontFamily = styles['font-family'] || 'serif'
        const fontWeight = styles['font-weight'] || 'normal'
        const fontStyle = styles['font-style'] || 'normal'

        ctx.fillStyle = styles.color
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`
        ctx.fillText(layoutBox.styleNode?.node.nodeValue, x, y + parseInt(fontSize), width)
    }
}

function getStyleValue(layoutBox: LayoutBox, key: string) {
    return layoutBox.styleNode?.values[key] ?? ''
}

function createPNG(canvas: Canvas, outputPath: string) {
    canvas.createPNGStream().pipe(createWriteStream(outputPath))
}
