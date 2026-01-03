import { event } from 'reev/src'
import { vec2, addV, subV, getDevice, getClientVec2, cpV } from '../utils'
import type { EventState } from 'reev/src'
import type { HoverState } from './types'

export * from './types'

export const EVENT_FOR_HOVER = {
        touch: {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                up: 'touchcancel',
        },
        pointer: {
                start: 'pointerenter',
                move: 'pointermove',
                end: 'pointerleave',
                up: 'pointercancel',
        },
        mouse: {
                start: 'mouseenter',
                move: 'mousemove',
                end: 'mouseleave',
                up: 'mousecancel',
        },
}

export const hoverEvent = <El extends Element = Element>(state: Partial<HoverState<El>> = {}) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const hover = () => {
                self.isHoverStart = !self._active && self.active
                self.isHovering = self._active && self.active
                self.isHoverEnd = self._active && !self.active
        }

        const hoverStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                self.hover(self)
        }

        const hovering = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.hover(self)
        }

        const hoverEnd = (e: Event) => {
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.hover(self)
        }

        const mount = (target: El) => {
                self.target = target
                const { start, move, end, up } = EVENT_FOR_HOVER[self.device]
                target.addEventListener(start, self.hoverStart)
                target.addEventListener(move, self.hovering)
                target.addEventListener(end, self.hoverEnd)
                target.addEventListener(up, self.hoverEnd)
        }

        const clean = () => {
                const target = self.target
                if (!target) return
                const { start, move, end, up } = EVENT_FOR_HOVER[self.device]
                target.removeEventListener(start, self.hoverStart)
                target.removeEventListener(move, self.hovering)
                target.removeEventListener(end, self.hoverEnd)
                target.removeEventListener(up, self.hoverEnd)
        }

        const ref = (target: El | null) => {
                self(state as HoverState<El>)
                if (target) {
                        self.mount(target)
                } else self.clean()
        }

        const self = event({
                _active: false,
                active: false,
                device: getDevice(),
                _value: vec2(0, 0),
                value: vec2(0, 0),
                delta: vec2(0, 0),
                offset: vec2(0, 0),
                movement: vec2(0, 0),
                target: null,
                event: null,
                memo: {},
                isHoverStart: false,
                isHovering: false,
                isHoverEnd: false,
                hover,
                hoverStart,
                hovering,
                hoverEnd,
                mount,
                clean,
                ref,
        }) as EventState<HoverState<El>>

        return self
}
