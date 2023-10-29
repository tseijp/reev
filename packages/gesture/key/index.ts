import { event } from '@reev/core'
import { KeyState } from './types'

export const keyEvent = <El extends Element = Element>(
        state: Partial<KeyState<El>> = {}
) => {
        const onKeydown = (e: KeyboardEvent) => {
                self.event = e
                self.key = e.key
                self.code = e.code
                self.onKey?.(self)
        }

        const onMount = (el: El | Window) => {
                if (!el) el = el || window
                self.target = el

                // @ts-ignore set tabindex to make element focusable
                el.setAttribute('tabindex', '1') // @ts-ignore
                el.addEventListener('keydown', self.onKeydown)
        }

        const onClean = () => {
                const el = self.target
                if (!el) return // @ts-ignore
                el.removeEventListener('keydown', self.onKeydown)
        }

        const ref = (el: Element | null) => {
                self(state)
                if (el) self.onMount(el as El)
                else self.onClean()
        }

        const self = event<KeyState<El>>({ onKeydown, onMount, onClean, ref })
        return self
}
