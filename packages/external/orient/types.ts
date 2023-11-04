import { Vec3 } from './utils'

export interface OrientState {
        snapshot: [OrientState]
        active: boolean
        _active: boolean
        _value: Vec3
        value: Vec3
        delta: Vec3
        offset: Vec3
        movement: Vec3
        memo: any
        callback(): void
        onChange(): void
        onMount(): void
        onClean(): void
}

export type OrientArg = Partial<OrientState> | OrientState['onChange']
