import { event } from 'reev'
import { KeyState } from './types'

export const keyEvent = <El extends Element = Element>(state: Partial<KeyState<El>> = {}) => {
        const keydown = (e: KeyboardEvent) => {
                self.event = e
                self.pressedKey = e.key
                self.code = e.code
                self.key?.(self)
        }

        const mount = (el: El | Window) => {
                if (!el) el = el || window
                self.target = el

                // @ts-ignore set tabindex to make element focusable
                el.setAttribute('tabindex', '1') // @ts-ignore
                el.addEventListener('keydown', self.keydown)
        }

        const clean = () => {
                const el = self.target
                if (!el) return // @ts-ignore
                el.removeEventListener('keydown', self.keydown)
        }

        const ref = (el: Element | null) => {
                self(state)
                if (el) self.mount(el as El)
                else self.clean()
        }

        const self = event<KeyState<El>>({ keydown, mount, clean, ref })
        return self
}
