import { EventState, event } from '@reev/core'
import { ClipboardState } from './types'

export const clipboardEvent = () => {
        const onChange = () => {
                navigator.clipboard.readText().then((clipboard) => {
                        self.clipboard = clipboard
                        self.snapshot = [self]
                        self.callback()
                })
        }

        const onMount = () => {
                window.addEventListener('copy', self.onChange)
                window.addEventListener('cut', self.onChange)
                window.addEventListener('paste', self.onChange)
        }

        const onClean = () => {
                window.removeEventListener('copy', self.onChange)
                window.removeEventListener('cut', self.onChange)
                window.removeEventListener('paste', self.onChange)
        }

        const self = event({
                clipboard: '',
                onChange,
                onMount,
                onClean,
        }) as EventState<ClipboardState>

        self.snapshot = [self]

        return self
}
