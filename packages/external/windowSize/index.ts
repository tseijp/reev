import { EventState, event } from '@reev/core'
import { WindowSizeState } from './types'

export const windowSizeEvent = () => {
        const onMount = () => {
                self.onChange()
                window.addEventListener('resize', self.onChange)
        }

        const onClean = () => {
                window.removeEventListener('resize', self.onChange)
        }

        const onChange = () => {
                self.callback()
                self.snapshot = [self]
                self.width = window.innerWidth
                self.height = window.innerHeight
        }

        const self = event({
                width: 1920,
                height: 1080,
                onChange,
                onMount,
                onClean,
        }) as EventState<WindowSizeState>

        self.snapshot = [self]

        return self
}
