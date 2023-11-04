export interface OnlineState {
        snapshot: [OnlineState]
        online: boolean
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type OnlineArg = Partial<OnlineState> | OnlineState['onChange']
