import { useOnce, useMutable } from '@reev/core/react'
import { WheelConfig } from './types'
import { wheelEvent } from './index'
import { isF } from '../utils'

export const useWheel = <El extends Element = Element>(config: WheelConfig) => {
        if (isF(config)) config = { onWheel: config }
        const memo = useMutable(config)
        return useOnce(() => wheelEvent<El>(memo as any))
}
