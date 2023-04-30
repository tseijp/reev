import { useEffect, useState } from 'react'
import { event, mutable } from 'reev'
import type { MutableArgs, MutableState } from './types'

export * from './index'

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const [memo] = useState(() => mutable<T>())
        return memo(...args) as MutableState<T>
}

export const useEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable<T>(...args)
        const self = useState(() => event<T>())[0]
        useEffect(() => {
                self(memo as T).mount?.()
                return () => void self(memo as T).clean?.()
        }, [memo, self])
        return self
}

export const useRefEvent = <T extends object, Target = unknown>(
        ...args: MutableArgs<T>
) => {
        const memo = useMutable<T>(...args)
        const self = useState(() =>
                event('ref', (target: Target) => {
                        const type = target ? 'mount' : 'clean'
                        self(memo as T)[type]?.((self.target = target))
                })
        )[0]
        return self
}
