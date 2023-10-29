import { HoverState } from './types'
import { EventState, event } from '@reev/core'
import { vec2, addV, subV, getDevice, getClientVec2, cpV } from '../utils'

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

export const hoverEvent = <El extends Element = Element>(
        state: Partial<HoverState<El>> = {}
) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const onHover = () => {
                self.isHoverStart = !self._active && self.active
                self.isHovering = self._active && self.active
                self.isHoverEnd = self._active && !self.active
        }

        const onHoverStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                self.onHover(self)
        }

        const onHovering = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.onHover(self)
        }

        const onHoverEnd = (e: Event) => {
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.onHover(self)
        }

        const onMount = (target: El) => {
                self.target = target
                initValues()
                const { start, move, end, up } = EVENT_FOR_HOVER[self.device]
                target.addEventListener(start, self.onHoverStart)
                target.addEventListener(move, self.onHovering)
                target.addEventListener(end, self.onHoverEnd)
                target.addEventListener(up, self.onHoverEnd)
        }

        const onClean = (target: El) => {
                if (!target) return
                const { start, move, end, up } = EVENT_FOR_HOVER[self.device]
                target.removeEventListener(start, self.onHoverStart)
                target.removeEventListener(move, self.onHovering)
                target.removeEventListener(end, self.onHoverEnd)
                target.removeEventListener(up, self.onHoverEnd)
        }

        const ref = (target: El | null) => {
                self(state as HoverState<El>)
                if (target) {
                        self.onMount(target)
                } else self.onClean()
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
                onHover,
                onHoverStart,
                onHovering,
                onHoverEnd,
                onMount,
                onClean,
                ref,
        }) as EventState<HoverState<El>>

        return self
}
