export default class Parser {
    protected rawText = ''
    protected index = 0
    protected len = 0

    protected removeSpaces() {
        while (this.index < this.len && (this.rawText[this.index] === ' ' || this.rawText[this.index] === '\n')) {
            this.index++
        }

        this.sliceText()
    }

    protected sliceText() {
        this.rawText = this.rawText.slice(this.index)
        this.len = this.rawText.length
        this.index = 0
    }
}