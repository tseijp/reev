import { useOnce, useMutable } from 'reev/src/react'
import { wheelEvent } from './index'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { WheelConfig, WheelState } from './types'

export const useWheel = <El extends Element = Element>(config: WheelConfig) => {
        if (isF(config)) config = { wheel: config }
        const memo = useMutable(config)
        return useOnce(() => wheelEvent<El>(memo as any))
}

export default useWheel

export interface WheelProps<El extends Element = Element> extends Partial<WheelState<El>> {
        children: (state: WheelState<El>) => ReactNode
}

export const Wheel = <El extends Element = Element>(props: WheelProps<El>) => {
        const { children, ...other } = props
        return children(useWheel(other))
}
