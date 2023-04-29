import { useEffect, useState, useRef } from 'react'
import { event, mutable } from './index'
import type { MutableArgs, MutableState, RefEvent } from './types'

export * from './index'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args) as MutableState<T>
}

export const useEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable<T>(...args)
        const self = useState(() => event<T>())[0] as any
        useEffect(() => () => void self.mount(memo), [self, memo])
        useEffect(() => () => self.clean(memo), [self, memo])
        return self
}

export const useRefEvent = <T extends object, Target = unknown>(
        ...args: MutableArgs<T>
) => {
        const memo = useMutable<T>(...args)
        const self = useState(event<T>())[0] as any
        const ref = useRef<RefEvent<T, Target>>((target) => {
                if (self.target) {
                        self.clean(memo).target = void 0
                } else self.mount(memo).target = target
        }).current
        ref.current = self
        return ref
}
