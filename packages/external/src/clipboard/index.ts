import { EventState, event } from 'reev/src'
import { ClipboardState } from './types'

export * from './types'

export const clipboardEvent = () => {
        const change = () => {
                navigator.clipboard.readText().then((clipboard) => {
                        self.clipboard = clipboard
                        self.snapshot = [self]
                        self.callback()
                })
        }

        const mount = () => {
                window.addEventListener('copy', self.change)
                window.addEventListener('cut', self.change)
                window.addEventListener('paste', self.change)
        }

        const clean = () => {
                window.removeEventListener('copy', self.change)
                window.removeEventListener('cut', self.change)
                window.removeEventListener('paste', self.change)
        }

        const self = event({
                clipboard: '',
                change,
                mount,
                clean,
        }) as EventState<ClipboardState>

        self.snapshot = [self]

        return self
}
