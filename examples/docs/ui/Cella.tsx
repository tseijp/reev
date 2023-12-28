import * as React from 'react'
// @ts-ignore
import { RigidBody } from '@react-three/rapier'
import { useThree, type GroupProps } from '@react-three/fiber'

const px = (i = 0, l = 10) => -i / l - 1 / 2 / l + 1 / 2
const py = (i = 0, l = 10) => -i / 2 / l + 1 / 2
const pz = (i = 0, l = 10) => -i / 2 / l - 1 / 2 / l + 1 / 2
const sx = (_ = 0, l = 10) => 1 / l
const sy = (i = 0, l = 10) => i / l
const sz = (i = 0, l = 10) => (i + 1) / l

export const Cella = (props: CellaProps) => {
        const ref = React.useRef<any>()
        const camera = useThree((state) => state.camera)
        const handleClick = (e: any) => {
                const to = e.point.sub(camera.position).normalize()
                ref.current.applyImpulse(to, true)
                ref.current.applyTorqueImpulse(to, true)
        }

        return (
                <RigidBody ref={ref} mass={1}>
                        <CellaImpl {...props} onPointerDown={handleClick} />
                </RigidBody>
        )
}

export interface CellaProps extends GroupProps {
        color: string
        index?: number
        length?: number
}

export const CellaImpl = React.forwardRef((props: CellaProps, ref: any) => {
        const { color, index: i, length: l, ...other } = props

        if (!i)
                return (
                        <group ref={ref} {...other}>
                                <mesh
                                        castShadow
                                        position={[4 / l, 4 / l, 4 / l]}
                                        scale={[2 / l, 2 / l, 2 / l]}
                                >
                                        {/* @ts-ignore */}
                                        <mat color={color} />
                                        <boxGeometry args={[1, 1, 1]} />
                                </mesh>
                        </group>
                )

        return (
                <group ref={ref} {...other}>
                        <mesh
                                castShadow
                                position={[px(i, l), py(i, l), pz(i, l)]}
                                scale={[sx(i, l), sy(i, l), sz(i, l)]}
                        >
                                {/* @ts-ignore */}
                                <mat color={color} />
                                <boxGeometry args={[1, 1, 1]} />
                        </mesh>
                        <mesh
                                castShadow
                                position={[pz(i, l), px(i, l), py(i, l)]}
                                scale={[sz(i, l), sx(i, l), sy(i, l)]}
                        >
                                {/* @ts-ignore */}
                                <mat color={color} />
                                <boxGeometry args={[1, 1, 1]} />
                        </mesh>
                        <mesh
                                castShadow
                                position={[py(i, l), pz(i, l), px(i, l)]}
                                scale={[sy(i, l), sz(i, l), sx(i, l)]}
                        >
                                {/* @ts-ignore */}
                                <mat color={color} />
                                <boxGeometry args={[1, 1, 1]} />
                        </mesh>
                </group>
        )
})
