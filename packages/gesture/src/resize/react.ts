import { resizeEvent } from '.'
import { useMutable, useOnce } from 'reev/src/react'
import { ResizeArg, ResizeState } from './types'
import { isF } from '../utils'

export const useResize = (arg: ResizeArg) => {
        if (isF(arg)) arg = { resize: arg }
        const memo = useMutable(arg)
        return useOnce(() => resizeEvent(memo as any))
}

export default useResize

export interface ResizeProps<El extends Element = Element> extends Partial<ResizeState<El>> {
        children: (state: ResizeState<El>) => JSX.Element
}

export const Resize = <El extends Element = Element>(props: ResizeProps<El>) => {
        const { children, ...other } = props
        return children(useResize(other))
}
