export interface MediaQueryState {
        snapshot: [MediaQueryState]
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type MediaQueryArg =
        | Partial<MediaQueryState>
        | MediaQueryState['onChange']
