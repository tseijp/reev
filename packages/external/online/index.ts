import { OnlineState } from './types'
import { EventState, event } from 'reev'

export const onlineEvent = () => {
        const change = () => {
                self.online = navigator.onLine
                self.snapshot = [self]
                self.callback()
        }

        const mount = () => {
                self.change()
                window.addEventListener('online', self.change)
                window.addEventListener('offline', self.change)
        }
        const clean = () => {
                window.removeEventListener('online', self.change)
                window.removeEventListener('offline', self.change)
        }
        const self = event({
                change,
                mount,
                clean,
        }) as EventState<OnlineState>

        self.snapshot = [self]

        return self
}
