import { vec2, Vec2 } from '../utils'

export const scrollValues = (e: any, out = vec2()): Vec2 => {
        const { scrollX: x, scrollLeft: xx } = e.currentTarget
        const { scrollY: y, scrollTop: yy } = e.currentTarget
        return vec2(x ?? xx ?? 0, y ?? yy ?? 0, out)
}
