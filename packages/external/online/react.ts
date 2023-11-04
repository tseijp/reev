import { useSyncExternalStore } from 'react'
import { onlineEvent } from '.'
import { EventState } from 'reev'
import { OnlineState } from './types'

let self: EventState<OnlineState>

const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

const getSnapshot = () => self.snapshot

export const useOnline = () => {
        if (!self) self = onlineEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
