import type { Vec2 } from '../utils'

export type PinchDevice = 'mouse' | 'pointer' | 'touch' | 'wheel' | 'gesture'

export interface PinchState<El extends Element = Element> {
        device: PinchDevice

        // Lifecycle flags
        active: boolean
        _active: boolean

        // Pinch values: [distance, angle] for touch/pointer, [scale, rotation] for gesture
        value: Vec2
        _value: Vec2
        delta: Vec2
        offset: Vec2 // [cumulativeScale, cumulativeAngle]
        movement: Vec2 // [scaleChange, angleChange] since start

        // Initial values for computing relative changes
        initial: Vec2

        // Origin point (center between two fingers)
        origin: Vec2

        // Touch tracking
        _touchIds: number[]

        // Pointer tracking
        _pointerEvents: Map<number, PointerEvent>

        // Scale (derived from distance change)
        scale: number

        // Rotation turns (for tracking full rotations)
        turns: number

        // Element and event
        target: El
        event: Event | null
        memo: Record<string, unknown>

        // Timeout for wheel end detection
        timeout: number
        clearTimeout: () => void

        // State flags
        isPinchStart: boolean
        isPinching: boolean
        isPinchEnd: boolean

        // Callbacks
        pinch: (self: PinchState<El>) => void
        pinchStart: (e: Event) => void
        pinching: (e: Event) => void
        pinchEnd: (e: Event) => void

        // Lifecycle methods
        mount: (target: El) => void
        clean: () => void
        ref: (el: El | null) => void
}

export type PinchArg<El extends Element = Element> = Partial<PinchState<El>> | PinchState<El>['pinch']
