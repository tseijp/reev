import { EventState, event } from 'reev/src'
import { WindowSizeState } from './types'

export const windowSizeEvent = () => {
        const mount = () => {
                self.change()
                window.addEventListener('resize', self.change)
        }

        const clean = () => {
                window.removeEventListener('resize', self.change)
        }

        const change = () => {
                self.callback()
                self.snapshot = [self]
                self.width = window.innerWidth
                self.height = window.innerHeight
        }

        const self = event({
                width: 1920,
                height: 1080,
                change,
                mount,
                clean,
        }) as EventState<WindowSizeState>

        self.snapshot = [self]

        return self
}
