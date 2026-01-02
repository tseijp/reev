export interface GeolocationState {
        snapshot: [GeolocationState]
        geolocation: any
        id: number
        callback(): void
        change(): void
        mount(): void
        clean(): void
}

export type GeolocationArg =
        | Partial<GeolocationState>
        | GeolocationState['change']
