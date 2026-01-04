import { useSyncExternalStore } from 'react'
import { orientEvent } from './index'
import type { EventState } from '../../index'
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
