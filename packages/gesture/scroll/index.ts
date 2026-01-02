import { vec2, addV, cpV, subV } from '../utils'
import { scrollValues } from './utils'
import { EventState, event } from 'reev'
import { ScrollState } from './types'

export const scrollEvent = <El extends Element = Element>(config?: ScrollState) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const scroll = () => {
                self.isScrollStart = self.active && !self._active
                self.isScrolling = self.active && self._active
                self.isScrollEnd = !self.active && self._active
        }

        const scrollStart = (e: Event) => {
                self.event = e
                self.active = true
                scrollValues(e, self.value)
                self.scroll(self)
        }

        const scrolling = (e: Event) => {
                // register wheelEnd
                const id = setTimeout(() => self.scrollEnd(e), self.timeout)
                self.clearTimeout()
                self.clearTimeout = () => clearTimeout(id)

                if (!self.active) {
                        self.scrollStart(e)
                        return
                }

                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                scrollValues(e, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.scroll(self)
        }

        const scrollEnd = (e: Event) => {
                self.event = e
                self.active = false
                initValues()
                self.scroll(self)
        }

        const mount = (target: El) => {
                self.target = target // @TODO set event to target
                window.addEventListener('scroll', self.scrolling)
        }

        const clean = () => {
                window.removeEventListener('scroll', self.scrolling)
        }

        const ref = (el: Element | null) => {
                self(config as ScrollState<El>)
                if (el) {
                        self.mount(el)
                } else self.clean(null)
        }

        const self = event({
                active: false,
                _active: false,
                _value: vec2(0, 0),
                value: vec2(0, 0),
                delta: vec2(0, 0),
                offset: vec2(0, 0),
                movement: vec2(0, 0),
                target: null,
                event: null,
                memo: {},
                timeout: 100,
                clearTimeout: () => {},
                isScrollStart: false,
                isScrolling: false,
                isScrollEnd: false,
                scroll,
                scrollStart,
                scrolling,
                scrollEnd,
                mount,
                clean,
                ref,
        }) as EventState<ScrollState<El>>

        return self
}
