import type {
        Fun,
        Nested,
        DurableState,
        MutableState,
        EventState,
        NestedFun,
        DurableFun,
} from './types'

export * from './types'

export function nested<Ret, Args extends any[] = any[]>(
        init: NestedFun<Ret, Args>
) {
        const map = new Map()
        const self = ((key, ...args) => {
                if (!map.has(key)) map.set(key, init(key, ...args))
                return map.get(key)
        }) as Nested<Ret, Args>
        self.has = (key = '') => map.has(key)
        self.map = map
        return self
}

export const durable = <T extends object, R = unknown>(
        fun: DurableFun<T>,
        ret?: R
) => {
        const self = (arg: T, ...args: unknown[]) => {
                if (typeof arg === 'string') fun(arg, ...args)
                else for (const key in arg) fun(key, arg[key], ...args)
                return ret ?? self
        }
        return self as DurableState<T, R extends undefined ? typeof self : R>
}

export const mutable = <T extends object>() => {
        const map = new Map<string, Fun>()
        const memo = durable((key, fun) => {
                if (!map.has(key))
                        memo[key] = (...args) => map.get(key)?.(...args)
                map.set(key, fun as Fun)
        }) as unknown as MutableState<T>
        return memo
}

export default event

export function event<T extends object>() {
        const self = durable((key, ...args) => {
                self.set(key).forEach((listener) => listener(...args))
        }) as unknown as EventState<T>
        self.mount = durable((key, fun) => self.set(key)?.add(fun), self)
        self.clean = durable((key, fun) => self.set(key)?.delete(fun), self)
        self.set = nested(() => new Set<Fun>())
        self.on = nested((key: string, ...defaultArgs) => {
                // @ts-ignore
                return (...args) => self(key, ...args, ...defaultArgs)
        })
        return self
}
