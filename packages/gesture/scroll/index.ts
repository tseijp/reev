import { vec2, addV, subV, cpV, getDevice, getClientVec2 } from '../utils'
import { scrollValues } from './utils'
import { EventState, event } from '@reev/core'
import { ScrollState } from './types'

export const scrollEvent = <El extends Element = Element>(
        config?: ScrollState
) => {
        const onScroll = () => {
                self.isScrollStart = self.active && !self._active
                self.isScrolling = self.active && self._active
                self.isScrollEnd = !self.active && self._active
        }
        const onScrollStart = (e: Event) => {
                self.active = true
                scrollValues(e, self.delta)
                self.onScroll(self)
        }

        const onScrolling = (e: Event) => {
                // register onScrollEnd
                const id = setTimeout(self.onScrollEnd, 1000)
                const tick = () => {
                        self({ tick })
                        clearTimeout(id)
                }
                self({ tick })

                e.preventDefault()
                self.event = e
                if (!self.active) {
                        self.onScrollStart(e)
                        return
                }

                self._active = self.active
                cpV(self.value, self._value)
                scrollValues(e, self.delta)
                addV(self.offset, self.delta, self.offset)
                addV(self.movement, self.delta, self.movement)
                self.onScroll(self)
        }

        const onScrollEnd = (_e: Event) => {
                self.active = false
                self.delta = self.movement = [0, 0]
                self.onScroll(self)
        }

        const onMount = (target: El) => {
                self.target = target
                target.addEventListener('scroll', self.onScrolling)
        }

        const onClean = () => {
                const target = self.target
                if (!target) return
                // @ts-ignore
                target.removeEventListener('scroll', self.onScrolling)
        }

        const ref = (el: Element | null) => {
                self(config as ScrollState<El>)
                if (el) {
                        self.onMount(el)
                } else self.onClean(null)
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
                isScrollStart: false,
                isScrolling: false,
                isScrollEnd: false,
                onScroll,
                onScrollStart,
                onScrolling,
                onScrollEnd,
                onMount,
                onClean,
                ref,
        }) as EventState<ScrollState<El>>

        return self
}
