import { vec2, addV, subV, cpV, getDevice, getClientVec2 } from '../utils'
import { wheelValues } from './utils'
import { EventState, event } from '@reev/core'
import { WheelState } from './types'

export const wheelEvent = <El extends Element = Element>(
        config?: WheelState
) => {
        const onWheel = () => {
                self.isWheelStart = self.active && !self._active
                self.isWheeling = self.active && self._active
                self.isWheelEnd = !self.active && self._active
        }
        const onWheelStart = (e: WheelEvent) => {
                self.active = true
                wheelValues(e, self.delta)
                self.onWheel(self)
        }

        const onWheeling = (e: WheelEvent) => {
                // register onWheelEnd
                const id = setTimeout(self.onWheelEnd, 1000)
                const tick = () => {
                        self({ tick })
                        clearTimeout(id)
                }
                self({ tick })

                e.preventDefault()
                self.event = e
                if (!self.active) {
                        self.onWheelStart(e)
                        return
                }

                self._active = self.active
                cpV(self.value, self._value)
                wheelValues(e, self.delta)
                addV(self.offset, self.delta, self.offset)
                addV(self.movement, self.delta, self.movement)
                self.onWheel(self)
        }

        const onWheelEnd = (_e: WheelEvent) => {
                self.active = false
                self.delta = self.movement = [0, 0]
                self.onWheel(self)
        }

        const onMount = (target: El) => {
                self.target = target
                // @ts-ignore
                target.addEventListener('wheel', self.onWheeling)
        }

        const onClean = () => {
                const target = self.target
                if (!target) return
                // @ts-ignore
                target.removeEventListener('wheel', self.onWheeling)
        }

        const ref = (el: Element | null) => {
                self(config as WheelState<El>)
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
                isWheelStart: false,
                isWheeling: false,
                isWheelEnd: false,
                onWheel,
                onWheelStart,
                onWheeling,
                onWheelEnd,
                onMount,
                onClean,
                ref,
        }) as EventState<WheelState<El>>

        return self
}
