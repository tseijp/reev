import { EventState, event } from 'reev'
import { ResizeState } from './types'

const DELAY = 100

type ResizeEventCallback = (entry: ResizeObserverEntry) => () => void

export const resizeEvent = <El extends Element = Element>(
        state: ResizeState
) => {
        const on: ResizeEventCallback = (entry) => () => {
                // ???
        }

        const onMount = (target: El) => {
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

        const onClean = () => {}

        const ref = (el: El) => {
                self(state)
                if (el) {
                        self.onMount(el)
                } else self.onClean(null)
        }

        const self = event({
                observer: null,
                listener: () => {},
                onResize: () => {},
                onMount,
                onClean,
                ref,
        }) as EventState<ResizeState<El>>

        return self
}
