import React, { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import ReactDOM from 'react-dom'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Controls from './orbitControls'
import earthImg from './images/360image.jpeg'
import './styles.css'

function Earth() {
  const ref = useRef()
  const { gl } = useThree()
  const texture = useLoader(THREE.TextureLoader, earthImg)
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  return (
    <>
      <mesh ref={ref}>
        <sphereBufferGeometry args={[1000, 160, 160]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

ReactDOM.render(
  <>
    <Canvas camera={{ position: [0, 20, 0], fov: 120, near: 10, far: 15000 }}>
      <ambientLight intensity={0.8} />
      <axesHelper args={[100, 100, 100]} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <Controls autoRotate={true} enableDamping={true} enable={true} />
    </Canvas>
  </>,
  document.getElementById('root')
)
