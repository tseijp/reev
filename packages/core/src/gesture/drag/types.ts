import type { Vec2 } from '../utils'

export type DragDevice = 'mouse' | 'touch' | 'pointer'

export interface DragState<El extends Element = Element> {
        _active: boolean
        active: boolean
        device: DragDevice
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        event: Event
        memo: any
        isDragStart: boolean
        isDragging: boolean
        isDragEnd: boolean
        drag(self: DragState<El>): void
        dragStart(e: Event): void
        dragging(e: Event): void
        dragEnd(e: Event): void
        mount(target: El): void
        clean(el: null): void
        ref(traget: El | null): void
}

export type DragArg<El extends Element> = Partial<DragState<El>> | DragState<El>['drag']
