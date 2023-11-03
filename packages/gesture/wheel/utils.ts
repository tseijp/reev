import { vec2, Vec2 } from '../utils'

const LINE_HEIGHT = 40

const PAGE_HEIGHT = 800

export const wheelValues = (event: Event, out: Vec2): Vec2 => {
        if (!(event instanceof WheelEvent)) return vec2(0, 0, out)

        let { deltaX, deltaY, deltaMode } = event
        if (deltaMode === 1) {
                deltaX *= LINE_HEIGHT
                deltaY *= LINE_HEIGHT
        } else if (deltaMode === 2) {
                deltaX *= PAGE_HEIGHT
                deltaY *= PAGE_HEIGHT
        }
        return vec2(deltaX, deltaY, out)
}
