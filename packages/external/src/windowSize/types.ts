export interface WindowSizeState {
        snapshot: [WindowSizeState]
        width: number
        height: number
        callback(): void
        change(): void
        mount(): void
        clean(): void
}

export type WindowSizeArg = Partial<WindowSizeState> | WindowSizeState['change']
