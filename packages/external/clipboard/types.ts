export interface ClipboardState {
        snapshot: [ClipboardState]
        clipboard: string
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type ClipboardArg = Partial<ClipboardState> | ClipboardState['onChange']
