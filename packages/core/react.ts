import { useState } from 'react'
import { event, mutable } from './index'
import type { MutableArgs, MutableState, EventState, RefEvent } from './types'

export * from './index'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args) as MutableState<T>
}

export const useEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable(...args) as T
        return useState(() => event(memo))[0] as EventState<T>
}

export const useRefEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable(...args) as T
        return useState(() => {
                const self = event({
                        ...memo,
                        ref: (target: unknown) => {
                                const type = target ? 'mount' : 'clean'
                                self[type]?.((self.target = target))
                        },
                }) as RefEvent<T>
                return self
        })[0]
}
