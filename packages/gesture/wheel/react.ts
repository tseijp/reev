import { useOnce, useMutable } from 'reev/react'
import { WheelConfig, WheelState } from './types'
import { wheelEvent } from './index'
import { isF } from '../utils'

export const useWheel = <El extends Element = Element>(config: WheelConfig) => {
        if (isF(config)) config = { onWheel: config }
        const memo = useMutable(config)
        return useOnce(() => wheelEvent<El>(memo as any))
}

export default useWheel

export interface WheelProps<El extends Element = Element>
        extends Partial<WheelState<El>> {
        children: (state: WheelState<El>) => JSX.Element
}

export const Wheel = <El extends Element = Element>(props: WheelProps<El>) => {
        const { children, ...other } = props
        return children(useWheel(other))
}
