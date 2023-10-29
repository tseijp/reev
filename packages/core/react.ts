import { useRef } from 'react'
import { event, mutable } from './index'
import type { MutableArgs, RefEvent } from './types'

export * from './index'

export const useOnce = <T>(fun: () => T) => {
        const memo = useRef(void 0 as T)
        // if (!memo.current) memo.current = fun()
        // return memo.current
        return memo.current ?? (memo.current = fun())
}

export const useMutable = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useOnce(() => mutable<T>())
        return memo(...args)
}

export const useEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable(...args) as T
        return useOnce(() => event(memo))
}

export const useRefEvent = <T extends object>(...args: MutableArgs<T>) => {
        const memo = useMutable(...args) as T
        return useOnce(() => {
                const self = event({
                        ...memo,
                        ref: (el: Element) => {
                                if (el) {
                                        self.mount?.((self.target = el))
                                } else self.clean?.(null)
                        },
                }) as RefEvent<T>
                return self
        })
}

export default useEvent
