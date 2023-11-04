import { EventState } from 'reev'
import { pinchDevice } from './utils'
import { PinchState } from './types'
import { vec2, addV, subV, getClientVec2, cpV } from '../utils'
import { wheelEvent } from '../wheel'

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
        const self = wheelEvent() as unknown as EventState<PinchState<El>>

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

        const onWheelStart = () => {
                self.onPinch(self)
        }

        const onWheeling = () => {
                self.onPinch(self)
        }

        const onWheelEnd = () => {
                self.onPinch(self)
        }

        const onMount = (target: El) => {
                self.target = target
                if (self.device === 'wheel') return
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.addEventListener(start, self.onPinchStart)
                target.addEventListener(move, self.onPinching)
                target.addEventListener(end, self.onPinchEnd)
                target.addEventListener(up, self.onPinchEnd)
        }

        const onClean = () => {
                const target = self.target
                if (!target || self.device === 'wheel') return
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.removeEventListener(start, self.onPinchStart)
                target.removeEventListener(move, self.onPinching)
                target.removeEventListener(end, self.onPinchEnd)
                target.removeEventListener(up, self.onPinchEnd)
        }

        const ref = () => {
                self(state as PinchState<El>)
        }

        self({
                _active: false,
                active: false,
                device: pinchDevice(),
                _rotate: 0,
                rotate: 0,
                _size: 1,
                size: 1,
                _scale: vec2(1, 1),
                scale: vec2(1, 1),
                _value: vec2(),
                value: vec2(),
                delta: vec2(),
                offset: vec2(),
                movement: vec2(),
                target: null as unknown as El,
                event: null as unknown as any,
                memo: {},
                isPinchStart: false,
                isPinching: false,
                isPinchEnd: false,
                onWheelStart,
                onWheeling,
                onWheelEnd,
                onPinch,
                onPinchStart,
                onPinching,
                onPinchEnd,
                onMount,
                onClean,
                ref,
        })

        return self
}
