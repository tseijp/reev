import * as React from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { RoundedBox, OrbitControls } from '@react-three/drei'

interface Props {
        alpha?: number
        beta?: number
        gamma?: number
        children?: React.ReactNode
}

export const Model = ({ alpha = 0, beta = 0, gamma = 0 }: Props) => {
        return (
                <group
                        rotation={[
                                THREE.MathUtils.degToRad(beta),
                                THREE.MathUtils.degToRad(gamma),
                                THREE.MathUtils.degToRad(-alpha),
                        ]}
                >
                        {/* CameraModuleGlass */}
                        <RoundedBox
                                args={[0.32, 0.32, 0.02]}
                                radius={0.02}
                                smoothness={16}
                                position={[-0.18, 0.6, 0.05]}
                        >
                                <meshPhongMaterial
                                        color="#000"
                                        transparent
                                        opacity={0.5}
                                        shininess={100}
                                />
                        </RoundedBox>
                        {/* BackCover */}
                        <RoundedBox
                                args={[0.8, 1.6, 0.1]}
                                radius={0.05}
                                smoothness={16}
                                position={[0, 0, 0.1]}
                        >
                                <meshPhongMaterial
                                        color="#201D24"
                                        shininess={80}
                                />
                        </RoundedBox>
                </group>
        )
}

type Vec3 = [number, number, number]

export const Mobile = (props: Props) => {
        return (
                <Canvas
                        orthographic
                        style={{ height: '10rem' }}
                        camera={{
                                zoom: 75,
                                position: [0, 0, 100] as Vec3,
                        }}
                >
                        <ambientLight />
                        <OrbitControls />
                        <pointLight position={[3, 4, 10]} />
                        <pointLight position={[-3, -4, -10]} />
                        <Model {...props} />
                </Canvas>
        )
}
