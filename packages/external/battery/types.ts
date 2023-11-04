export interface BatteryState {
        snapshot: [BatteryState]
        target: any
        level: number // 0 ~ 1
        charging: boolean
        chargingTime: number // 3180
        dischargingTime: number // Infinity
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type BatteryArg = Partial<BatteryState> | BatteryState['onChange']
