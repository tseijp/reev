import { useSyncExternalStore } from 'react'
import { windowSizeEvent } from './index'
import { WindowSizeState } from './types'
import { EventState } from 'reev'

let self: EventState<WindowSizeState>

const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

const getSnapshot = () => self.snapshot

export const useWindowSize = () => {
        if (!self) self = windowSizeEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
