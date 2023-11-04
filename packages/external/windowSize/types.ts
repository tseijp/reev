export interface WindowSizeState {
        snapshot: [WindowSizeState]
        width: number
        height: number
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type WindowSizeArg =
        | Partial<WindowSizeState>
        | WindowSizeState['onChange']
