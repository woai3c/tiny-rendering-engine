import { StyleNode, getStyleTree } from '../src/style'
import CSSParser from '../src/CSSParser'
import HTMLParser from '../src/HTMLParser'
import { layoutTree, Dimensions } from '../src/layout'

describe('style tree test', () => {
    test('parse html template', () => {
        // eslint-disable-next-line quotes
        const layoutTemplate = `{"dimensions":{"content":{"x":0,"y":0,"width":800,"height":420},"padding":{"top":0,"right":0,"bottom":0,"left":0},"border":{"top":0,"right":0,"bottom":0,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}},"boxType":"BlockNode","children":[{"dimensions":{"content":{"x":0,"y":0,"width":800,"height":420},"padding":{"top":0,"right":0,"bottom":0,"left":0},"border":{"top":0,"right":0,"bottom":0,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}},"boxType":"BlockNode","children":[{"dimensions":{"content":{"x":0,"y":0,"width":400,"height":400},"padding":{"top":0,"right":0,"bottom":0,"left":0},"border":{"top":0,"right":0,"bottom":0,"left":0},"margin":{"top":0,"right":400,"bottom":20,"left":0}},"boxType":"BlockNode","children":[{"dimensions":{"content":{"x":0,"y":0,"width":0,"height":0},"padding":{"top":0,"right":0,"bottom":0,"left":0},"border":{"top":0,"right":0,"bottom":0,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}},"boxType":"AnonymousBlock","children":[{"dimensions":{"content":{"x":0,"y":0,"width":0,"height":0},"padding":{"top":0,"right":0,"bottom":0,"left":0},"border":{"top":0,"right":0,"bottom":0,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}},"boxType":"InlineNode","children":[],"styleNode":{"node":{"nodeValue":"test!","nodeType":3},"values":{"font-size":"16px","color":"#000"},"children":[]}}]}],"styleNode":{"node":{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1},"values":{"font-size":"16px","color":"#000","display":"block","position":"relative","width":"400px","height":"400px","background":"rgba(0, 0, 0, 1)","margin-bottom":"20px"},"children":[{"node":{"nodeValue":"test!","nodeType":3},"values":{"font-size":"16px","color":"#000"},"children":[]}]}}],"styleNode":{"node":{"tagName":"body","attributes":{"id":"body","data-index":"1","style":"color: red; background: yellow;"},"children":[{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1}],"nodeType":1},"values":{"display":"block","font-size":"88px","color":"red","background":"yellow"},"children":[{"node":{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1},"values":{"font-size":"16px","color":"#000","display":"block","position":"relative","width":"400px","height":"400px","background":"rgba(0, 0, 0, 1)","margin-bottom":"20px"},"children":[{"node":{"nodeValue":"test!","nodeType":3},"values":{"font-size":"16px","color":"#000"},"children":[]}]}]}}],"styleNode":{"node":{"tagName":"html","attributes":{},"children":[{"tagName":"body","attributes":{"id":"body","data-index":"1","style":"color: red; background: yellow;"},"children":[{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1}],"nodeType":1}],"nodeType":1},"values":{"display":"block"},"children":[{"node":{"tagName":"body","attributes":{"id":"body","data-index":"1","style":"color: red; background: yellow;"},"children":[{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1}],"nodeType":1},"values":{"display":"block","font-size":"88px","color":"red","background":"yellow"},"children":[{"node":{"tagName":"div","attributes":{"class":"lightblue test"},"children":[{"nodeValue":"test!","nodeType":3}],"nodeType":1},"values":{"font-size":"16px","color":"#000","display":"block","position":"relative","width":"400px","height":"400px","background":"rgba(0, 0, 0, 1)","margin-bottom":"20px"},"children":[{"node":{"nodeValue":"test!","nodeType":3},"values":{"font-size":"16px","color":"#000"},"children":[]}]}]}]}}`

        const htmlParser = new HTMLParser()
        const cssParser = new CSSParser()

        const domTree = htmlParser.parse(`
            <html>
                <body id=" body " data-index="1" style="color: red; background: yellow;">
                    <div class="lightblue test">test!</div>
                <\/body>
            <\/html>
        `)

        const cssRules = cssParser.parse(`
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
        const parseResult = JSON.stringify(layoutTree(getStyleTree(domTree, cssRules) as StyleNode, dimensions))

        expect(layoutTemplate).toBe(parseResult)
    })
})
