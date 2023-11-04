import { EventState, event } from '@reev/core'
import { GeolocationState } from './types'

export const geolocationEvent = () => {
        const onChange = () => {
                navigator.geolocation.getCurrentPosition((geolocation) => {
                        self.geolocation = geolocation
                        self.snapshot = [self]
                        self.callback()
                })
        }

        const onMount = () => {
                self.onChange()
                self.id = navigator.geolocation.watchPosition(self.onChange)
        }

        const onClean = () => {
                if (typeof self.id !== 'undefined')
                        navigator.geolocation.clearWatch(self.id)
        }

        const self = event({
                onChange,
                onMount,
                onClean,
        }) as EventState<GeolocationState>

        self.snapshot = [self]

        return self
}
