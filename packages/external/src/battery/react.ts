import { batteryEvent } from '.'
import { useSyncExternalStore } from 'react'
import { BatteryState } from './types'
import { EventState } from 'reev/src'

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
