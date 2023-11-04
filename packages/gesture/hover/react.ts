import { useOnce, useMutable } from '@reev/core/react'
import { hoverEvent } from '.'
import { HoverArg, HoverState } from './types'
import { isF } from '../utils'

export const useHover = <El extends Element = Element>(arg?: HoverArg) => {
        if (isF(arg)) arg = { onHover: arg }
        const memo = useMutable(arg)
        return useOnce(() => hoverEvent<El>(memo as any))
}

export default useHover

export interface HoverProps<El extends Element = Element>
        extends Partial<HoverState<El>> {
        children: (state: HoverState<El>) => JSX.Element
}

export const Hover = (props: HoverProps) => {
        const { children, ...other } = props
        return children(useHover(other))
}
