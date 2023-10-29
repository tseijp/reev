export type Vec2 = [x: number, y: number]

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
        onScroll(self: ScrollState<El>): void
        onScrollStart(e: Event): void
        onScrolling(e: Event): void
        onScrollEnd(e: Event): void
        onMount(target: Element): void
        onClean(target: null): void
        ref(traget: Element): void
        tick?: () => void
}

export type ScrollConfig = Partial<ScrollState> | ScrollState['onScroll']
