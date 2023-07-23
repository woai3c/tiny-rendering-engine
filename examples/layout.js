const { HTMLParser, CSSParser, getLayoutTree, getStyleTree, Dimensions } = require('../dist/render-engine.js')

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
                width: 400px;
                height: 400px;
                background: rgba(0, 0, 0, 1);
                margin-bottom: 20px;
                display: block;
            }

            .lightblue {
                font-size: 16px;
                display: block;
            }

            body {
                display: block;
                font-size: 88px;
                color: #000;
            }
        `)

const dimensions = new Dimensions()
dimensions.content.width = 800
dimensions.content.height = 600
console.log(JSON.stringify(getLayoutTree(getStyleTree(domTree, cssRules), dimensions), null, 4))
