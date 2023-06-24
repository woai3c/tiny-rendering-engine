import type Rect from './Rect'
import type { EdgeSizes } from './type'

export default class Dimensions {
    content: Rect
    padding: EdgeSizes
    border: EdgeSizes
    margin: EdgeSizes

    constructor() {
        const initValue = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }

        this.content = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        } as Rect

        this.padding = { ...initValue }
        this.border = { ...initValue }
        this.margin = { ...initValue }
    }

    paddingBox() {
        return this.content.expandedBy(this.padding)
    }

    borderBox() {
        return this.paddingBox().expandedBy(this.border)
    }

    marginBox() {
        return this.borderBox().expandedBy(this.margin)
    }
}
