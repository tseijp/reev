export interface ClipboardState {
        snapshot: [ClipboardState]
        clipboard: string
        callback(): void
        change(): void
        mount(): void
        clean(): void
}

export type ClipboardArg = Partial<ClipboardState> | ClipboardState['change']
