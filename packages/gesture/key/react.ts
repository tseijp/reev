import { useMutable, useOnce } from '@reev/core/react'
import { keyEvent } from '.'
import { KeyArg } from './types'
import { isF } from '../utils'

export const useKeyEvent = <El extends Element = Element>(arg: KeyArg<El>) => {
        if (isF(arg)) arg = { onKey: arg }
        const memo = useMutable(arg)
        return useOnce(() => keyEvent(memo as any))
}
