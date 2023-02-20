import { useEffect, useState, useMemo } from "react";
import { event, durable } from "reev";

export const mutable = (...initArgs: [any]) => {
        const ret = durable((key, fun) => (set[key] = fun));
        const set = durable((key) => (ret[key] = (...args) => set[key](...args)));
        set(...initArgs);
        return ret;
};

export const useMutable = (...args: [any]) => {
        const [ret] = useState(() => mutable(...args));
        ret(...args);
        return ret;
}

export const useEvent = (target, ...args: [any]) => {
        const ref = useMutable(...args);
        const ret = useMemo(() => target || event(), [target]);
        useEffect(() => void ret.mount(ref), [ret, ref]);
        useEffect(() => () => ret.clean(ref), [ret, ref]);
        return ret;
}