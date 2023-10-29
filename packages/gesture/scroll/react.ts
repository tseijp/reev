import { useOnce, useMutable } from '@reev/core/react'
import { ScrollConfig } from './types'
import { scrollEvent } from './index'
import { isF } from '../utils'

export const useScroll = <El extends Element = Element>(
        config: ScrollConfig
) => {
        if (isF(config)) config = { onScroll: config }
        const memo = useMutable(config)
        return useOnce(() => scrollEvent<El>(memo as any))
}
