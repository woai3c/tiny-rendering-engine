const { HTMLParser } = require('../dist/render-engine.js')

function parse(html) {
    const parser = new HTMLParser()
    return JSON.stringify(parser.parse(html), null, 4)
}

console.log(parse('<html><body><div>test!</div></body></html>'))
console.log(
    parse(`
    <html>
        <body id=" body " data-index="1" style="color: red; background: yellow;">
            <div class="lightblue test">test!</div>
        </body>
    </html>
`)
)
console.log(
    parse(`
    <div class="lightblue test" id=" div " data-index="1">test!</div>
`)
)
