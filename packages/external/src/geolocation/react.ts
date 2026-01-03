import { useSyncExternalStore } from 'react'
import { geolocationEvent } from '.'
import type { EventState } from 'reev/src'
import type { GeolocationState } from './types'

let self: EventState<GeolocationState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useGeolocation = () => {
        if (!self) self = geolocationEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
