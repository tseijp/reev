import { EventState, event } from 'reev/src'
import { OrientState } from './types'
import { addVec3, subVec3, vec3 } from './utils'

export * from './types'

export const orientEvent = () => {
        const initValues = () => {
                self.active = self._active = false
                vec3(0, 0, 0, self.value)
                vec3(0, 0, 0, self._value)
                vec3(0, 0, 0, self.delta)
                vec3(0, 0, 0, self.movement)
        }

        const change = (e: any) => {
                self._active = self.active
                self._value = self.value
                self.value = [90 - (e.alpha ?? 90), e.beta ?? 0, e.gamma ?? 0]
                if (self._active) {
                        subVec3(self.value, self._value, self.delta)
                        addVec3(self.offset, self.delta, self.offset)
                        addVec3(self.offset, self.delta, self.movement)
                }
                self.snapshot = [self]
                self.callback()
        }

        const mount = () => {
                initValues()
                self.active = true
                window.addEventListener('deviceorientation', self.change)
        }

        const clean = () => {
                initValues()
                window.removeEventListener('deviceorientation', self.change)
        }

        const self = event({
                active: false,
                _active: false,
                _value: vec3(),
                value: vec3(),
                delta: vec3(),
                offset: vec3(),
                movement: vec3(),
                mount,
                clean,
                change,
        }) as EventState<OrientState>

        self.snapshot = [self]

        return self
}
