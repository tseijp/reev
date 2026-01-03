import { resizeEvent } from '.'
import { useMutable, useOnce } from 'reev/src/react'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { ResizeArg, ResizeState } from './types'

export const useResize = (arg: ResizeArg) => {
        if (isF(arg)) arg = { resize: arg }
        const memo = useMutable(arg)
        return useOnce(() => resizeEvent(memo as any))
}

export default useResize

export interface ResizeProps<El extends Element = Element> extends Partial<ResizeState<El>> {
        children: (state: ResizeState<El>) => ReactNode
}

export const Resize = <El extends Element = Element>(props: ResizeProps<El>) => {
        const { children, ...other } = props
        return children(useResize(other))
}
