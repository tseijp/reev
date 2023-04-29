import { useEffect, useState, useMemo, useRef } from 'react';
import { event, mutable } from './index';
import type { MutableState } from './types';

export * from './index';

export const useMutable = <T extends object>(
        ...args: Parameters<MutableState<T>>
) => {
        const [memo] = useState(() => mutable<T>());
        return memo(...args) as MutableState<T>;
};

export const useEvent = <T extends object>(
        ...args: Parameters<MutableState<T>>
) => {
        const memo = useMutable<T>(...args);
        const self = useState(() => event<T>(memo))[0];
        useEffect(() => () => void self.clean(memo), [self, memo]);
        return self;
};

export const useRefEvent = <T extends object, Target = unknown>(
        ...args: Parameters<MutableState<T>>
) => {
        const initRef = useRef(false);
        const memo = useMutable(...args);
        const self = useMemo(() => event<T & { target: Target }>(), []);
        memo('ref', (target: Target) => {
                if ((initRef.current = !initRef.current)) {
                        self.mount(memo);
                        self('mount', (self.target = target));
                } else {
                        self.clean(memo);
                        self('clean', (self.target = void 0));
                }
        });
        memo.ref.current = self;
        return memo.ref;
};
