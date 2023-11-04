import { useOnce, useMutable } from '@reev/core/react'
import { pinchEvent } from '.'
import { PinchArg, PinchState } from './types'
import { isF } from '../utils'

export const usePinch = <El extends Element = Element>(arg?: PinchArg) => {
        if (isF(arg)) arg = { onPinch: arg }
        const memo = useMutable(arg)
        return useOnce(() => pinchEvent<El>(memo as any))
}

export default usePinch

export interface PinchProps<El extends Element = Element>
        extends Partial<PinchState<El>> {
        children: (state: PinchState<El>) => JSX.Element
}

export const Pinch = (props: PinchProps) => {
        const { children, ...other } = props
        return children(usePinch(other))
}
