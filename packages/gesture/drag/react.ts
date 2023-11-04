import { useOnce, useMutable } from 'reev/react'
import { DragArg, DragState } from './types'
import { dragEvent } from './index'
import { isF } from '../utils'

export const useDrag = <El extends Element = Element>(arg: DragArg<El>) => {
        if (isF(arg)) arg = { onDrag: arg }
        const memo = useMutable(arg)
        return useOnce(() => dragEvent<El>(memo as any))
}

export default useDrag

export interface DragProps<El extends Element = Element>
        extends Partial<DragState<El>> {
        children(self: DragState<El>): JSX.Element
}

export const Drag = <El extends Element = Element>(props: DragProps<El>) => {
        const { children, ...other } = props
        return children(useDrag(other))
}
