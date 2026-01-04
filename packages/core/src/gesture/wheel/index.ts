import { vec2, addV, cpV } from '../utils'
import { event } from '../../index'
import type { EventState } from '../../index'
import type { WheelState } from './types'
import type { Vec2 } from '../utils'

export * from './types'

const LINE_HEIGHT = 40

const PAGE_HEIGHT = 800

const wheelValues = (event: Event, out: Vec2): Vec2 => {
        if (!(event instanceof WheelEvent)) return vec2(0, 0, out)

        let { deltaX, deltaY, deltaMode } = event
        if (deltaMode === 1) {
                deltaX *= LINE_HEIGHT
                deltaY *= LINE_HEIGHT
        } else if (deltaMode === 2) {
                deltaX *= PAGE_HEIGHT
                deltaY *= PAGE_HEIGHT
        }
        return vec2(deltaX, deltaY, out)
}

export const wheelEvent = <El extends Element = Element>(config?: WheelState) => {
        const initValues = () => {
                vec2(0, 0, self.value)
                vec2(0, 0, self._value)
                vec2(0, 0, self.delta)
                vec2(0, 0, self.movement)
        }

        const wheel = () => {
                self.isWheelStart = self.active && !self._active
                self.isWheeling = self.active && self._active
                self.isWheelEnd = !self.active && self._active
        }
        const wheelStart = (e: WheelEvent) => {
                self.event = e
                self.active = true
                wheelValues(e, self.delta)
                self.wheel(self)
        }

        const wheeling = (e: Event) => {
                // register wheelEnd
                const id = setTimeout(() => self.wheelEnd(e), self.timeout)
                self.clearTimeout()
                self.clearTimeout = () => clearTimeout(id)
                self.event = e
                if (!self.active) {
                        self.wheelStart(e)
                        return
                }

                self._active = self.active
                cpV(self.value, self._value)
                wheelValues(e, self.delta)
                addV(self.offset, self.delta, self.offset)
                addV(self.movement, self.delta, self.movement)
                self.wheel(self)
        }

        const wheelEnd = (e: Event) => {
                self.event = e
                self.active = false
                initValues()
                self.wheel(self)
        }

        const mount = (target: El) => {
                self.target = target
                target.addEventListener('wheel', self.wheeling)
        }

        const clean = () => {
                const target = self.target
                if (!target) return
                target.removeEventListener('wheel', self.wheeling)
        }

        const ref = (el: El | null) => {
                self(config as WheelState<El>)
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
                timeout: 100,
                clearTimeout: () => {},
                memo: {},
                isWheelStart: false,
                isWheeling: false,
                isWheelEnd: false,
                wheel,
                wheelStart,
                wheeling,
                wheelEnd,
                mount,
                clean,
                ref,
        }) as EventState<WheelState<El>>

        return self
}
