import { batteryEvent } from '.'
import { useSyncExternalStore } from 'react'
import type { BatteryState } from './types'
import type { EventState } from 'reev'

let self: EventState<BatteryState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useBattery = () => {
        if (!self) self = batteryEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
