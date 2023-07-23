const { HTMLParser, CSSParser, getLayoutTree, getStyleTree, Dimensions, painting } = require('../dist/render-engine.js')
const { join } = require('path')

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
                    <div>
                        <div class="lightblue test">test1!</div>
                        <div class="lightblue test">
                            <div class="foo">foo</div>
                        </div>
                    </div>
                </body>
            </html>
        `)

const cssRules = parseCSS(`
            * {
                display: block;
            }
            
            div {
                font-size: 14px;
                width: 400px;
                background: #fff;
                margin-bottom: 20px;
                display: block;
                background: lightblue;
            }

            .lightblue {
                font-size: 16px;
                display: block;
                width: 200px;
                height: 200px;
                background: blue;
                border-color: green;
                border: 10px;
            }

            .foo {
                width: 100px;
                height: 100px;
                background: red;
                color: yellow;
                margin-left: 50px;
            }

            body {
                display: block;
                font-size: 88px;
                color: #000;
            }
        `)

const dimensions = new Dimensions()
dimensions.content.width = 1000
dimensions.content.height = 800
painting(getLayoutTree(getStyleTree(domTree, cssRules), dimensions), join(__dirname, './example.png'))
