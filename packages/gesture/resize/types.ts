export interface ResizeState<El extends Element = Element> {
        observer: ResizeObserver | null
        listener(): void
        onMount(el: El): void
        onClean(el: null): void
        onResize(self: ResizeState<El>): void
        ref(target: El): void
}

export type ResizeArg<El extends Element = Element> =
        | Partial<ResizeState<El>>
        | ResizeState<El>['onResize']
