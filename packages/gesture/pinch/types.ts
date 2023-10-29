export type Vec2 = [x: number, y: number]

export interface PinchState<El extends Element = Element> {
        _active: boolean
        active: boolean
        device: 'mouse' | 'pointer' | 'touch'
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        event: Event
        target: El
        isPinchStart: boolean
        isPinching: boolean
        isPinchEnd: boolean
        onPinch: (self: PinchState) => void
        onPinchStart(e: Event): void
        onPinching(e: Event): void
        onPinchEnd(e: Event): void
        onMount(target: El): void
        onClean(target?: El): void
        ref(target: El | null): void
}

export type PinchArg<El extends Element = Element> =
        | Partial<PinchState<El>>
        | PinchState<El>['onPinch']
