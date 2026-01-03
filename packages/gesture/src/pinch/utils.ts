import { SUPPORT, Vec2, vec2 } from '../utils'

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

/**
 * Wheel delta normalization constants
 * ref: https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
 */
const LINE_HEIGHT = 40
const PAGE_HEIGHT = 800
const PINCH_WHEEL_RATIO = 100

/**
 * Calculate distance and angle between two touch/pointer points
 * ref: https://github.com/pmndrs/use-gesture/blob/main/packages/core/src/utils/events.ts
 */
export interface DistanceAngle {
        distance: number
        angle: number
        origin: Vec2
}

export const distanceAngle = (p1: Touch | PointerEvent, p2: Touch | PointerEvent): DistanceAngle | null => {
        try {
                const dx = p2.clientX - p1.clientX
                const dy = p2.clientY - p1.clientY
                const cx = (p2.clientX + p1.clientX) / 2
                const cy = (p2.clientY + p1.clientY) / 2

                const distance = Math.hypot(dx, dy)
                // Convert to degrees, negative to match natural gesture direction
                const angle = -(Math.atan2(dx, dy) * 180) / Math.PI
                const origin = vec2(cx, cy)

                return { distance, angle, origin }
        } catch {
                return null
        }
}

/**
 * Get touch distance and angle from touch event using stored touch ids
 */
export const touchDistanceAngle = (event: TouchEvent, ids: number[]): DistanceAngle | null => {
        const touches = Array.from(event.touches).filter((touch) => ids.includes(touch.identifier))
        if (touches.length < 2) return null
        return distanceAngle(touches[0], touches[1])
}

/**
 * Get pointer distance and angle from pointer events map
 */
export const pointerDistanceAngle = (pointerEvents: Map<number, PointerEvent>): DistanceAngle | null => {
        const pointers = Array.from(pointerEvents.values())
        if (pointers.length < 2) return null
        return distanceAngle(pointers[0], pointers[1])
}

/**
 * Get all touch identifiers for the current target
 */
export const getCurrentTargetTouchIds = (event: TouchEvent): number[] => {
        return Array.from(event.touches)
                .filter((touch) => touch.target === event.currentTarget || (event.currentTarget as Node)?.contains?.(touch.target as Node))
                .map((touch) => touch.identifier)
}

/**
 * Normalize wheel values for pinch gesture (trackpad pinch)
 * Returns scale delta based on wheel deltaY
 */
export const wheelPinchDelta = (event: WheelEvent, currentScale: number): number => {
        let { deltaY, deltaMode } = event

        // Normalize wheel values
        if (deltaMode === 1) {
                deltaY *= LINE_HEIGHT
        } else if (deltaMode === 2) {
                deltaY *= PAGE_HEIGHT
        }

        // Convert to scale delta (negative because wheel down = zoom out)
        return (-deltaY / PINCH_WHEEL_RATIO) * currentScale
}

/**
 * WebKit gesture event type (Safari)
 */
export interface WebKitGestureEvent extends UIEvent {
        scale: number
        rotation: number
        clientX: number
        clientY: number
}
