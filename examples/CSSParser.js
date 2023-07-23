const { CSSParser } = require('../dist/render-engine.js')

function parse(css) {
    const parser = new CSSParser()
    return JSON.stringify(parser.parse(css), null, 4)
}

console.log(
    parse(`
    div,
    *,
    .class-div,
    #id-div {
        font-size: 14px;
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        margin-bottom: 20px;
    }

    div {
        font-size: 16px;
    }

    body {
        font-size: 88px;
        color: #000;
    }
`)
)

console.log(
    parse(`
    .class-div,
    .class-div2 {
        font-size: 14px;
    }
`)
)
