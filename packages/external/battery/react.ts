import { batteryEvent } from '.'
import { useSyncExternalStore } from 'react'
import { BatteryState } from './types'
import { EventState } from '@reev/core'

let self: EventState<BatteryState>

const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

const getSnapshot = () => self.snapshot

export const useBattery = () => {
        if (!self) self = batteryEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
