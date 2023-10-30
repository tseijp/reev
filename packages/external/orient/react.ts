import { useSyncExternalStore } from 'react'
import { orientEvent } from '.'
import { OrientState } from './types'
import { EventState } from '@reev/core'

let self: EventState<OrientState>

export const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

export const getSnapshot = () => self.snapshot

export const getServerSnapshot = () => self.snapshot

export const useOrient = () => {
        if (!self) self = orientEvent()
        const [ret] = useSyncExternalStore(
                subscribe,
                getSnapshot,
                getServerSnapshot
        )
        return ret
}
