export type Vec2 = [x: number, y: number]

export interface WheelState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        event: WheelEvent
        memo: any
        isWheelStart: boolean
        isWheeling: boolean
        isWheelEnd: boolean
        onWheel(self: WheelState<El>): void
        onWheelStart(e: WheelEvent): void
        onWheeling(e: WheelEvent): void
        onWheelEnd(e: WheelEvent): void
        onMount(target: Element): void
        onClean(target: null): void
        ref(traget: Element): void
        tick?: () => void
}

export type WheelConfig<El extends Element = Element> =
        | Partial<WheelState<El>>
        | WheelState<El>['onWheel']
