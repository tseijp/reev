export interface MediaQueryState {
        snapshot: [MediaQueryState]
        callback(): void
        change(): void
        mount(): void
        clean(): void
}

export type MediaQueryArg = Partial<MediaQueryState> | MediaQueryState['change']
