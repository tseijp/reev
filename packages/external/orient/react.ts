import { useSyncExternalStore } from 'react'
import { orientEvent } from '.'
import { OrientState } from './types'
import { EventState } from 'reev'

let self: EventState<OrientState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useOrient = () => {
        if (!self) self = orientEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        return ret
}
