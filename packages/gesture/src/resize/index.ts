import { event } from 'reev/src'
import type { EventState } from 'reev/src'
import type { ResizeState } from './types'

export * from './types'

const DELAY = 100

type ResizeEventCallback = (entry: ResizeObserverEntry) => () => void

export const resizeEvent = <El extends Element = Element>(state: ResizeState) => {
        const on: ResizeEventCallback = (entry) => () => {
                // ???
        }

        const mount = (target: El) => {
                const register = (entry: ResizeObserverEntry) => {
                        if (entry.target !== target) return
                        const id = setTimeout(on(entry), DELAY)
                        self.listener()
                        self.listener = () => clearTimeout(id)
                }

                self.observer = new ResizeObserver((entries) => {
                        entries.forEach(register)
                })

                self.observer.observe(target)
        }

        const clean = () => {}

        const ref = (el: El) => {
                self(state)
                if (el) {
                        self.mount(el)
                } else self.clean(null)
        }

        const self = event({
                observer: null,
                listener: () => {},
                resize: () => {},
                mount,
                clean,
                ref,
        }) as EventState<ResizeState<El>>

        return self
}
