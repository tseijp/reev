import type {
        Fun,
        Nested,
        DurableState,
        MutableState,
        EventState,
        NestedFun,
        DurableFun,
        MutableArgs,
        EventArgs,
} from './types'

export * from './types'

export function nested<Ret, Args extends any[] = any[]>(
        init: NestedFun<Ret, Args>
) {
        const self = ((key, ...args) => {
                if (!self.map.has(key)) self.map.set(key, init(key, ...args))
                return self.map.get(key)
        }) as Nested<Ret, Args>
        self.map = new Map()
        self.has = (key = '') => self.map.has(key)
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

export const mutable = <T extends object>(...args: MutableArgs<T> | []) => {
        const map = new Map<string, Fun>()
        const memo = durable((key, fun) => {
                if (!map.has(key))
                        memo[key] = (...args) => map.get(key)?.(...args)
                map.set(key, fun as Fun)
        }) as unknown as MutableState<T>
        if (args.length) memo(...(args as any))
        return memo
}

export default event

export function event<T extends object>(...args: EventArgs<T> | []) {
        const self = durable((key, ...args) => {
                self.set(key).forEach((listener) => listener(...args))
        }) as unknown as EventState<T>
        self.mount = durable((key, fun) => self.set(key)?.add(fun), self)
        self.clean = durable((key, fun) => self.set(key)?.delete(fun), self)
        self.set = nested(() => new Set<Fun>())
        self.on = nested((key: string, ...defaultArgs) => {
                // @ts-ignore
                return (...args) => void self(key, ...args, ...defaultArgs)
        })
        if (args.length) self.mount(...(args as any))
        return self
}
