import { useSyncExternalStore } from 'react'
import { onlineEvent } from './index'
import type { EventState } from '../../index'
import type { OnlineState } from './types'

let self: EventState<OnlineState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useOnline = () => {
        if (!self) self = onlineEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
