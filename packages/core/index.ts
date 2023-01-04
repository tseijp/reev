import type { Event, Fun, Durable, Nested } from '@reev/types'

export default event

export function event<T extends Fun>(init?: Record<any, Fun>) {
        const set = nested(() => new Set<T>());
        const _on = nested<Fun>((key) => (...args) => self(key, ...args))
        const self = durable((key = "", ...args) => {
                set(key).forEach((listener) => listener(self, ...args))
        }) as Event
        /**
         * mount and clean event callbacks
         */
        self.mount = durable((key, fun) => void set(key)?.add(fun as T), self)
        self.clean = durable((key, fun) => void set(key)?.delete(fun as T), self)
        self.on = (key = "") => _on(key)
        if (init) self.mount(init)
        return self
}

export function nested<T>(init: (key: string, ...args: unknown[]) => T) {
        const target = new Map();
        const self = ((key, ...args) =>
                target.get(key) ||
                target.set(key, init(key, ...args)).get(key)) as Nested<T>
        self.has = (key = "") => target.has(key)
        return self
}

export const durable: Durable = (fun, ret) => {
        return (target, ...args) => {
                if (typeof target === "string") fun(target, ...args)
                else for (const key in target) fun(key, target[key], ...args)
                return ret
        };
}
