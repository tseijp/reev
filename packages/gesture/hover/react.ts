import { useOnce, useMutable } from '@reev/core/react'
import { hoverEvent } from '.'
import { HoverArg } from './types'
import { isF } from '../utils'

export const useHover = <El extends Element = Element>(arg?: HoverArg) => {
        if (isF(arg)) arg = { onHover: arg }
        const memo = useMutable(arg)
        return useOnce(() => hoverEvent<El>(memo as any))
}

export default useHover
