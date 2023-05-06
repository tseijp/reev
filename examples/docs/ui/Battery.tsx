import * as React from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Cylinder, PresentationControls, Html } from '@react-three/drei'
import { useMemo } from 'react'
import { useRef } from 'react'
import { Mesh } from 'three'

export interface BatteryProps {
        level?: number
        charging?: boolean
}

export const Model = (props: BatteryProps) => {
        const { level = 0 } = props

        const electrodeDiameter = 1
        const electrodeHeight = 0.4
        const outerShellDiameter = 2.2
        const batteryHeight = 3.8
        const outerShellThickness = outerShellDiameter / 2 - electrodeDiameter
        const liquidLevel = batteryHeight * level
        const liquidRef = useRef<Mesh>()

        const liquidColor = useMemo(() => {
                const color = new THREE.Color()
                if (level < 0.2) color.setHSL(0, 1, 0.5)
                else if (level < 0.4) color.setHSL(0.16, 1, 0.5)
                else if (level < 1.0) color.setHSL(0.33, 1, 0.5)
                return color
        }, [level])

        return (
                <group rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
                        {/* Positive electrode */}
                        <Cylinder
                                args={[
                                        electrodeDiameter / 2,
                                        electrodeDiameter / 2,
                                        electrodeHeight,
                                        32,
                                ]}
                                position={[
                                        0,
                                        batteryHeight / 2 +
                                                electrodeHeight / 2 +
                                                outerShellThickness,
                                        0,
                                ]}
                        >
                                <meshPhysicalMaterial
                                        color={'white'}
                                        transparent={true}
                                        opacity={0.5}
                                        metalness={0.7}
                                        roughness={0.2}
                                />
                        </Cylinder>
                        {/* Battery outer shell */}
                        <Cylinder
                                args={[
                                        outerShellDiameter / 2,
                                        outerShellDiameter / 2,
                                        batteryHeight + outerShellThickness * 2,
                                        32,
                                        1,
                                        false,
                                        0,
                                        Math.PI * 2,
                                ]}
                        >
                                <meshPhysicalMaterial
                                        color={'white'}
                                        transparent={true}
                                        opacity={0.5}
                                        metalness={0.7}
                                        roughness={0.2}
                                        side={THREE.BackSide}
                                />
                        </Cylinder>
                        {/* Battery liquid */}
                        <Cylinder
                                ref={liquidRef}
                                args={[
                                        outerShellDiameter / 2 -
                                                outerShellThickness,
                                        outerShellDiameter / 2 -
                                                outerShellThickness,
                                        liquidLevel,
                                        32,
                                        1,
                                        false,
                                        0,
                                        Math.PI * 2,
                                ]}
                                position={[
                                        0,
                                        (liquidLevel - batteryHeight) / 2,
                                        0,
                                ]}
                        >
                                <meshPhysicalMaterial
                                        color={liquidColor}
                                        emissive={liquidColor}
                                        emissiveIntensity={0.5}
                                />
                        </Cylinder>
                </group>
        )
}

type Vec3 = [number, number, number]

export const Battery = (props: BatteryProps) => {
        const { level = 0, charging = false } = props

        return (
                <Canvas
                        orthographic
                        style={{ height: '10rem' }}
                        camera={{
                                zoom: 32,
                                position: [0, 0, 100] as Vec3,
                        }}
                >
                        <ambientLight />
                        <pointLight position={[10, 10, 10]} />
                        <PresentationControls
                                snap
                                config={{ mass: 4, tension: 500 }}
                        >
                                <Model level={level} />
                                <Html
                                        center
                                        transform
                                        style={{
                                                color: 'white',
                                                display: 'flex',
                                                fontSize: '2rem',
                                                userSelect: 'none',
                                                alignItems: 'center',
                                        }}
                                >
                                        <BatterySVG
                                                fill="white"
                                                width="2rem"
                                                height="2rem"
                                                style={{
                                                        left: '-2rem',
                                                        position: 'absolute',
                                                        display: charging
                                                                ? 'block'
                                                                : 'none',
                                                }}
                                        />
                                        {(level * 100) << 0}%
                                </Html>
                        </PresentationControls>
                </Canvas>
        )
}

const BatterySVG = (props: React.SVGProps<any>) => (
        <svg viewBox="0 0 1000 1000" {...props}>
                <g transform="translate(0,511) scale(0.1,-0.1)">
                        <path d="M4878.7,4977.6c-18.2-20.2-46.6-64.8-62.8-99.2c-85-166-2065.2-5495-2073.3-5578c-22.3-196.4,99.2-358.4,295.6-400.9c68.8-14.2,431.3-22.3,1034.6-22.3h931.4l4-1812.1c6.1-1905.2,6.1-1893.1,93.1-1840.5c18.2,12.2,54.7,56.7,79,101.2c22.3,42.5,500.1,1299.9,1060.9,2792.1C7188.9,648.8,7257.7,839.1,7259.7,964.6c2,115.4-6.1,141.7-54.7,206.5c-32.4,42.5-95.2,95.2-141.7,121.5c-85,44.6-95.2,44.6-1071.1,50.6l-988,6.1v1767.5c0,1231-6.1,1787.8-22.3,1832.4C4957.6,5020.1,4923.2,5028.2,4878.7,4977.6z" />
                </g>
        </svg>
)
