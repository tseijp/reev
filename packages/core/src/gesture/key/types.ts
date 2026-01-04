export interface KeyState<El extends Element = Element> {
        target: El | Window
        pressedKey: string
        code: string
        event: KeyboardEvent
        key(e: KeyState): void
        keydown(e: KeyboardEvent): void
        mount(el: El): void
        clean(el: null): void
        ref(el: Element | null): void
}
export type KeyArg<El extends Element = Element> = Partial<KeyState<El>> | KeyState<El>['key']
