import { defineConfig } from 'tsup'
import type { Options } from 'tsup'
import type { Plugin } from 'esbuild'

/**
 * Gesture types in rege
 */
const GESTURE_TYPES = ['drag', 'hover', 'key', 'pinch', 'resize', 'scroll', 'wheel'] as const

/**
 * Build targets for both CJS and ESM
 */
const BUILD_TARGETS: Options[] = [
	{ format: 'cjs', dts: { compilerOptions: { moduleResolution: 'node' } } },
	{ format: 'esm' },
]

/**
 * Base configuration shared across all builds
 */
const BASE_CONFIG: Options = {
	outDir: './dist',
	splitting: false,
	target: 'es2020',
	external: ['react', 'react-dom', 'react-native', 'solid-js', 'reev'],
}

/**
 * Module entries for rege package
 * - index: main entry point (all gestures)
 * - react: all React bindings
 * - utils: shared utilities
 * - {gesture}/index: specific gesture entry
 * - {gesture}/react: specific gesture React binding
 */
const MODULE_ENTRIES = {
	index: 'src/index.ts',
	react: 'src/react.ts',
	utils: 'src/utils.ts',
	...Object.fromEntries(GESTURE_TYPES.map((type) => [`${type}/index`, `src/${type}/index.ts`])),
	...Object.fromEntries(GESTURE_TYPES.map((type) => [`${type}/react`, `src/${type}/react.ts`])),
} as const

type ModuleEntriesKey = keyof typeof MODULE_ENTRIES

const MODULE_ENTRIES_KEYS = Object.keys(MODULE_ENTRIES) as ModuleEntriesKey[]

/**
 * Check if a path matches any module entry
 */
const isEntryPoint = (kind: string) => kind === 'entry-point'

const isModuleEntry = (path: string) => MODULE_ENTRIES_KEYS.some((key) => {
	const normalized = key.replace('/index', '').replace('/react', '')
	return path.includes(`/${normalized}/`) || path.includes(`/${normalized}.`)
})

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
