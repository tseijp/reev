import { defineConfig } from 'tsup'
import type { Options } from 'tsup'
import type { Plugin } from 'esbuild'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

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

const isTypeExport = (path: string) => path.includes('types')

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
                                if (isTypeExport(path)) return
                                path += ext
                                return { path, external: true } // All files are bundled as separate endpoints, so don't split into non-endpoint files
                        })
                },
        }
}

/**
 * Generate source exports (./src/*)
 * Points directly to TypeScript source files
 */
const generateSourceExport = (entry: string): Record<string, any> => {
        const srcPath = MODULE_ENTRIES[entry as keyof typeof MODULE_ENTRIES]
        return {
                types: `./${srcPath}`,
                import: `./${srcPath}`,
                default: `./${srcPath}`,
        }
}

/**
 * Generate dist exports (./* - built files)
 * Points to compiled JavaScript with CJS/ESM support
 * Uses TypeScript official recommended simple structure
 */
const generateDistExport = (entry: string): Record<string, any> => {
        const distPath = entry === 'index' ? 'dist/index' : `dist/${entry}`
        return {
                types: `./${distPath}.d.ts`,
                import: `./${distPath}.mjs`,
                require: `./${distPath}.js`,
                default: `./${distPath}.js`,
        }
}

/**
 * Generate the complete exports field for package.json
 */
const generateExports = (): Record<string, any> => {
        const exports: Record<string, any> = {
                // Fixed export for packages.json
                './packages.json': './packages.json',
        }

        // Generate source exports (./src/*)
        for (const entry of MODULE_ENTRIES_KEYS) {
                const exportKey = `./src/${entry === 'index' ? '' : entry}`
                        .replace(/\/index$/, '')
                        .replace(/\/$/, '')
                exports[exportKey] = generateSourceExport(entry)
        }

        // Generate dist exports (./* - built files)
        for (const entry of MODULE_ENTRIES_KEYS) {
                const exportKey = entry === 'index' ? '.' : `./${entry.replace(/\/index$/, '')}`
                exports[exportKey] = generateDistExport(entry)
        }

        return exports
}

/**
 * Generate package.json from package.base.json with auto-generated exports
 */
const generatePackageJson = (): void => {
        try {
                // Read base package.json
                const basePath = join(__dirname, 'package.base.json')
                const basePackage = JSON.parse(readFileSync(basePath, 'utf-8'))

                // Generate exports
                const exports = generateExports()

                // Merge and create final package.json
                const finalPackage = {
                        ...basePackage,
                        exports,
                }

                // Write to package.json
                const packagePath = join(__dirname, 'package.json')
                writeFileSync(packagePath, JSON.stringify(finalPackage, null, 8) + '\n')

                console.log('✅ Successfully generated package.json with', Object.keys(exports).length, 'exports')
        } catch (error) {
                console.error('❌ Failed to generate package.json:', error)
                throw error
        }
}

/**
 * Create build configuration for each entry point
 */
const createConfig = (options: Options, entry: ModuleEntriesKey): Options[] => {
        return BUILD_TARGETS.map((target) => {
                const ext = target.format === 'cjs' ? '.js' : '.mjs'
                return {
                        ...options,
                        ...target,
                        ...BASE_CONFIG,
                        entry: { [entry]: MODULE_ENTRIES[entry] },
                        esbuildPlugins: [createPlugin(entry, ext)],
                        clean: !options.watch,
                        minify: !options.watch,
                }
        })
}

export default defineConfig((options) => {
        const configs = MODULE_ENTRIES_KEYS.map(createConfig.bind(null, options)).flat()

        // Add onSuccess hook to the last config to generate package.json after all builds
        if (configs.length > 0 && !options.watch) {
                const lastConfig = configs[configs.length - 1]
                lastConfig.onSuccess = () => {
                        generatePackageJson()
                }
        }

        return configs
})
