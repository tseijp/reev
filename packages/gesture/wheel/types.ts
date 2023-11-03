import { Vec2 } from '../utils'

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
        onWheel(self: WheelState<El>): void
        onWheelStart(e: Event): void
        onWheeling(e: Event): void
        onWheelEnd(e: Event): void
        onMount(target: Element): void
        onClean(target: null): void
        ref(traget: Element | null): void
        tick?: () => void
}

export type WheelConfig<El extends Element = Element> =
        | Partial<WheelState<El>>
        | WheelState<El>['onWheel']
