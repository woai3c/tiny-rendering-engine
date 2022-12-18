import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import rollup from 'rollup'

function getOptions() {
    return {
        input: 'src/index.ts',
        output: {
            file: 'dist/render-engine.js',
            format: 'umd',
            name: 'RenderEngine',
        },
        plugins: [
            resolve({
                browser: true,
            }),
            typescript(),
            json({
                compact: true,
            }),
        ],
    } as rollup.RollupWatchOptions
}

if (process.env.NODE_ENV === 'development') {
    const watcher = rollup.watch(getOptions())
    console.log('rollup is watching for file change...')

    watcher.on('event', event => {
        switch (event.code) {
            case 'START':
                console.log('rollup is rebuilding...')
                break
            case 'ERROR':
                console.log('error in rebuilding.')
                break
            case 'END':
                console.log('rebuild done.\n\n')
        }
    })
}

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/render-engine.js',
        format: 'umd',
        name: 'RenderEngine',
    },
    plugins: [
        resolve({
            browser: true,
        }),
        typescript({
            check: false,
        }),
        json({
            compact: true,
        }),
    ],
}