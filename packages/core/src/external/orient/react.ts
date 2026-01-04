import { useSyncExternalStore } from 'react'
import { orientEvent } from '.'
import type { EventState } from 'reev'
import type { OrientState } from './types'

let self: EventState<OrientState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useOrient = () => {
        if (!self) self = orientEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
