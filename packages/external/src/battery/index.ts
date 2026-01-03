import { EventState, event } from 'reev/src'
import { BatteryState } from './types'

export * from './types'

export const batteryEvent = () => {
        const change = async () => {
                // @ts-ignore
                const battery = await navigator.getBattery()
                self.level = battery.level
                self.charging = battery.charging
                self.chargingTime = battery.chargingTime
                self.dischargingTime = battery.dischargingTime
                self.snapshot = [self]
                self.callback()
        }

        const mount = () => {
                // @ts-ignore
                navigator.getBattery().then((target: any) => {
                        self.target = target
                        target.addEventListener('levelchange', self.change)
                        target.addEventListener('chargingchange', self.change)
                })
                self.change()
        }

        const clean = () => {
                const target = self.target
                if (!target) return
                target.removeEventListener('levelchange', self.change)
                target.removeEventListener('chargingchange', self.change)
        }

        const self = event({
                change,
                mount,
                clean,
        }) as EventState<BatteryState>

        self.snapshot = [self]

        return self
}
