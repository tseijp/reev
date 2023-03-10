import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { event, durable } from "reev";

export * from "reev";

export const mutable = (...initArgs: [any, any]) => {
        const memo = durable((key, fun) => (init[key] = fun))
        const init = durable((key) => (memo[key] = (...args) => init[key](...args)))
        init(...initArgs)
        return memo
};

export const useMutable = (...args: [any, any]) => {
        const [memo] = useState(() => mutable(...args))
        memo(...args)
        return memo
}

export const useEvent = (key: any, fun: any, target: any) => {
        if (typeof fun !== "function") target = fun
        const memo = useMutable(key, fun)
        const self = useMemo(() => target || event(), [target])
        useEffect(() => void self.mount(memo), [self, memo])
        useEffect(() => () => self.clean(memo), [self, memo])
        return self
}

export const useRefEvent = (events: any, target: any) => {
        const cleanupRef = useRef<Function | undefined>(void 0)
        const memo = useMutable(events, void 0)
        const self = useMemo(() => target || event(), [target])
        const ref = useCallback((target: any) => {
                if (cleanupRef.current) {
                        cleanupRef.current()
                        cleanupRef.current = void 0
                } else {
                        cleanupRef.current = () => self("clean", target)
                        self.mount(memo) // @ts-ignore
                        self("mount", ref.current = target)
                }
        }, [self, memo])
        return ref
}
