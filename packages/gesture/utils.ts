/**
 * CALCULATE VECTOR
 * REF: https://github.com/toji/gl-matrix/blob/master/src/vec2.js
 */
export const isF = (f: unknown): f is Function => typeof f === 'function'

export const Vec = typeof Float32Array !== 'undefined' ? Float32Array : Array

export const vec2 = (x = 0, y = 0, out = new Vec(2)) => {
        out[0] = x
        out[1] = y
        return out as Vec2
}

export type Vec2 = [x: number, y: number]

export const addV = (a: Vec2, b: Vec2, out = vec2()): Vec2 => {
        out[0] = a[0] + b[0]
        out[1] = a[1] + b[1]
        return out
}

export const subV = (a: Vec2, b: Vec2, out = vec2()) => {
        out[0] = a[0] - b[0]
        out[1] = a[1] - b[1]
        return out
}

export const cpV = (a: Vec2, out = vec2()) => {
        out[0] = a[0]
        out[1] = a[1]
        return out
}

/**
 * SUPPORT
 */
const isBrowser =
        typeof window !== 'undefined' &&
        !!window.document &&
        !!window.document.createElement

const supportsTouchEvents = () => isBrowser && 'ontouchstart' in window

const isTouchScreen = () =>
        supportsTouchEvents() ||
        (isBrowser && window.navigator.maxTouchPoints > 1)

const supportsPointerEvents = () => isBrowser && 'onpointerdown' in window

const supportsPointerLock = () =>
        isBrowser && 'exitPointerLock' in window.document

const supportsGestureEvents = () => {
        try {
                // @ts-ignore eslint-disable-next-line
                return 'constructor' in GestureEvent
        } catch (e) {
                return false
        }
}

// prettier-ignore
export const SUPPORT = {                       // Mac
        isBrowser, // true
        get gesture() {
                return supportsGestureEvents() // false
        },
        get touch() {
                return supportsTouchEvents()   // false
        },
        get touchscreen() {
                return isTouchScreen()         // false
        },
        get pointer() {
                return supportsPointerEvents() // true
        },
        get pointerLock() {
                return supportsPointerLock()   // true
        },
}

export const getDevice = (lock = false) => {
        const pointerLock = lock && SUPPORT.pointerLock
        if (pointerLock) return 'mouse'
        if (SUPPORT.touch) return 'touch'
        if (SUPPORT.pointer) return 'pointer'
        return 'mouse'
}

export const getClientVec2 = (e: any, device: unknown, out: Vec2): Vec2 => {
        if (device !== 'touch') {
                return vec2(e.clientX, e.clientY, out)
        }
        const [touch] = e.changedTouches
        return vec2(touch.clientX, touch.clientY, out)
}
