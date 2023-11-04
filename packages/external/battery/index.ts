import { EventState, event } from 'reev'
import { BatteryState } from './types'

export const batteryEvent = () => {
        const onChange = async () => {
                // @ts-ignore
                const battery = await navigator.getBattery()
                self.level = battery.level
                self.charging = battery.charging
                self.chargingTime = battery.chargingTime
                self.dischargingTime = battery.dischargingTime
                self.snapshot = [self]
                self.callback()
        }

        const onMount = () => {
                // @ts-ignore
                navigator.getBattery().then((target: any) => {
                        self.target = target
                        target.addEventListener('levelchange', self.onChange)
                        target.addEventListener('chargingchange', self.onChange)
                })
                self.onChange()
        }

        const onClean = () => {
                const target = self.target
                if (!target) return
                target.removeEventListener('levelchange', self.onChange)
                target.removeEventListener('chargingchange', self.onChange)
        }

        const self = event({
                onChange,
                onMount,
                onClean,
        }) as EventState<BatteryState>

        self.snapshot = [self]

        return self
}
