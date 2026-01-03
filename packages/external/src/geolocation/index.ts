import { EventState, event } from 'reev/src'
import { GeolocationState } from './types'

export const geolocationEvent = () => {
        const change = () => {
                navigator.geolocation.getCurrentPosition((geolocation) => {
                        self.geolocation = geolocation
                        self.snapshot = [self]
                        self.callback()
                })
        }

        const mount = () => {
                self.change()
                self.id = navigator.geolocation.watchPosition(self.change)
        }

        const clean = () => {
                if (typeof self.id !== 'undefined') navigator.geolocation.clearWatch(self.id)
        }

        const self = event({
                change,
                mount,
                clean,
        }) as EventState<GeolocationState>

        self.snapshot = [self]

        return self
}
