import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import type { OutputOptions, RollupWatchOptions } from 'rollup'
import { watch } from 'rollup'

function getOptions(output: OutputOptions | OutputOptions[]) {
    return {
        input: 'src/index.ts',
        output,
        plugins: [
            resolve({
                browser: true,
            }),
            typescript(),
            json({
                compact: true,
            }),
        ],
    } as RollupWatchOptions
}

if (process.env.NODE_ENV === 'development') {
    const watcher = watch(getOptions(getOutput('umd')))
    console.log('rollup is watching for file change...')

    watcher.on('event', (event) => {
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

const formats = ['es', 'umd']

function getOutput(format: 'es' | 'umd') {
    return {
        format,
        file: `dist/render-engine.${format === 'es' ? 'mjs' : 'js'}`,
        name: 'RenderEngine',
    }
}

export default getOptions(formats.map(getOutput))
