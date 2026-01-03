export interface OnlineState {
        snapshot: [OnlineState]
        online: boolean
        callback(): void
        change(): void
        mount(): void
        clean(): void
}

export type OnlineArg = Partial<OnlineState> | OnlineState['change']
