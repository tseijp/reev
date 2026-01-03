import { useOnce, useMutable } from 'reev/src/react'
import { hoverEvent } from '.'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { HoverArg, HoverState } from './types'

export const useHover = <El extends Element = Element>(arg?: HoverArg) => {
        if (isF(arg)) arg = { hover: arg }
        const memo = useMutable(arg)
        return useOnce(() => hoverEvent<El>(memo as any))
}

export default useHover

export interface HoverProps<El extends Element = Element> extends Partial<HoverState<El>> {
        children: (state: HoverState<El>) => ReactNode
}

export const Hover = (props: HoverProps) => {
        const { children, ...other } = props
        return children(useHover(other))
}
