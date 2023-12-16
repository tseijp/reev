import * as React from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { useColorMode } from '@docusaurus/theme-common'
// @ts-ignore
import { Physics, RigidBody } from '@react-three/rapier'
import { Cella } from './Cella'
import Title from './Title'

const { PI } = Math

type Vec3 = [number, number, number]

export default function CanvasPage() {
        const isDark = useColorMode().colorMode === 'dark'

        return (
                <Canvas
                        camera={{ position: [0, 0.25, 1.5] as Vec3 }}
                        style={{ top: 0, left: 0, position: 'fixed' }}
                >
                        <Html
                                transform
                                rotation-x={-Math.PI / 2}
                                position-y={-0.5}
                                position-z={0.66}
                                scale={0.1}
                        >
                                <Title isDark={isDark}>
                                        reactive event state managers
                                </Title>
                                <Title isDark={isDark}>
                                        via TypeScript, React, Solid.
                                </Title>
                        </Html>
                        <color
                                attach="background"
                                args={[isDark ? '#132c7e' : '#f2c245']}
                        />
                        <OrbitControls enableZoom={false} />
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <Suspense fallback={null}>
                                <Physics>
                                        {/* <Debug /> */}
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#cce7f2'
                                                                : '#f2c245'
                                                }
                                                length={10}
                                                index={0}
                                                position={[-0.2, -0.7, 0]}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#86d4f8'
                                                                : '#fd9344'
                                                }
                                                index={2}
                                                position={[0.3, 0.1, 0]}
                                                rotation-z={-PI / 2}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#8cd6fb'
                                                                : '#fa903d'
                                                }
                                                index={3}
                                                position-x={0.1}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#2db2f2'
                                                                : '#f05741'
                                                }
                                                index={4}
                                                position={[-1, -0.5, 0]}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#37b7f5' // !!
                                                                : '#f05842' // !!
                                                }
                                                index={5}
                                                position-x={-0.5}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#0c7bd4'
                                                                : '#c64041'
                                                }
                                                index={6}
                                                position={[-0.7, 0.26, 0]}
                                                rotation-z={(-PI * 3) / 4}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#1280d8'
                                                                : '#c53c3d'
                                                }
                                                index={7}
                                                position={[0.6, 0.1, 0]}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#123185'
                                                                : '#8c3a39'
                                                }
                                                index={8}
                                                position={[0.4, -0.1, 0]}
                                        />
                                        <Cella
                                                color={
                                                        isDark
                                                                ? '#132c7e'
                                                                : '#843332'
                                                }
                                                index={9}
                                                position={[0.45, 0.3, 0]}
                                                rotation-z={(-PI * 3) / 4}
                                        />
                                        <RigidBody type="fixed">
                                                <mesh
                                                        position-y={-1}
                                                        scale={[99, 1, 99]}
                                                >
                                                        <meshBasicMaterial color="#ececec" />
                                                        <boxGeometry
                                                                args={[1, 1, 1]}
                                                        />
                                                </mesh>
                                        </RigidBody>
                                </Physics>
                        </Suspense>
                </Canvas>
        )
}
