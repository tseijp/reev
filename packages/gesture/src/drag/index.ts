import { event } from 'reev'
import { vec2, addV, subV, cpV, getDevice, getClientVec2 } from '../utils'
import type { EventState } from 'reev'
import type { DragState } from './types'

export * from './types'

export const EVENT_FOR_DRAG = {
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

export const dragEvent = <El extends Element = Element>(state: Partial<DragState<El>> = {}) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const drag = () => {
                self.isDragStart = self.active && !self._active
                self.isDragging = self.active && self._active
                self.isDragEnd = !self.active && self._active
        }

        const dragStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                if (self.target.setPointerCapture && 'pointerId' in e)
                        // @ts-ignore
                        self.target.setPointerCapture(e.pointerId)
                self.drag(self)
        }

        const dragging = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.drag(self)
        }

        const dragEnd = (e: Event) => {
                self.event = e
                self.active = false
                initValues()
                if (self.target.releasePointerCapture && 'pointerId' in e)
                        // @ts-ignore
                        self.target.releasePointerCapture(e.pointerId)
                self.drag(self)
        }

        const mount = (target: El) => {
                self.target = target
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                target.addEventListener(start, self.dragStart)
                target.addEventListener(move, self.dragging)
                target.addEventListener(end, self.dragEnd)
                target.addEventListener(up, self.dragEnd)
        }

        const clean = () => {
                const target = self.target
                if (!target) return
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                target.removeEventListener(start, self.dragStart)
                target.removeEventListener(move, self.dragging)
                target.removeEventListener(end, self.dragEnd)
                target.removeEventListener(up, self.dragEnd)
        }

        const ref = (el: El) => {
                self(state as DragState<El>)
                if (el) {
                        self.mount(el)
                } else self.clean(null)
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
                isDragStart: false,
                isDragging: false,
                isDragEnd: false,
                drag,
                dragStart,
                dragging,
                dragEnd,
                mount,
                clean,
                ref,
        }) as EventState<DragState<El>>

        return self
}
