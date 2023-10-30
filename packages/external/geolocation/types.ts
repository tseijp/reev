export interface GeolocationState {
        snapshot: [GeolocationState]
        geolocation: any
        id: number
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type GeolocationArg =
        | Partial<GeolocationState>
        | GeolocationState['onChange']
