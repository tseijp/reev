import { useOnce, useMutable } from 'reev/src/react'
import { dragEvent } from './index'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { DragArg, DragState } from './types'

export const useDrag = <El extends Element = Element>(arg: DragArg<El>) => {
        if (isF(arg)) arg = { drag: arg }
        const memo = useMutable(arg)
        return useOnce(() => dragEvent<El>(memo as any))
}

export default useDrag

export interface DragProps<El extends Element = Element> extends Partial<DragState<El>> {
        children(self: DragState<El>): ReactNode
}

export const Drag = <El extends Element = Element>(props: DragProps<El>) => {
        const { children, ...other } = props
        return children(useDrag(other))
}
