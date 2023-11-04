import { Vec2 } from '../utils'
import { WheelState } from '../wheel/types'

export type PinchDevice = 'mouse' | 'pointer' | 'touch' | 'wheel' | 'gesture'

export interface PinchState<El extends Element = Element>
        extends WheelState<El> {
        device: PinchDevice
        _rotate: number
        rotate: number
        _size: number
        size: number
        _scale: Vec2
        scale: Vec2

        isPinchStart: boolean
        isPinching: boolean
        isPinchEnd: boolean

        // for SP
        onPinch: (self: PinchState) => void
        onPinchStart(e: Event): void
        onPinching(e: Event): void
        onPinchEnd(e: Event): void
}

export type PinchArg<El extends Element = Element> =
        | Partial<PinchState<El>>
        | PinchState<El>['onPinch']
