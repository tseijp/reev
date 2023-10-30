import { EventState } from '@reev/core'
import { useSyncExternalStore } from 'react'
import { GeolocationState } from './types'
import { geolocationEvent } from '.'

let self: EventState<GeolocationState>

const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

const getSnapshot = () => self.snapshot

export const useGeolocation = () => {
        if (!self) self = geolocationEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
