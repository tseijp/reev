import * as React from "react"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
// @ts-ignore
import { Physics, RigidBody } from "@react-three/rapier"

const px = (i = 0, l = 10) => -i / l - 1 / 2 / l + 1 / 2
const py = (i = 0, l = 10) => -i / 2 / l + 1 / 2
const pz = (i = 0, l = 10) => -i / 2 / l - 1 / 2 / l + 1 / 2
const sx = (i = 0, l = 10) => 1 / l
const sy = (i = 0, l = 10) => i / l
const sz = (i = 0, l = 10) => (i + 1) / l

export const CellaImpl = (props) => {
  const { color, index: i, length: l, ...other } = props

  if (!i)
    return (
      <group {...other}>
        <mesh position={[4 / l, 4 / l, 4 / l]} scale={[2 / l, 2 / l, 2 / l]}>
          <meshPhongMaterial color={color} />
        <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>
    )

  return (
    <group {...other}>
      <mesh
        position={[px(i, l), py(i, l), pz(i, l)]}
        scale={[sx(i, l), sy(i, l), sz(i, l)]}
      >
        <meshBasicMaterial color={color} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh
        position={[pz(i, l), px(i, l), py(i, l)]}
        scale={[sz(i, l), sx(i, l), sy(i, l)]}
      >
        <meshPhongMaterial color={color} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh
        position={[py(i, l), pz(i, l), px(i, l)]}
        scale={[sy(i, l), sz(i, l), sx(i, l)]}
      >
        <meshPhysicalMaterial color={color} />
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    </group>
  )
}

export const Cella = (props) => (
  <RigidBody>
    <CellaImpl {...props} />
  </RigidBody>
)

const { PI } = Math

export default function CanvasPage() {
        return (
          <Canvas
            camera={{ position: [0, 0.05, 1] }}
            style={{ top: 0, left: 0, position: "fixed" }}
          >
            <color attach="background" args={["Cornsilk"]} />
            <OrbitControls autoRotate />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <Physics>
                {/* <Debug /> */}
                <group position-x={0}>
                  <Cella color="#cce7f2" length={10} position={[-0.2, -0.7, 0]} />
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
                  <Cella color="#123185" index={8} position={[0.4, -0.1, 0]} />
                  <Cella
                    color="#132c7e"
                    index={9}
                    position={[0.45, 0.3, 0]}
                    rotation-z={(-PI * 3) / 4}
                  />
                </group>
                <Cella color="#8cd6fb" index={3} position-x={0.1} rotation-z={PI} />
                <Cella color="#2db2f2" index={4} position={[-1, -0.5, 0]} />
                <Cella color="#37b7f5" index={5} position-x={-0.5} rotation-z={PI} />
                <Cella
                  color="#0c7bd4"
                  index={6}
                  position={[-0.7, 0.26, 0]}
                  rotation-z={(-PI * 3) / 4}
                />
                <RigidBody type="fixed">
                  <mesh position-y={-1} scale={[99, 1, 99]}>
                    <meshBasicMaterial color="Cornsilk" />
                    <boxGeometry args={[1, 1, 1]} />
                  </mesh>
                </RigidBody>
              </Physics>
            </Suspense>
          </Canvas>
        )
}