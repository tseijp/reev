import { Vec2 } from '../utils'

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
        onDrag(self: DragState<El>): void
        onDragStart(e: Event): void
        onDragging(e: Event): void
        onDragEnd(e: Event): void
        onMount(target: Element): void
        onClean(): void
        ref(traget: Element): void
}

export type DragArg<El extends Element> =
        | Partial<DragState<El>>
        | DragState<El>['onDrag']
