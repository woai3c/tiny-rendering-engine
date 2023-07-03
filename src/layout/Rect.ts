import type { EdgeSizes } from './type'

export default class Rect {
    x: number
    y: number
    width: number
    height: number

    constructor() {
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
    }

    expandedBy(edge: EdgeSizes) {
        const rect = new Rect()
        rect.x = this.x - edge.left
        rect.y = this.y - edge.top
        rect.width = this.width + edge.left + edge.right
        rect.height = this.height + edge.top + edge.bottom

        return rect
    }
}
