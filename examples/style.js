const { HTMLParser, CSSParser, getStyleTree } = require('../dist/render-engine.js')

function parseHTML(html) {
    const parser = new HTMLParser()
    return parser.parse(html)
}

function parseCSS(css) {
    const parser = new CSSParser()
    return parser.parse(css)
}

const domTree = parseHTML(`
    <html>
        <body id=" body " data-index="1" style="color: red; background: yellow;">
            <div class="lightblue test">test!</div>
        </body>
    </html>
`)

const cssRules = parseCSS(`
    * {
        display: block;
    }
    
    div {
        font-size: 14px;
        position: relative;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        margin-bottom: 20px;
    }

    .lightblue {
        font-size: 16px;
    }

    body {
        font-size: 88px;
        color: #000;
    }
`)

console.log(JSON.stringify(getStyleTree(domTree, cssRules), null, 4))
