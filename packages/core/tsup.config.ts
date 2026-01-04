import { defineConfig } from 'tsup'
import type { Options } from 'tsup'
import type { Plugin } from 'esbuild'

const GESTURE = ['drag', 'hover', 'key', 'pinch', 'resize', 'scroll', 'wheel'] as const
const EXTERNAL = ['battery', 'clipboard', 'geolocation', 'mediaQuery', 'online', 'orient', 'windowSize'] as const
const BUILD_TARGETS: Options[] = [{ format: 'cjs', dts: { compilerOptions: { moduleResolution: 'node' } } }, { format: 'esm' }]
const BASE_CONFIG: Options = {
        outDir: './dist',
        splitting: false,
        target: 'es2020',
        external: ['react', 'react-dom', 'react-native', 'solid-js'],
}

/**
 * Module entries for reev package
 * - index: main reev entry point
 * - react: main reev React bindings
 * - gesture/index: all gestures
 * - gesture/react: all gesture React bindings
 * - gesture/utils: gesture utilities
 * - gesture/{type}/index: specific gesture
 * - gesture/{type}/react: specific gesture React binding
 * - external/index: all external events
 * - external/react: all external event React bindings
 * - external/utils: external utilities
 * - external/{type}/index: specific external event
 * - external/{type}/react: specific external event React binding
 */
const MODULE_ENTRIES = {
        index: 'src/index.ts',
        react: 'src/react.ts',
        'gesture/index': 'src/gesture/index.ts',
        'gesture/react': 'src/gesture/react.ts',
        'gesture/utils': 'src/gesture/utils.ts',
        'external/index': 'src/external/index.ts',
        'external/react': 'src/external/react.ts',
        'external/utils': 'src/external/utils.ts',
        ...Object.fromEntries(GESTURE.map((type) => [`gesture/${type}/index`, `src/gesture/${type}/index.ts`])),
        ...Object.fromEntries(GESTURE.map((type) => [`gesture/${type}/react`, `src/gesture/${type}/react.ts`])),
        ...Object.fromEntries(EXTERNAL.map((type) => [`external/${type}/index`, `src/external/${type}/index.ts`])),
        ...Object.fromEntries(EXTERNAL.map((type) => [`external/${type}/react`, `src/external/${type}/react.ts`])),
} as const

type ModuleEntriesKey = keyof typeof MODULE_ENTRIES

const MODULE_ENTRIES_KEYS = Object.keys(MODULE_ENTRIES) as ModuleEntriesKey[]

/**
 * Check if a path matches any module entry
 */
const isEntryPoint = (kind: string) => kind === 'entry-point'

// const isModuleEntry = (path: string) =>
//         MODULE_ENTRIES_KEYS.some((key) => {
//                 const n = key.replace('/index', '').replace('/react', '')
//                 return path.includes(`/${n}/`) || path.includes(`/${n}.`)
//         })

const isModuleEntry = (path: string) => MODULE_ENTRIES_KEYS.some((p) => path.includes(p))

/**
 * Create esbuild plugin to externalize internal modules
 * This prevents type duplication across bundles
 */
const createPlugin = (entry: string, ext: string): Plugin => {
        return {
                name: `exclude-internal-${entry}`,
                setup(build) {
                        build.onResolve({ filter: /.*/ }, ({ kind, path }) => {
                                if (isEntryPoint(kind)) return
                                if (!isModuleEntry(path)) return
                                path = path.replace(/^\.\.\//, './')
                                path += ext
                                return { path, external: true }
                        })
                },
        }
}

/**
 * Create build configuration for each entry point
 */
const createConfig = (options: Options, entry: ModuleEntriesKey): Options[] => {
        return BUILD_TARGETS.map((target) => {
                const ext = target.format === 'cjs' ? '.cjs' : '.js'
                return {
                        ...options,
                        ...target,
                        ...BASE_CONFIG,
                        entry: { [entry]: MODULE_ENTRIES[entry] },
                        esbuildPlugins: [createPlugin(entry, ext)],
                        sourcemap: !options.watch,
                        clean: !options.watch,
                        minify: !options.watch,
                }
        })
}

export default defineConfig((options) => {
        return MODULE_ENTRIES_KEYS.map(createConfig.bind(null, options)).flat()
})
