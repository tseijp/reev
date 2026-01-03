import { useSyncExternalStore } from 'react'
import { clipboardEvent } from '.'
import type { EventState } from 'reev'
import type { ClipboardState } from './types'

let self: EventState<ClipboardState>

const subscribe = (callback = () => {}) => {
        self({ callback }).mount()
        return () => self({ callback }).clean()
}

const getSnapshot = () => self.snapshot

export const useClipboard = () => {
        if (!self) self = clipboardEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
