/**
 * CALCULATE VECTOR
 * REF: https://github.com/toji/gl-matrix/blob/master/src/vec2.js
 */

const Vec = typeof Float32Array !== 'undefined' ? Float32Array : Array

export const vec3 = (x = 0, y = 0, z = 0, out = new Vec(3)): Vec3 => {
        out[0] = x
        out[1] = y
        out[2] = z
        return out as Vec3
}

export type Vec3 = [x: number, y: number, z: number]

export const addVec3 = (a: Vec3, b: Vec3, out = vec3()): Vec3 => {
        out[0] = a[0] + b[0]
        out[1] = a[1] + b[1]
        out[2] = a[2] + b[2]
        return out
}

export const subVec3 = (a: Vec3, b: Vec3, out = vec3()): Vec3 => {
        out[0] = a[0] - b[0]
        out[1] = a[1] - b[1]
        out[2] = a[2] - b[2]
        return out
}

export const cpVec3 = (a: Vec3, out = vec3()): Vec3 => {
        out[0] = a[0]
        out[1] = a[1]
        out[2] = a[2]
        return out
}
