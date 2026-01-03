import { EventState, event } from 'reev/src'
import { PinchState } from './types'
import { vec2, addV, subV, cpV } from '../utils'
import { pinchDevice, touchDistanceAngle, pointerDistanceAngle, getCurrentTargetTouchIds, wheelPinchDelta, WebKitGestureEvent, DistanceAngle } from './utils'

export const EVENT_FOR_PINCH = {
        touch: {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend',
                cancel: 'touchcancel',
        },
        pointer: {
                start: 'pointerdown',
                move: 'pointermove',
                end: 'pointerup',
                cancel: 'pointercancel',
        },
        gesture: {
                start: 'gesturestart',
                change: 'gesturechange',
                end: 'gestureend',
        },
}

export const pinchEvent = <El extends Element = Element>(config: Partial<PinchState<El>> = {}) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const pinch = () => {
                self.isPinchStart = self.active && !self._active
                self.isPinching = self.active && self._active
                self.isPinchEnd = !self.active && self._active
        }

        // ===== Common pinch handlers =====

        const pinchStart = (e: Event, payload: DistanceAngle) => {
                self.event = e
                self.active = true

                // Store initial values [distance, angle]
                vec2(payload.distance, payload.angle, self.value)
                vec2(payload.distance, payload.angle, self.initial)
                cpV(payload.origin, self.origin)

                self.scale = 1
                self.turns = 0

                self.pinch(self)
        }

        const pinching = (e: Event, payload: DistanceAngle) => {
                if (!self.active) return

                self.event = e
                self._active = self.active

                // Store previous values
                cpV(self.value, self._value)

                // Current values [distance, angle]
                const prevAngle = self._value[1]
                let newAngle = payload.angle

                // Handle angle wrapping (for full rotations)
                const deltaAngle = newAngle - prevAngle
                if (Math.abs(deltaAngle) > 270) {
                        self.turns += Math.sign(deltaAngle)
                        newAngle -= 360 * Math.sign(deltaAngle)
                }

                vec2(payload.distance, newAngle, self.value)
                cpV(payload.origin, self.origin)

                // Calculate movement: [scaleRatio - 1, angleDelta]
                // scaleRatio = currentDistance / initialDistance
                const scaleRatio = self.value[0] / self.initial[0] - 1
                const angleDelta = self.value[1] - self.initial[1]
                vec2(scaleRatio, angleDelta, self.movement)

                // Calculate delta from previous frame
                subV(self.value, self._value, self.delta)
                // Convert distance delta to scale delta for consistency
                self.delta[0] = self._value[0] !== 0 ? self.value[0] / self._value[0] - 1 : 0

                // Update offset (cumulative)
                addV(self.offset, self.delta, self.offset)

                // Update scale
                self.scale = self.initial[0] !== 0 ? self.value[0] / self.initial[0] : 1

                self.pinch(self)
        }

        const pinchEnd = (e: Event) => {
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.pinch(self)
        }

        // ===== Touch event handlers =====

        const touchStart = (e: TouchEvent) => {
                const touchIds = getCurrentTargetTouchIds(e)

                if (self.active) {
                        // Check if the touches that started the gesture are still present
                        if (self._touchIds.every((id) => touchIds.includes(id))) return
                }

                if (touchIds.length < 2) return

                // Store the first two touch ids
                self._touchIds = touchIds.slice(0, 2)

                const payload = touchDistanceAngle(e, self._touchIds)
                if (!payload) return

                pinchStart(e, payload)
        }

        const touchMove = (e: TouchEvent) => {
                if (!self.active) return

                const payload = touchDistanceAngle(e, self._touchIds)
                if (!payload) return

                pinching(e, payload)
        }

        const touchEnd = (e: TouchEvent) => {
                if (!self.active) return

                // Check if any of our tracked touches ended
                const currentTouchIds = Array.from(e.touches).map((t) => t.identifier)
                if (self._touchIds.some((id) => !currentTouchIds.includes(id))) {
                        pinchEnd(e)
                }
        }

        // ===== Pointer event handlers =====

        const pointerStart = (e: PointerEvent) => {
                // Only track left mouse button or touch
                if (e.buttons != null && e.buttons % 2 !== 1) return

                const _pointerEvents = self._pointerEvents

                if (self.active) {
                        // Check if the pointers that started the gesture are still present
                        if (Array.from(_pointerEvents.keys()).every((id) => self._pointerEvents.has(id))) return
                }

                // Capture the pointer
                try {
                        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
                } catch {}

                if (_pointerEvents.size < 2) {
                        _pointerEvents.set(e.pointerId, e)
                }

                if (_pointerEvents.size < 2) return

                const payload = pointerDistanceAngle(_pointerEvents)
                if (!payload) return

                pinchStart(e, payload)
        }

        const pointerMove = (e: PointerEvent) => {
                const _pointerEvents = self._pointerEvents

                if (_pointerEvents.has(e.pointerId)) {
                        _pointerEvents.set(e.pointerId, e)
                }

                if (!self.active) return

                const payload = pointerDistanceAngle(_pointerEvents)
                if (!payload) return

                pinching(e, payload)
        }

        const pointerEnd = (e: PointerEvent) => {
                try {
                        ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
                } catch {}

                const _pointerEvents = self._pointerEvents

                if (_pointerEvents.has(e.pointerId)) {
                        _pointerEvents.delete(e.pointerId)
                }

                if (!self.active) return

                if (_pointerEvents.size < 2) {
                        pinchEnd(e)
                }
        }

        // ===== Safari Gesture event handlers =====

        const gestureStart = (e: Event) => {
                const ge = e as WebKitGestureEvent
                if (e.cancelable) e.preventDefault()

                if (self.active) return

                self.event = e
                self.active = true

                // GestureEvent provides scale and rotation directly
                vec2(ge.scale, ge.rotation, self.value)
                vec2(ge.scale, ge.rotation, self.initial)
                vec2(ge.clientX, ge.clientY, self.origin)

                self.scale = 1
                self.turns = 0

                self.pinch(self)
        }

        const gestureChange = (e: Event) => {
                const ge = e as WebKitGestureEvent
                if (e.cancelable) e.preventDefault()

                if (!self.active) return

                self.event = e
                self._active = self.active

                cpV(self.value, self._value)

                // GestureEvent gives us scale and rotation directly
                vec2(ge.scale, ge.rotation, self.value)
                vec2(ge.clientX, ge.clientY, self.origin)

                // movement = [scale - 1, rotation]
                vec2(ge.scale - 1, ge.rotation, self.movement)

                // delta from previous
                subV(self.value, self._value, self.delta)

                // Update offset
                addV(self.offset, self.delta, self.offset)

                self.scale = ge.scale

                self.pinch(self)
        }

        const gestureEnd = (e: Event) => {
                if (!self.active) return
                pinchEnd(e)
        }

        // ===== Wheel event handlers (trackpad pinch fallback) =====

        const wheelStart = (e: WheelEvent) => {
                self.event = e
                self.active = true

                // For wheel, we track scale change as value[0], rotation as value[1] (always 0)
                vec2(1, 0, self.value)
                vec2(1, 0, self.initial)
                vec2(e.clientX, e.clientY, self.origin)

                self.scale = 1
                self.turns = 0

                // Apply the initial wheel delta
                const scaleDelta = wheelPinchDelta(e, self.offset[0] + 1)
                self.delta[0] = scaleDelta
                self.delta[1] = 0
                self.value[0] += scaleDelta
                addV(self.offset, self.delta, self.offset)
                vec2(self.value[0] - 1, 0, self.movement)

                self.scale = self.value[0]

                self.pinch(self)
        }

        const wheeling = (e: WheelEvent) => {
                // Set up timeout to detect wheel end
                const id = setTimeout(() => wheelEnd(e), self.timeout)
                self.clearTimeout()
                self.clearTimeout = () => clearTimeout(id)

                if (!self.active) {
                        wheelStart(e)
                        return
                }

                self.event = e
                self._active = self.active

                cpV(self.value, self._value)
                vec2(e.clientX, e.clientY, self.origin)

                // Calculate scale delta from wheel
                const scaleDelta = wheelPinchDelta(e, self.offset[0] + 1)
                self.delta[0] = scaleDelta
                self.delta[1] = 0

                self.value[0] += scaleDelta
                addV(self.offset, self.delta, self.offset)
                vec2(self.value[0] - 1, 0, self.movement)

                self.scale = self.value[0]

                self.pinch(self)
        }

        const wheelEnd = (e: Event) => {
                if (!self.active) return
                self.event = e
                self._active = true
                self.active = false
                initValues()
                self.pinch(self)
        }

        // ===== Lifecycle methods =====

        const mount = (target: El) => {
                self.target = target
                const device = self.device

                if (device === 'wheel') {
                        target.addEventListener('wheel', wheeling as EventListener, { passive: false })
                } else if (device === 'gesture') {
                        const events = EVENT_FOR_PINCH.gesture
                        target.addEventListener(events.start, gestureStart)
                        target.addEventListener(events.change, gestureChange)
                        target.addEventListener(events.end, gestureEnd)
                } else if (device === 'touch') {
                        const events = EVENT_FOR_PINCH.touch
                        target.addEventListener(events.start, touchStart as EventListener)
                        target.addEventListener(events.move, touchMove as EventListener)
                        target.addEventListener(events.end, touchEnd as EventListener)
                        target.addEventListener(events.cancel, touchEnd as EventListener)
                } else if (device === 'pointer') {
                        const events = EVENT_FOR_PINCH.pointer
                        target.addEventListener(events.start, pointerStart as EventListener)
                        target.addEventListener(events.move, pointerMove as EventListener)
                        target.addEventListener(events.end, pointerEnd as EventListener)
                        target.addEventListener(events.cancel, pointerEnd as EventListener)
                }
        }

        const clean = () => {
                const target = self.target
                if (!target) return
                const device = self.device

                if (device === 'wheel') {
                        target.removeEventListener('wheel', wheeling as EventListener)
                } else if (device === 'gesture') {
                        const events = EVENT_FOR_PINCH.gesture
                        target.removeEventListener(events.start, gestureStart)
                        target.removeEventListener(events.change, gestureChange)
                        target.removeEventListener(events.end, gestureEnd)
                } else if (device === 'touch') {
                        const events = EVENT_FOR_PINCH.touch
                        target.removeEventListener(events.start, touchStart as EventListener)
                        target.removeEventListener(events.move, touchMove as EventListener)
                        target.removeEventListener(events.end, touchEnd as EventListener)
                        target.removeEventListener(events.cancel, touchEnd as EventListener)
                } else if (device === 'pointer') {
                        const events = EVENT_FOR_PINCH.pointer
                        target.removeEventListener(events.start, pointerStart as EventListener)
                        target.removeEventListener(events.move, pointerMove as EventListener)
                        target.removeEventListener(events.end, pointerEnd as EventListener)
                        target.removeEventListener(events.cancel, pointerEnd as EventListener)
                }
        }

        const ref = (el: El | null) => {
                self(config as PinchState<El>)
                if (el) {
                        self.mount(el)
                } else self.clean()
        }

        const self = event({
                _active: false,
                active: false,
                device: pinchDevice(),
                _value: vec2(0, 0),
                value: vec2(0, 0),
                delta: vec2(0, 0),
                offset: vec2(0, 0),
                movement: vec2(0, 0),
                initial: vec2(0, 0),
                origin: vec2(0, 0),
                _touchIds: [] as number[],
                _pointerEvents: new Map<number, PointerEvent>(),
                scale: 1,
                turns: 0,
                target: null as unknown as El,
                event: null as unknown as Event,
                memo: {},
                timeout: 100,
                clearTimeout: () => {},
                isPinchStart: false,
                isPinching: false,
                isPinchEnd: false,
                pinch,
                pinchStart: (e: Event) => {
                        // This is called externally, need to detect device and delegate
                        if (self.device === 'touch') touchStart(e as TouchEvent)
                        else if (self.device === 'pointer') pointerStart(e as PointerEvent)
                        else if (self.device === 'gesture') gestureStart(e)
                        else if (self.device === 'wheel') wheeling(e as WheelEvent)
                },
                pinching: (e: Event) => {
                        if (self.device === 'touch') touchMove(e as TouchEvent)
                        else if (self.device === 'pointer') pointerMove(e as PointerEvent)
                        else if (self.device === 'gesture') gestureChange(e)
                        else if (self.device === 'wheel') wheeling(e as WheelEvent)
                },
                pinchEnd: (e: Event) => {
                        if (self.device === 'touch') touchEnd(e as TouchEvent)
                        else if (self.device === 'pointer') pointerEnd(e as PointerEvent)
                        else if (self.device === 'gesture') gestureEnd(e)
                        else if (self.device === 'wheel') wheelEnd(e)
                },
                mount,
                clean,
                ref,
        }) as EventState<PinchState<El>>

        return self
}
