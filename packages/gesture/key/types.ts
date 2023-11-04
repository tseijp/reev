export interface KeyState<El extends Element = Element> {
        target: El | Window
        key: string
        code: string
        event: KeyboardEvent
        onKey(e: KeyState): void
        onKeydown(e: KeyboardEvent): void
        onMount(el: El): void
        onClean(): void
        ref(el: Element | null): void
}
export type KeyArg<El extends Element = Element> =
        | Partial<KeyState<El>>
        | KeyState<El>['onKey']
