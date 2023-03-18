import type { Event, Fun, Durable, Nested } from './types'

export * from './types'

export default event

export function event<T extends Fun>(...init: [any] | []) {
        const set = nested(() => new Set<T>());
        const self = durable((key = "", ...args) => {
                set(key).forEach((listener) => listener(self, ...args))
        }) as Event
        /**
         * mount and clean event callbacks
         */
        self.mount = durable((key, fun) => void set(key)?.add(fun as T), self)
        self.clean = durable((key, fun) => void set(key)?.delete(fun as T), self)
        self.on = nested((key, ...defaultArgs) => {
                return (...args) => self(key, ...args, ...defaultArgs)
        })
        if (init.length) self.mount(...init)
        return self
}

export function nested<T>(init: (key: string, ...args: unknown[]) => T) {
        const map = new Map();
        const self = ((key, ...args) =>
                map.has(key)
                ? map.get(key)
                : map.set(key, init(key, ...args)).get(key)) as Nested<T>
        self.has = (key = "") => map.has(key)
        self.map = map
        return self
}

export const durable: Durable = (fun, ret) => {
        return (target, ...args) => {
                if (typeof target === "string") fun(target, ...args)
                else for (const key in target) fun(key, target[key], ...args)
                return ret
        };
}
