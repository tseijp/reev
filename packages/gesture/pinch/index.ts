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

        const pinch = () => {
                self.isPinchStart = !self._active && self.active
                self.isPinching = self._active && self.active
                self.isPinchEnd = self._active && !self.active
        }

        const pinchStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                self.pinch(self)
        }

        const pinching = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.pinch(self)
        }

        const pinchEnd = (e: Event) => {
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.pinch(self)
        }

        const wheelStart = () => {
                self.pinch(self)
        }

        const wheeling = () => {
                self.pinch(self)
        }

        const wheelEnd = () => {
                self.pinch(self)
        }

        const mount = (target: El) => {
                self.target = target
                if (self.device === 'wheel') return
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.addEventListener(start, self.pinchStart)
                target.addEventListener(move, self.pinching)
                target.addEventListener(end, self.pinchEnd)
                target.addEventListener(up, self.pinchEnd)
        }

        const clean = () => {
                const target = self.target
                if (!target || self.device === 'wheel') return
                const { start, move, end, up } = EVENT_FOR_PINCH[self.device]
                target.removeEventListener(start, self.pinchStart)
                target.removeEventListener(move, self.pinching)
                target.removeEventListener(end, self.pinchEnd)
                target.removeEventListener(up, self.pinchEnd)
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
                wheelStart,
                wheeling,
                wheelEnd,
                pinch,
                pinchStart,
                pinching,
                pinchEnd,
                mount,
                clean,
                ref,
        })

        return self
}
