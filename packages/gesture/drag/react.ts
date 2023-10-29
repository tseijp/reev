import { useOnce, useMutable } from '@reev/core/react'
import { DragArg, DragState } from './types'
import { dragEvent } from './index'
import { isF } from '../utils'

export const useDrag = <El extends Element = Element>(arg: DragArg<El>) => {
        if (isF(arg)) arg = { onDrag: arg }
        const memo = useMutable(arg)
        return useOnce(() => dragEvent<El>(memo as any))
}

export default useDrag

export interface DragProps extends DragState {
        children(self: DragState): JSX.Element
}

export const Drag = (props: DragProps) => {
        const { children, ...other } = props
        return children(useDrag(other))
}
