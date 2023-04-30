import * as React from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
// @ts-ignore
import { Physics, RigidBody } from '@react-three/rapier'
import { Cella } from './Cella'

const { PI } = Math

type Vec3 = [number, number, number]

export default function CanvasPage(props) {
        return (
                <Canvas
                        camera={{ position: [0, 0.1, 1] as Vec3 }}
                        style={{ top: 0, left: 0, position: 'fixed' }}
                        {...props}
                >
                        <color attach="background" args={['Cornsilk']} />
                        <OrbitControls />
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <Suspense fallback={null}>
                                <Physics>
                                        {/* <Debug /> */}
                                        <Cella
                                                color="#cce7f2"
                                                length={10}
                                                position={[-0.2, -0.7, 0]}
                                        />
                                        <Cella
                                                color="#86d4f8"
                                                index={2}
                                                position={[0.3, 0.1, 0]}
                                                rotation-z={-PI / 2}
                                        />
                                        <Cella
                                                color="#1280d8"
                                                index={7}
                                                position={[0.6, 0.1, 0]}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color="#123185"
                                                index={8}
                                                position={[0.4, -0.1, 0]}
                                        />
                                        <Cella
                                                color="#132c7e"
                                                index={9}
                                                position={[0.45, 0.3, 0]}
                                                rotation-z={(-PI * 3) / 4}
                                        />
                                        <Cella
                                                color="#8cd6fb"
                                                index={3}
                                                position-x={0.1}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color="#2db2f2"
                                                index={4}
                                                position={[-1, -0.5, 0]}
                                        />
                                        <Cella
                                                color="#37b7f5"
                                                index={5}
                                                position-x={-0.5}
                                                rotation-z={PI}
                                        />
                                        <Cella
                                                color="#0c7bd4"
                                                index={6}
                                                position={[-0.7, 0.26, 0]}
                                                rotation-z={(-PI * 3) / 4}
                                        />
                                        <RigidBody type="fixed">
                                                <mesh
                                                        position-y={-1}
                                                        scale={[99, 1, 99]}
                                                >
                                                        <meshBasicMaterial color="Cornsilk" />
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
