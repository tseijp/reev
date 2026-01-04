import { useOnce, useMutable } from 'reev/react'
import { scrollEvent } from './index'
import { isF } from '../utils'
import type { ReactNode } from 'react'
import type { ScrollConfig, ScrollState } from './types'

export const useScroll = <El extends Element = Element>(config: ScrollConfig) => {
        if (isF(config)) config = { scroll: config }
        const memo = useMutable(config)
        return useOnce(() => scrollEvent<El>(memo as any))
}

export default useScroll

export interface ScrollProps<El extends Element = Element> extends Partial<ScrollState<El>> {
        children: (state: ScrollState<El>) => ReactNode
}

export const Scroll = <El extends Element = Element>(props: ScrollProps<El>) => {
        const { children, ...other } = props
        return children(useScroll(other))
}
