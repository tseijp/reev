import { useOnce, useMutable } from 'reev/src/react'
import { pinchEvent } from '.'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { PinchArg, PinchState } from './types'

export const usePinch = <El extends Element = Element>(arg?: PinchArg) => {
        if (isF(arg)) arg = { pinch: arg }
        const memo = useMutable(arg)
        return useOnce(() => pinchEvent<El>(memo as any))
}

export default usePinch

export interface PinchProps<El extends Element = Element> extends Partial<PinchState<El>> {
        children: (state: PinchState<El>) => ReactNode
}

export const Pinch = (props: PinchProps) => {
        const { children, ...other } = props
        return children(usePinch(other))
}
