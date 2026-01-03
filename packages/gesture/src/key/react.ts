import { useMutable, useOnce } from 'reev/src/react'
import { keyEvent } from '.'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { KeyArg, KeyState } from './types'

export const useKey = <El extends Element = Element>(arg: KeyArg<El>) => {
        if (isF(arg)) arg = { key: arg }
        const memo = useMutable(arg)
        return useOnce(() => keyEvent<El>(memo as any))
}

export interface KeyProps<El extends Element = Element> extends Partial<KeyState<El>> {
        children: (state: KeyState<El>) => ReactNode
}

export const Key = <El extends Element = Element>(props: KeyProps<El>) => {
        const { children, ...other } = props
        return children(useKey(other))
}
