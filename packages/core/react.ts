import { useEffect, useState } from 'react'
import { event, mutable } from 'reev'
import type { MutableArgs, MutableState, EventState, RefEvent } from './types'

export * from './index'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args) as MutableState<T>
}

export const useEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable<T>(...args)
        const self = useState(() => event<T>())[0] as any
        useEffect(() => void self.mount(memo)('mount'), [self, memo])
        useEffect(() => () => self.clean(memo)('clean'), [self, memo])
        return self as EventState<T>
}

export const useRefEvent = <T extends object, Target = unknown>(
        ...args: MutableArgs<T>
) => {
        const memo = useMutable<T>(...args)
        const self = useState(
                event('ref', (target: Target) => {
                        if (self.target) {
                                self.clean(memo)
                                self('clean', (self.target = void 0))
                        } else {
                                self.mount(memo)
                                self('mount', (self.target = target))
                        }
                })
        )[0] as any
        self.ref = self.on('ref')
        return self as RefEvent<T>
}
