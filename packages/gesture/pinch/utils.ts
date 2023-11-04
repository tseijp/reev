import { SUPPORT } from '../utils'

/**
 * ref:
 * https://github.com/pmndrs/use-gesture/blob/main/packages/core/src/config/pinchConfigResolver.ts
 */
export const pinchDevice = (touch = false) => {
        if (!SUPPORT.touch && SUPPORT.gesture) return 'gesture'
        if (SUPPORT.touch && touch) return 'touch'
        if (SUPPORT.touchscreen) {
                if (SUPPORT.pointer) return 'pointer'
                if (SUPPORT.touch) return 'touch'
        }
        return 'wheel'
}
