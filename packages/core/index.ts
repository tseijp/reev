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

export function nested<T, Args extends any[] = any[]>(
        init: NestedFun<T, Args>
) {
        const self = ((key, ...args) => {
                if (!self.map.has(key)) self.map.set(key, init(key, ...args))
                return self.map.get(key)
        }) as Nested<T, Args>
        self.map = new Map()
        self.has = (key = '') => self.map.has(key)
        return self
}

export const durable = <T extends object, Ret = unknown>(
        fun: DurableFun<T>,
        ret?: Ret
) => {
        const self = (arg: T, ...args: unknown[]) => {
                if (arg !== Object(arg)) fun(arg as any, ...args)
                else for (const key in arg) fun(key, arg[key], ...args)
                return ret ?? self
        }
        return self as DurableState<
                T,
                Ret extends undefined ? typeof self : Ret
        >
}

export const mutable = <T extends object>(...args: MutableArgs<T> | []) => {
        const map = new Map<string, Fun>()
        const memo = durable((key, fun) => {
                if (typeof fun !== 'function') return (memo[key] = fun)
                if (!map.has(key))
                        memo[key] = (...args: any[]) => map.get(key)?.(...args)
                map.set(key, fun as Fun)
        }) as MutableState<T>
        if (args.length) memo(...(args as any))
        return memo
}

export function event<T extends object>(...args: EventArgs<T> | []) {
        const set = nested(() => new Set<Fun>())
        const self = durable((key, fun) => {
                if (typeof fun !== 'function') return (self[key] = fun)
                if (!set.has(key))
                        self[key] = (...args: any[]) => {
                                set(key).forEach((fun) => fun(...args))
                        }
                if (set(key).has(fun)) {
                        set(key).delete(fun)
                } else set(key).add(fun)
        }) as EventState<T>
        if (args.length) self(...(args as any))
        return self
}

export default event
