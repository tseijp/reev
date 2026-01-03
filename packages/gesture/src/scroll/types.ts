import type { Vec2 } from '../utils'

export interface ScrollState<El extends Element = Element> {
        _active: boolean
        active: boolean
        _value: Vec2
        value: Vec2
        delta: Vec2
        offset: Vec2
        movement: Vec2
        target: El
        event: Event
        memo: any
        isScrollStart: boolean
        isScrolling: boolean
        isScrollEnd: boolean
        timeout: number
        clearTimeout(): void
        scroll(self: ScrollState<El>): void
        scrollStart(e: Event): void
        scrolling(e: Event): void
        scrollEnd(e: Event): void
        mount(target: El): void
        clean(target: null): void
        ref(traget: El | null): void
        tick?: () => void
}

export type ScrollConfig<El extends Element = Element> = Partial<ScrollState<El>> | ScrollState<El>['scroll']
