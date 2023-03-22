import CSSParser from '../src/CSSParser'

describe('CSSParser test', () => {
    const classTemplate = `[
    {
        "selectors": [
            {
                "id": "",
                "class": "class-div",
                "tagName": ""
            },
            {
                "id": "",
                "class": "class-div2",
                "tagName": ""
            }
        ],
        "declarations": [
            {
                "name": "font-size",
                "value": "14px"
            }
        ]
    }
]`
    
    const classTemplate2 = `[
    {
        "selectors": [
            {
                "id": "",
                "class": "",
                "tagName": "div"
            },
            {
                "id": "",
                "class": "",
                "tagName": "*"
            },
            {
                "id": "",
                "class": "class-div",
                "tagName": ""
            },
            {
                "id": "id-div",
                "class": "",
                "tagName": ""
            }
        ],
        "declarations": [
            {
                "name": "font-size",
                "value": "14px"
            },
            {
                "name": "position",
                "value": "relative"
            },
            {
                "name": "width",
                "value": "100%"
            },
            {
                "name": "height",
                "value": "100%"
            },
            {
                "name": "background",
                "value": "rgba(0, 0, 0, 1)"
            },
            {
                "name": "margin-bottom",
                "value": "20px"
            }
        ]
    },
    {
        "selectors": [
            {
                "id": "",
                "class": "",
                "tagName": "body"
            }
        ],
        "declarations": [
            {
                "name": "font-size",
                "value": "88px"
            },
            {
                "name": "color",
                "value": "#000"
            }
        ]
    }
]`

    test('parse css class', () => {
        const parser = new CSSParser()
        const parseResult = JSON.stringify(parser.parse(`
            .class-div,
            .class-div2 {
                font-size: 14px;
            }
        `), null, 4)

        expect(classTemplate).toBe(parseResult)
    })

    test('parse css all', () => {
        const parser = new CSSParser()

        const parseResult = JSON.stringify(parser.parse(`
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

                body {
                    font-size: 88px;
                    color: #000;
                }
            `), null, 4)

        expect(classTemplate2).toBe(parseResult)
    })
})
