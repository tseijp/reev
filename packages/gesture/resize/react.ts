import { resizeEvent } from '.'
import { useMutable, useOnce } from '@reev/core/react'
import { ResizeArg } from './types'
import { isF } from '../utils'

export const useResizeEvent = (arg: ResizeArg) => {
        if (isF(arg)) arg = { onResize: arg }
        const memo = useMutable(arg)
        return useOnce(() => resizeEvent(memo as any))
}
