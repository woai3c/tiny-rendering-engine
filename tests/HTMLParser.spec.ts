import HTMLParser, { element, text } from '../src/HTMLParser'

describe('HTMLParser test', () => {
    const htmlTemplate = `{
    "tagName": "html",
    "attributes": {},
    "children": [
        {
            "tagName": "body",
            "attributes": {},
            "children": [
                {
                    "tagName": "div",
                    "attributes": {},
                    "children": [
                        {
                            "nodeValue": "test!",
                            "nodeType": 3
                        }
                    ],
                    "nodeType": 1
                }
            ],
            "nodeType": 1
        }
    ],
    "nodeType": 1
}`
    
    const htmlTemplate2 = `{
    "tagName": "html",
    "attributes": {},
    "children": [
        {
            "tagName": "body",
            "attributes": {},
            "children": [
                {
                    "tagName": "div",
                    "attributes": {},
                    "children": [
                        {
                            "nodeValue": "test test!",
                            "nodeType": 3
                        }
                    ],
                    "nodeType": 1
                }
            ],
            "nodeType": 1
        }
    ],
    "nodeType": 1
}`
    
    test('parse html template', () => {
        const parser = new HTMLParser()
        const parseResult = JSON.stringify(parser.parse('<html><body><div>test!</div></body></html>'), null, 4)
        const parseResult2 = JSON.stringify(parser.parse(`
            <html>
                <body >
                    <div>test    test!</div>
                </body>
            </html>
        `), null, 4)

        expect(htmlTemplate).toBe(parseResult)
        expect(htmlTemplate2).toBe(parseResult2)
    })

    test('parse html object', () => {
        const html = element('html')
        const body = element('body')
        const div = element('div')

        html.children.push(body)
        body.children.push(div)
        div.children.push(text('test!'))

        expect(htmlTemplate).toBe(JSON.stringify(html, null, 4))
    })

    const htmlTemplate3 = `{
    "tagName": "div",
    "attributes": {
        "class": "lightblue test",
        "id": "div",
        "data-index": "1"
    },
    "children": [
        {
            "nodeValue": "test!",
            "nodeType": 3
        }
    ],
    "nodeType": 1
}`

    test('parse html attributes', () => {
        const parser = new HTMLParser()
        const parseResult = JSON.stringify(
            parser.parse('<div class="lightblue test" id=" div " data-index="1">test!</div>'), 
            null, 
            4,
        )

        expect(htmlTemplate3).toBe(parseResult)
    })
})
