import type { Vec2 } from '../utils'
export interface HoverState<El extends Element = Element> {
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
        isHoverStart: boolean
        isHovering: boolean
        isHoverEnd: boolean
        hover: (self: HoverState) => void
        hoverStart(e: Event): void
        hovering(e: Event): void
        hoverEnd(e: Event): void
        mount(target: El): void
        clean(target?: El): void
        ref(target: El | null): void
}

export type HoverArg<El extends Element = Element> = Partial<HoverState<El>> | HoverState<El>['hover']
