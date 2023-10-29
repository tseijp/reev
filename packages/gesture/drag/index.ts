import { EventState, event } from '@reev/core'
import { DragState } from './types'
import { vec2, addV, subV, cpV, getDevice, getClientVec2 } from '../utils'

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

export const dragEvent = <El extends Element = Element>(
        state: Partial<DragState<El>> = {}
) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const onDrag = () => {
                self.isDragStart = self.active && !self._active
                self.isDragging = self.active && self._active
                self.isDragEnd = !self.active && self._active
        }

        const onDragStart = (e: Event) => {
                self.event = e
                self.active = true
                getClientVec2(e, self.device, self.value)
                if (self.target.setPointerCapture && 'pointerId' in e)
                        self.target.setPointerCapture(e.pointerId as 1)
                self.onDrag(self)
        }

        const onDragging = (e: Event) => {
                self.event = e
                self._active = self.active
                cpV(self.value, self._value)
                getClientVec2(e, self.device, self.value)
                if (self._active) {
                        subV(self.value, self._value, self.delta)
                        addV(self.offset, self.delta, self.offset)
                        addV(self.movement, self.delta, self.movement)
                }
                self.onDrag(self)
        }

        const onDragEnd = (e: Event) => {
                self.event = e
                self.active = false
                initValues()
                if (self.target.releasePointerCapture && 'pointerId' in e)
                        self.target.releasePointerCapture(e.pointerId as 1)
                self.onDrag(self)
        }

        const onMount = (target: El) => {
                self.target = target
                initValues()
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                target.addEventListener(start, self.onDragStart)
                target.addEventListener(move, self.onDragging)
                target.addEventListener(end, self.onDragEnd)
                target.addEventListener(up, self.onDragEnd)
        }

        const onClean = () => {
                const target = self.target
                const { start, move, end, up } = EVENT_FOR_DRAG[self.device]
                if (!target) return
                target.removeEventListener(start, self.onDragStart)
                target.removeEventListener(move, self.onDragging)
                target.removeEventListener(end, self.onDragEnd)
                target.removeEventListener(up, self.onDragEnd)
        }

        const ref = (el: El) => {
                self(state as DragState<El>)
                if (el) {
                        self.onMount(el)
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
                isDragStart: false,
                isDragging: false,
                isDragEnd: false,
                onDrag,
                onDragStart,
                onDragging,
                onDragEnd,
                onMount,
                onClean,
                ref,
        }) as EventState<DragState<El>>

        return self
}
