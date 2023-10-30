import { OnlineState } from './types'
import { EventState, event } from '@reev/core'

export const onlineEvent = () => {
        const onChange = () => {
                self.online = navigator.onLine
                self.snapshot = [self]
                self.callback()
        }

        const onMount = () => {
                self.onChange()
                window.addEventListener('online', self.onChange)
                window.addEventListener('offline', self.onChange)
        }
        const onClean = () => {
                window.removeEventListener('online', self.onChange)
                window.removeEventListener('offline', self.onChange)
        }
        const self = event({
                onChange,
                onMount,
                onClean,
        }) as EventState<OnlineState>

        self.snapshot = [self]

        return self
}
