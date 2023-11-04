import { useSyncExternalStore } from 'react'
import { clipboardEvent } from '.'
import { EventState } from 'reev'
import { ClipboardState } from './types'

let self: EventState<ClipboardState>

const subscribe = (callback = () => {}) => {
        self({ callback }).onMount()
        return () => self({ callback }).onClean()
}

const getSnapshot = () => self.snapshot

export const useClipboard = () => {
        if (!self) self = clipboardEvent()
        const [ret] = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
        return ret
}
