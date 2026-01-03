export interface ResizeState<El extends Element = Element> {
        observer: ResizeObserver | null
        listener(): void
        mount(el: El): void
        clean(el: null): void
        resize(self: ResizeState<El>): void
        ref(target: El): void
}

export type ResizeArg<El extends Element = Element> = Partial<ResizeState<El>> | ResizeState<El>['resize']
