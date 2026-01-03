import type { Vec2 } from '../utils'

export interface WheelState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        event: Event
        timeout: number
        clearTimeout(): void
        memo: any
        isWheelStart: boolean
        isWheeling: boolean
        isWheelEnd: boolean
        wheel(self: WheelState<El>): void
        wheelStart(e: Event): void
        wheeling(e: Event): void
        wheelEnd(e: Event): void
        mount(target: El): void
        clean(target: null): void
        ref(traget: El | null): void
        tick?: () => void
}

export type WheelConfig<El extends Element = Element> = Partial<WheelState<El>> | WheelState<El>['wheel']
