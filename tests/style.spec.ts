import { getStyleTree } from '../src/style'
import CSSParser from '../src/CSSParser'
import HTMLParser from '../src/HTMLParser'

describe('style tree test', () => {
    test('parse html template', () => {
        const styleTemplate = `{
    "node": {
        "tagName": "html",
        "attributes": {},
        "children": [
            {
                "tagName": "body",
                "attributes": {
                    "id": "body",
                    "data-index": "1",
                    "style": "color: red; background: yellow;"
                },
                "children": [
                    {
                        "tagName": "div",
                        "attributes": {
                            "class": "lightblue test"
                        },
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
    },
    "values": {
        "display": "block"
    },
    "children": [
        {
            "node": {
                "tagName": "body",
                "attributes": {
                    "id": "body",
                    "data-index": "1",
                    "style": "color: red; background: yellow;"
                },
                "children": [
                    {
                        "tagName": "div",
                        "attributes": {
                            "class": "lightblue test"
                        },
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
            },
            "values": {
                "display": "block",
                "font-size": "88px",
                "color": "red",
                "background": "yellow"
            },
            "children": [
                {
                    "node": {
                        "tagName": "div",
                        "attributes": {
                            "class": "lightblue test"
                        },
                        "children": [
                            {
                                "nodeValue": "test!",
                                "nodeType": 3
                            }
                        ],
                        "nodeType": 1
                    },
                    "values": {
                        "font-size": "16px",
                        "color": "#000",
                        "display": "block",
                        "position": "relative",
                        "width": "100%",
                        "height": "100%",
                        "background": "rgba(0, 0, 0, 1)",
                        "margin-bottom": "20px"
                    },
                    "children": [
                        {
                            "node": {
                                "nodeValue": "test!",
                                "nodeType": 3
                            },
                            "values": {
                                "font-size": "16px",
                                "color": "#000"
                            },
                            "children": []
                        }
                    ]
                }
            ]
        }
    ]
}`

        const htmlParser = new HTMLParser()
        const cssParser = new CSSParser()

        const domTree = htmlParser.parse(`
            <html>
                <body id=" body " data-index="1" style="color: red; background: yellow;">
                    <div class="lightblue test">test!</div>
                </body>
            </html>
        `)

        const cssRules = cssParser.parse(`
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

        const parseResult = JSON.stringify(getStyleTree(domTree, cssRules), null, 4)

        expect(styleTemplate).toBe(parseResult)
    })
})
