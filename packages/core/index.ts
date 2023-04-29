import type {
        Fun,
        Nested,
        DurableState,
        MutableState,
        EventState,
        NestedFun,
        DurableFun,
        EventArgs,
} from './types';

export * from './types';

export function nested<Ret, Args extends any[] = any[]>(
        init: NestedFun<Ret, Args>
) {
        const map = new Map();
        const self = ((key, ...args) => {
                return map.has(key)
                        ? map.get(key)
                        : map.set(key, init(key, ...args)).get(key);
        }) as Nested<Ret, Args>;
        self.has = (key = '') => map.has(key);
        self.map = map;
        return self;
}

export const durable = <T extends object, R = unknown>(
        fun: DurableFun<T>,
        ret?: R
) => {
        const self = (arg: T, ...args: unknown[]) => {
                if (typeof arg === 'string') fun(arg, ...args);
                else for (const key in arg) fun(key, arg[key], ...args);
                return ret ?? self;
        };
        return self as DurableState<T, R extends undefined ? typeof self : R>;
};

export const mutable = <T extends object>() => {
        const map = new Map<string, Fun>();
        const memo = durable((key, fun) => {
                if (!map.has(key))
                        memo[key] = (...args) => map.get(key)?.(...args);
                map.set(key, fun as Fun);
        }) as unknown as MutableState<T>;
        return memo;
};

export default event;

export function event<T extends object>(...init: EventArgs<T>) {
        const set = nested(() => new Set<Fun>());
        const self = durable((key, ...args) => {
                set(key).forEach((listener) => listener(...args));
        }) as unknown as EventState<T>;
        /**
         * mount and clean event callbacks
         */
        self.mount = durable((key, fun) => set(key)?.add(fun as Fun), self);
        self.clean = durable((key, fun) => set(key)?.delete(fun as Fun), self);
        self.on = nested((key: string, ...defaultArgs) => {
                // @ts-ignore
                return (...args) => self(key, ...args, ...defaultArgs);
        });

        // @ts-ignore
        if (init.length) self.mount(...init);

        return self;
}
