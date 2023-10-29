import { PinchState } from './types'
import { EventState, event } from '@reev/core'
import { vec2, addV, subV, getDevice, getClientVec2, cpV } from '../utils'

export const EVENT_FOR_PINCH = {
        touch: {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                up: 'touchcancel',
        },
        pointer: {
                start: 'pointerdown',
                move: 'pointermove',
                end: 'pointerup',
                up: 'pointercancel',
        },
        mouse: {
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup',
                up: 'mousecancel',
        },
}

export const pinchEvent = <El extends Element = Element>(
        state: Partial<PinchState<El>> = {}
) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const onPinch = () => {
                self.isPinchStart = !self._active && self.active
                self.isPinching = self._active && self.active
                self.isPinchEnd = self._active && !self.active
        }

        const onPinchStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                self.onPinch(self)
        }

        const onPinching = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.onPinch(self)
        }

        const onPinchEnd = (e: Event) => {
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.onPinch(self)
        }

        const onMount = (target: El) => {
                self.target = target
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.addEventListener(start, self.onPinchStart)
                target.addEventListener(move, self.onPinching)
                target.addEventListener(end, self.onPinchEnd)
                target.addEventListener(up, self.onPinchEnd)
        }

        const onClean = (target: El) => {
                if (!target) return
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.removeEventListener(start, self.onPinchStart)
                target.removeEventListener(move, self.onPinching)
                target.removeEventListener(end, self.onPinchEnd)
                target.removeEventListener(up, self.onPinchEnd)
        }

        const ref = (target: El | null) => {
                self(state as PinchState<El>)
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
                isPinchStart: false,
                isPinching: false,
                isPinchEnd: false,
                onPinch,
                onPinchStart,
                onPinching,
                onPinchEnd,
                onMount,
                onClean,
                ref,
        }) as EventState<PinchState<El>>

        return self
}
